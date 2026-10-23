export function getVideoAttrsValues(props: Record<string, unknown>, hasBackgroundProp: boolean, reduceMotion = false) {
    const controls = !!props.controls && !hasBackgroundProp
    const loop = !!props.loop || hasBackgroundProp || !!props.autoplay
    // Muted looping video without native controls: a pause button is rendered by VVideoPlayer
    const ambient = loop && !controls

    return {
        playsinline: props.playsinline || hasBackgroundProp,
        muted: !!props.muted || hasBackgroundProp || !!props.autoplay,
        loop,
        // No autoplay of ambient videos when the user prefers reduced motion (WCAG 2.2.2 / 2.3.3)
        autoplay: (!!props.autoplay || hasBackgroundProp) && !(ambient && reduceMotion),
        controls,
        ambient,
    }
}
