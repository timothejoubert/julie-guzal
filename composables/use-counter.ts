interface UseCounterParams {
    options?: UseCounterOptions
    onFinish?: () => void
}

interface UseCounterOptions {
    startValue?: number
    endValue?: number
    duration?: number
}
export function useCounter(params: UseCounterParams) {
    const options = {
        startValue: params?.options?.startValue || 0,
        endValue: params?.options?.endValue || 100,
        duration: params?.options?.duration || 1200,
    }

    const counterOutput = ref(0)

    // Utils
    function startCounter() {
        let startTimestamp: null | number = null

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
