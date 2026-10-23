import { gsap } from 'gsap'

// Shared element transition: the clicked home card image flies to the project page hero.
// A fixed clone (outside both pages) is resized from the card clip to the hero box with transforms only:
// the frame is scaled non-uniformly and each image layer is counter-scaled, so the image itself is never distorted.
// Card and hero files are centered crops (imgix `fit=crop`) of the same original: both layers are placed inside one
// interpolated "original" box, so they stay aligned pixel to pixel and the image moves as a single picture.
// No cross-fade: mixing two files of different sharpness reads as a doubled image while moving.

const FLIGHT_DURATION = 1
const FLIGHT_EASE = 'expo.inOut'
const FADE_OUT_DURATION = 0.3
const Z_INDEX = 1200 // above the leaving (1100) and the entering page

// Set on the entering page elements laid over the hero (e.g. back link): hidden during the flight, faded in after it
export const TRANSITION_OVERLAY_ATTRIBUTE = 'data-transition-overlay'

interface Rect { x: number, y: number, w: number, h: number }

interface Source {
    img: HTMLImageElement
    clip: HTMLElement
    to: string
    originalRatio?: number
}

interface Layer {
    img: HTMLImageElement
    region: Rect // part of the original shown by this file (0-1 coordinates)
    base: Rect // size at the end of the flight (scale 1: crisp image on handoff)
}

interface Flight {
    img: HTMLImageElement
    root: HTMLDivElement
    originalRatio: number
    clip: Rect // card visible box when the flight was created
    card: Layer & { ratio: number }
    hero?: Layer & { el: HTMLImageElement }
    target?: Rect // hero box at the end of the transition
    // Screen box of the whole original image at the start and at the end of the flight
    from: Rect
    to?: Rect
    overlays: HTMLElement[]
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
function cover(ratio: number, box: Rect): Rect {
    const w = Math.max(box.w, box.h * ratio)
    const h = w / ratio
    return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h }
}

// Part of an original image (ratio `original`) kept by a centered crop of ratio `crop`, in 0-1 coordinates
function cropRegion(original: number, crop: number): Rect {
    if (original > crop) {
        const w = crop / original
        return { x: (1 - w) / 2, y: 0, w, h: 1 }
    }
    const h = original / crop
    return { x: 0, y: (1 - h) / 2, w: 1, h }
}

// Screen box of the whole original, from the screen box of one of its crops
function originalRect(displayed: Rect, region: Rect): Rect {
    const w = displayed.w / region.w
    const h = displayed.h / region.h
    return { x: displayed.x - region.x * w, y: displayed.y - region.y * h, w, h }
}

function regionRect(original: Rect, region: Rect): Rect {
    return {
        x: original.x + region.x * original.w,
        y: original.y + region.y * original.h,
        w: region.w * original.w,
        h: region.h * original.h,
    }
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

    const original = lerpRect(f.from, f.to ?? f.from, p)
    placeLayer(f.card, regionRect(original, f.card.region), frame, sx, sy)

    if (f.hero) placeLayer(f.hero, regionRect(original, f.hero.region), frame, sx, sy)
}

function removeFlight(f: Flight) {
    f.root.remove()
    f.img.style.removeProperty('visibility')
    f.hero?.el.style.removeProperty('opacity')
    if (flight === f) flight = null
}

function showOverlays(f: Flight, duration: number) {
    if (!f.overlays.length) return

    gsap.killTweensOf(f.overlays)
    gsap.to(f.overlays, { opacity: 1, duration, clearProps: 'opacity' })
}

function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Called on click on a home card link, before the navigation starts
// `originalRatio`: ratio of the uncropped image (Prismic dimensions), to align the card and hero crops
export function registerSharedImageSource(img: HTMLImageElement, clip: HTMLElement, to: string, originalRatio?: number) {
    source = { img, clip, to: normalizePath(to), originalRatio }
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
    // Unknown original: consider the card file as the original
    const originalRatio = current.originalRatio && Number.isFinite(current.originalRatio) ? current.originalRatio : ratio
    const cardRegion = cropRegion(originalRatio, ratio)

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

    // The image rect (not the clip) keeps the visible crop: the card image can be zoomed (hover scale) inside the clip
    const card = { img: createLayer(current.img.currentSrc), ratio, region: cardRegion, base: imgRect }
    card.img.style.willChange = 'transform'
    root.append(card.img)

    const from = originalRect(imgRect, cardRegion)
    const f: Flight = { img: current.img, root, originalRatio, clip, card, from, overlays: [] }
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
    // Hero not decoded (timeout): the card image alone lands as a cover of the hero box
    f.to = originalRect(cover(f.card.ratio, target), f.card.region)

    if (hero && hero.complete && hero.naturalWidth && hero.currentSrc) {
        const ratio = imageRatio(hero, target)
        const region = cropRegion(f.originalRatio, ratio)
        // The real hero is an `object-fit: cover` of its box
        const heroRect = cover(ratio, target)
        const heroLayer = { img: createLayer(hero.currentSrc), region, base: heroRect, el: hero }
        setLayerBase(heroLayer)
        heroLayer.img.style.willChange = 'transform'

        // Same file as the hero (already decoded): only the cached copy is decoded again
        await heroLayer.img.decode().catch(() => {})
        if (flight !== f) return false

        // Over the card image, aligned on the same pixels: the swap is invisible. The card layer stays below and only
        // shows where its crop goes beyond the hero one (clipped out by the frame on arrival).
        f.root.append(heroLayer.img)
        f.hero = heroLayer
        f.to = originalRect(heroRect, region)
        hero.style.opacity = '0'
    }

    f.card.base = regionRect(f.to, f.card.region)
    setLayerBase(f.card)

    // The page is still off-screen: hide what would pass over the flying image, then pop over the hero on handoff
    f.overlays = [...page.querySelectorAll<HTMLElement>(`[${TRANSITION_OVERLAY_ATTRIBUTE}]`)]
    gsap.set(f.overlays, { opacity: 0 })

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
        showOverlays(f, FADE_OUT_DURATION)
        return
    }

    f.hero.el.style.removeProperty('opacity')
    requestAnimationFrame(() => requestAnimationFrame(() => {
        removeFlight(f)
        showOverlays(f, FADE_OUT_DURATION)
    }))
}

export function cancelSharedImage() {
    if (!flight) return

    gsap.killTweensOf(flight.root)
    showOverlays(flight, 0)
    removeFlight(flight)
}
