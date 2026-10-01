import type { MaybeRefOrGetter } from 'vue'

export interface ScrollParallaxLayer {
    /** Element moved by the parallax (transform only) */
    target: Element
    /** Element whose position in the viewport drives the progress (default: `target`) */
    trigger?: Element
    /** ScrollTrigger start (default: when the trigger top enters the viewport, clamped to the top of the page) */
    start?: string
    /** ScrollTrigger end (default: when the trigger bottom leaves the viewport) */
    end?: string
    /** Transform reached at the end, e.g. `{ yPercent: 20 }` or `{ y: () => height * 0.01 }` (functions are re-evaluated on each ScrollTrigger refresh) */
    vars: Pick<GSAPTweenVars, 'x' | 'y' | 'xPercent' | 'yPercent'>
}

interface UseScrollParallaxOptions {
    /** Media query enabling the parallax */
    media: string
}

/**
 * Scrubbed scroll parallax on transforms.
 *
 * This is the one place where parallax tweens are created: they live in a `gsap.context()` that is reverted
 * (tweens and ScrollTriggers killed, inline transforms removed) when the media query stops matching, when the
 * layers change and on unmount. Motion preferences are to be handled here too.
 *
 * The media query is watched with VueUse's useMediaQuery (reactive, tied to the component lifecycle, like the
 * rest of the codebase); `gsap.matchMedia()` would work too. Tweens are reverted, not only killed, when leaving
 * the breakpoint, otherwise their last transform stays applied.
 */
export function useScrollParallax(layers: MaybeRefOrGetter<ScrollParallaxLayer[]>, options: UseScrollParallaxOptions) {
    const { $gsap } = useNuxtApp()
    const isEnabled = useMediaQuery(options.media)
    let context: gsap.Context | undefined
    let currentLayers: ScrollParallaxLayer[] = []

    function revert() {
        context?.revert()
        context = undefined
    }

    function setup() {
        revert()
        if (!isEnabled.value || !currentLayers.length) return

        context = $gsap.context(() => {
            currentLayers.forEach(({ target, trigger, start = 'clamp(top bottom)', end = 'bottom top', vars }) => {
                $gsap.to(target, {
                    ...vars,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: trigger || target,
                        start,
                        end,
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                })
            })
        })
    }

    onMounted(() => {
        watch(
            () => toValue(layers),
            (list) => {
                // Only rebuild when the targeted elements change, not on every re-render of the component
                const sameTargets = currentLayers.length === list.length
                    && list.every((layer, index) => layer.target === currentLayers[index]?.target && layer.trigger === currentLayers[index]?.trigger)
                if (sameTargets && context) return

                currentLayers = list
                setup()
            },
            { immediate: true, flush: 'post' },
        )
        watch(isEnabled, setup)
    })

    onBeforeUnmount(revert)
}
