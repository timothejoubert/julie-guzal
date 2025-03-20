interface UseCounterOptions {
    startValue?: number
    endValue?: number
    duration?: number
    onFinish?: () => void
    onStart?: () => void
}
export function useCounter(params?: UseCounterOptions) {
    const options = {
        startValue: params?.startValue || 0,
        endValue: params?.endValue || 100,
        duration: params?.duration || 1200,
    }

    const counterOutput = ref(0)

    // Utils
    function startCounter() {
        let startTimestamp: null | number = null
        params?.onStart?.()

        const increaseCounter = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp

            const progress = Math.min((timestamp - startTimestamp) / options.duration, 1)

            counterOutput.value = Math.floor(progress * (options.endValue - options.startValue) + options.startValue)

            if (progress < 1) {
                window.requestAnimationFrame(increaseCounter)
            }
            else {
                params?.onFinish?.()
            }
        }

        window.requestAnimationFrame(increaseCounter)
    }

    return { startCounter, counterOutput }
}
