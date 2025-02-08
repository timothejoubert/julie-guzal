export function getVideoAttrsValues(props: Record<string, unknown>, hasBackgroundProp: boolean) {
    return {
        playsinline: props.playsinline || hasBackgroundProp,
        muted: !!props.muted || hasBackgroundProp || !!props.autoplay,
        loop: !!props.loop || hasBackgroundProp || !!props.autoplay,
        autoplay: !!props.autoplay || hasBackgroundProp,
        controls: props.controls && !hasBackgroundProp,
    }
}
