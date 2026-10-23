import { gsap } from 'gsap'

// Shared element transition: the clicked home card image flies to the project page hero.
// A fixed clone (outside both pages) is resized from the card clip to the hero box with transforms only:
// the frame is scaled non-uniformly and each image layer is counter-scaled, so the image itself is never distorted.

const FLIGHT_DURATION = 1 // same as the entering page animation
const FLIGHT_EASE = 'power2.inOut'
// Part of the flight during which the card image cross-fades into the hero image
const CROSS_FADE_END = 0.6
const FADE_OUT_DURATION = 0.3
const Z_INDEX = 1200 // above the leaving (1100) and the entering page

interface Rect { x: number, y: number, w: number, h: number }

interface Source {
    img: HTMLImageElement
    clip: HTMLElement
    to: string
}

interface Layer {
    img: HTMLImageElement
    ratio: number
    base: Rect // size at the end of the flight (scale 1: crisp image on handoff)
}

interface Flight {
    img: HTMLImageElement
    root: HTMLDivElement
    clip: Rect // card visible box when the flight was created
    card: Layer & { zoom: number, offsetX: number, offsetY: number }
    hero?: Layer & { el: HTMLImageElement }
    target?: Rect // hero box at the end of the transition
}

let source: Source | null = null
let flight: Flight | null = null

function normalizePath(path: string) {
    return path.length > 1 ? path.replace(/\/+$/, '') : path
}

function toRect(domRect: DOMRect): Rect {
    return { x: domRect.left, y: domRect.top, w: domRect.width, h: domRect.height }
}

function lerp(from: number, to: number, p: number) {
    return from + (to - from) * p
}

function lerpRect(from: Rect, to: Rect, p: number): Rect {
    return { x: lerp(from.x, to.x, p), y: lerp(from.y, to.y, p), w: lerp(from.w, to.w, p), h: lerp(from.h, to.h, p) }
}

// Same box as `object-fit: cover; object-position: center` of an image with this ratio
function cover(ratio: number, box: Rect, zoom = 1): Rect {
    const w = Math.max(box.w, box.h * ratio) * zoom
    const h = w / ratio
    return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h }
}

function imageRatio(img: HTMLImageElement, fallback: Rect) {
    return img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : fallback.w / fallback.h
}

function createLayer(src: string) {
    const img = document.createElement('img')
    img.alt = ''
    img.src = src
    Object.assign(img.style, { position: 'absolute', top: '0', left: '0', maxWidth: 'none', transformOrigin: '0 0' })
    return img
}

function setLayerBase(layer: Layer) {
    layer.img.style.width = `${layer.base.w}px`
    layer.img.style.height = `${layer.base.h}px`
}

// Places the frame on `frame` and a layer on `rect` (screen coordinates), whatever the frame scale
function placeLayer(layer: Layer, rect: Rect, frame: Rect, sx: number, sy: number) {
    gsap.set(layer.img, {
        x: (rect.x - frame.x) / sx,
        y: (rect.y - frame.y) / sy,
        scaleX: rect.w / (layer.base.w * sx),
        scaleY: rect.h / (layer.base.h * sy),
    })
}

function render(f: Flight, p: number) {
    const target = f.target ?? f.clip
    const frame = lerpRect(f.clip, target, p)
    // The root keeps the target size: it ends at scale 1
    const sx = frame.w / target.w
    const sy = frame.h / target.h

    gsap.set(f.root, { x: frame.x, y: frame.y, scaleX: sx, scaleY: sy })

    const cardRect = cover(f.card.ratio, frame, lerp(f.card.zoom, 1, p))
    cardRect.x += f.card.offsetX * (1 - p)
    cardRect.y += f.card.offsetY * (1 - p)
    placeLayer(f.card, cardRect, frame, sx, sy)

    if (f.hero) {
        placeLayer(f.hero, cover(f.hero.ratio, frame), frame, sx, sy)
        gsap.set(f.hero.img, { opacity: Math.min(p / CROSS_FADE_END, 1) })
    }
}

function removeFlight(f: Flight) {
    f.root.remove()
    f.img.style.removeProperty('visibility')
    f.hero?.el.style.removeProperty('opacity')
    if (flight === f) flight = null
}

function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Called on click on a home card link, before the navigation starts
export function registerSharedImageSource(img: HTMLImageElement, clip: HTMLElement, to: string) {
    source = { img, clip, to: normalizePath(to) }
}

// Leave hook: creates the clone over the card, then hides the card image (the home leaves without it)
export function startSharedImage() {
    cancelSharedImage()

    const current = source
    source = null
    const route = useRouter().currentRoute.value
    if (!current || current.to !== normalizePath(route.path) || isReducedMotion()) return
    if (!current.img.isConnected || !current.img.currentSrc) return

    const clip = toRect(current.clip.getBoundingClientRect())
    const imgRect = toRect(current.img.getBoundingClientRect())
    if (!clip.w || !clip.h || !imgRect.w) return

    const ratio = imageRatio(current.img, imgRect)
    const coverRect = cover(ratio, clip)

    const root = document.createElement('div')
    root.setAttribute('aria-hidden', 'true')
    Object.assign(root.style, {
        position: 'fixed',
        zIndex: String(Z_INDEX),
        top: '0',
        left: '0',
        overflow: 'hidden',
        pointerEvents: 'none',
        transformOrigin: '0 0',
        willChange: 'transform',
        contain: 'strict',
    })

    const card = {
        img: createLayer(current.img.currentSrc),
        ratio,
        base: coverRect,
        // The visible crop of the card: its image can be zoomed (hover scale) inside the clip
        zoom: imgRect.w / coverRect.w,
        offsetX: imgRect.x + imgRect.w / 2 - (clip.x + clip.w / 2),
        offsetY: imgRect.y + imgRect.h / 2 - (clip.y + clip.h / 2),
    }
    card.img.style.willChange = 'transform'
    root.append(card.img)

    const f: Flight = { img: current.img, root, clip, card }
    root.style.width = `${clip.w}px`
    root.style.height = `${clip.h}px`
    setLayerBase(card)
    render(f, 0)
    document.body.append(root)
    flight = f

    // The image is already loaded: hide the original once the clone is ready to paint
    card.img.decode().catch(() => {}).finally(() => {
        if (flight === f) current.img.style.visibility = 'hidden'
    })
}

// Enter hook, once the hero is decoded: measures where the hero ends (the entering page without its transform)
// and loads the hero image in the clone. Resolves false when there is nothing to animate.
export async function prepareSharedImageTarget(page: HTMLElement, hero: HTMLImageElement | null) {
    const f = flight
    if (!f) return false

    if (hero) {
        const y = gsap.getProperty(page, 'y')
        const scale = gsap.getProperty(page, 'scale')
        gsap.set(page, { y: 0, scale: 1 })
        f.target = toRect(hero.getBoundingClientRect())
        gsap.set(page, { y, scale })
    }

    // No hero box to land on: the card image leaves with the home page, like any other navigation
    const target = f.target
    if (!target?.w || !target.h) {
        removeFlight(f)
        return false
    }

    f.root.style.width = `${target.w}px`
    f.root.style.height = `${target.h}px`
    f.card.base = cover(f.card.ratio, target)
    setLayerBase(f.card)

    if (hero && hero.complete && hero.naturalWidth && hero.currentSrc) {
        const ratio = imageRatio(hero, target)
        const heroLayer = { img: createLayer(hero.currentSrc), ratio, base: cover(ratio, target), el: hero }
        setLayerBase(heroLayer)
        heroLayer.img.style.willChange = 'transform, opacity'
        heroLayer.img.style.opacity = '0'

        // Same file as the hero (already decoded): only the cached copy is decoded again
        await heroLayer.img.decode().catch(() => {})
        if (flight !== f) return false

        f.root.append(heroLayer.img)
        f.hero = heroLayer
        hero.style.opacity = '0'
    }

    render(f, 0)
    return true
}

// Adds the flight to the entering page timeline, so the page transition ends with it
export function addSharedImageFlight(tl: gsap.core.Timeline) {
    const f = flight
    if (!f) return

    const progress = { p: 0 }
    tl.to(progress, {
        p: 1,
        duration: FLIGHT_DURATION,
        ease: FLIGHT_EASE,
        onUpdate: () => {
            if (flight === f) render(f, progress.p)
        },
    }, 0)
}

// After enter: the real hero takes over, then the clone is removed once the hero is painted
export function finishSharedImage() {
    const f = flight
    if (!f) return

    // Hero not decoded before the timeout: the card image landed on the hero box, fade it out over the real hero
    if (!f.hero) {
        gsap.to(f.root, { opacity: 0, duration: FADE_OUT_DURATION, onComplete: () => removeFlight(f) })
        return
    }

    f.hero.el.style.removeProperty('opacity')
    requestAnimationFrame(() => requestAnimationFrame(() => removeFlight(f)))
}

export function cancelSharedImage() {
    if (!flight) return

    gsap.killTweensOf(flight.root)
    removeFlight(flight)
}
