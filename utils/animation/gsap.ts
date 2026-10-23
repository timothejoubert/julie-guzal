import type { gsap as Gsap } from 'gsap'
import type { ScrollTrigger as GsapScrollTrigger } from 'gsap/ScrollTrigger'

// GSAP and ScrollTrigger only drive scroll effects and page transitions: they are loaded on demand instead of
// being part of the entry chunk (they were about half of it, unused for the first paint).
// The bindings below are live: modules importing them see the instances once `loadGsap()` has resolved.
// eslint-disable-next-line import/no-mutable-exports
export let gsap: typeof Gsap
// eslint-disable-next-line import/no-mutable-exports
export let ScrollTrigger: typeof GsapScrollTrigger | undefined

let loading: Promise<{ gsap: typeof Gsap, ScrollTrigger: typeof GsapScrollTrigger }> | undefined

export function loadGsap() {
    loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, plugin]) => {
        core.gsap.registerPlugin(plugin.ScrollTrigger)
        gsap = core.gsap
        ScrollTrigger = plugin.ScrollTrigger

        return { gsap: core.gsap, ScrollTrigger: plugin.ScrollTrigger }
    })

    return loading
}
