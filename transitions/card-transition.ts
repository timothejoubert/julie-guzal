import { gsap } from 'gsap'
import type { TransitionProps } from 'vue'

// Below this width the page swap is instant (no animation)
const MIN_ANIMATED_WIDTH = 700
// Max time the transition waits for the entering page hero image before animating anyway
const HERO_TIMEOUT = 1800

// Set on the image that must be loaded and decoded before the entering page is revealed
export const TRANSITION_HERO_ATTRIBUTE = 'data-transition-hero'

type Deferred = { promise: Promise<void>, resolve: () => void }

const timelines = new WeakMap<Element, gsap.core.Timeline>()
// Leave and enter animations start together, once the entering page is ready (hero decoded)
let enterReady: Deferred | null = null

function isInstant() {
    return window.innerWidth < MIN_ANIMATED_WIDTH
}

function createDeferred(): Deferred {
    let resolve = () => {}
    const promise = new Promise<void>((r) => {
        resolve = r
    })
    return { promise, resolve }
}

function wait(ms: number) {
    return new Promise<void>(resolve => window.setTimeout(resolve, ms))
}

// Resolves when the image is loaded and decoded, when it fails, or after `timeout`
function waitForImage(img: HTMLImageElement, timeout: number) {
    return new Promise<void>((resolve) => {
        const finish = () => {
            window.clearTimeout(timer)
            img.removeEventListener('load', decode)
            img.removeEventListener('error', finish)
            resolve()
        }
        // decode() also waits for a pending load; it rejects on error or when the request changes
        // (e.g. <source> reselection), in which case the load/error listeners or the timeout take over
        function decode() {
            img.decode().then(finish, () => {
                if (img.complete) finish()
            })
        }
        const timer = window.setTimeout(finish, timeout)

        if (img.complete && !img.naturalWidth) {
            finish() // broken image: don't wait for nothing
            return
        }

        img.addEventListener('load', decode)
        img.addEventListener('error', finish)
        decode()
    })
}

function killTimeline(el: Element) {
    timelines.get(el)?.kill()
    timelines.delete(el)
}

function releaseScroll() {
    const nuxtApp = useNuxtApp()
    const { enabledScroll } = useBodyScrollLock()
    const { animationComplete } = usePageTransitionState()

    enabledScroll()
    nuxtApp.$lenis.start()
    // The new page is in the flow again: start from its top and resync Lenis with the real scroll position
    nuxtApp.$lenis.scrollTo(0, { immediate: true, force: true })
    animationComplete.value = true
}

export const cardPageTransition: TransitionProps = {
    name: 'card-transition',
    css: false, // JS only: skip Vue's CSS class toggling and transition style reads
    onLeave: (el, done) => {
        if (isInstant()) {
            done()
            return
        }

        const { animationComplete, pageDirection } = usePageTransitionState()
        animationComplete.value = false

        const gate = enterReady = createDeferred()
        const tl = gsap.timeline({
            paused: true,
            defaults: { force3D: true },
            onComplete() {
                timelines.delete(el)
                done()
            },
        })
        timelines.set(el, tl)

        // Only transform/opacity are animated (compositor-friendly), no layout property
        if (pageDirection.value === 'forwards') {
            gsap.set(el, {
                transformOrigin: 'top',
                willChange: 'transform, opacity',
            })

            // Need to finish before enter page to place
            tl.to(el, {
                y: -60,
                opacity: 0.3,
                scale: 0.9,
                duration: 0.8,
                ease: 'power1.in',
            })
        }
        else {
            // Freeze the page where it currently is (position: fixed alone would snap it back to its top)
            gsap.set(el, {
                position: 'fixed',
                top: -window.scrollY,
                left: 0,
                width: '100%',
                zIndex: '1100',
                transformOrigin: 'top',
                willChange: 'transform',
            })

            tl.to(el, {
                y: window.innerHeight,
                duration: 1,
                ease: 'power3.out',
            })
        }

        // Safety net if no enter hook resolves the gate
        Promise.race([gate.promise, wait(HERO_TIMEOUT + 200)]).then(() => {
            if (timelines.get(el) === tl) tl.play()
        })
    },
    onLeaveCancelled: (el) => {
        killTimeline(el)
        gsap.set(el, { clearProps: 'all' })
    },
    onBeforeEnter: () => {
        const { disableScroll } = useBodyScrollLock()
        disableScroll()

        const nuxtApp = useNuxtApp()
        nuxtApp.$lenis.stop()
    },
    onEnter: (el, done) => {
        if (isInstant()) {
            done()
            return
        }
        const { pageDirection } = usePageTransitionState()
        const gate = enterReady

        const tl = gsap.timeline({
            paused: true,
            defaults: { force3D: true },
            onComplete() {
                timelines.delete(el)
                gsap.set(el, { clearProps: 'all' })
                done()
            },
        })
        timelines.set(el, tl)

        const initialState = {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            maxWidth: `calc(100% - var(--scroll-bar-width, 0px))`,
            transformOrigin: 'top',
        }

        if (pageDirection.value === 'forwards') {
            gsap.set(el, {
                ...initialState,
                y: window.innerHeight * 1.3,
                scale: 1.1,
                willChange: 'transform',
            })

            tl.to(el, {
                y: 0,
                scale: 1,
                duration: 1,
                ease: 'power2.out',
            })
        }
        else {
            gsap.set(el, {
                ...initialState,
                y: -60,
                opacity: 0.3,
                scale: 0.9,
                willChange: 'transform, opacity',
            })

            tl.to(el, {
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: 'power1.out',
            })
        }

        // Don't reveal the page before its hero image is loaded and decoded (with a timeout)
        const hero = el.querySelector<HTMLImageElement>(`img[${TRANSITION_HERO_ATTRIBUTE}]`)
        const ready = hero ? waitForImage(hero, HERO_TIMEOUT) : Promise.resolve()

        ready.then(() => {
            // Start on a fresh frame so the first animated frame doesn't absorb the page mount cost
            requestAnimationFrame(() => {
                gate?.resolve()
                if (enterReady === gate) enterReady = null
                if (timelines.get(el) === tl) tl.play()
            })
        })
    },
    onAfterEnter: () => {
        releaseScroll()
        useNuxtApp().$scrollTrigger?.refresh()
    },
    onEnterCancelled: (el) => {
        // A new navigation started before the end: never leave the scroll locked or Lenis stopped
        killTimeline(el)
        gsap.set(el, { clearProps: 'all' })
        enterReady?.resolve()
        releaseScroll()
    },
}
