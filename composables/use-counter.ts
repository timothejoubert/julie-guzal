interface UseCounterParams {
    options?: UseCounterOptions
    onFinish?: () => void
}

interface UseCounterOptions {
    startValue: number
    endValue: number
    startDelay: number
    counterDuration: number
    leaveDuration: number
}
export function useCounter(params: Partial<UseCounterParams>) {
    const options = {
        startValue: params?.options?.startValue || 0,
        endValue: params?.options?.endValue || 100,
        startDelay: params?.options?.startDelay || 0.2,
        counterDuration: params?.options?.counterDuration || 1.2,
        leaveDuration: params?.options?.leaveDuration || 0.6,
    } as UseCounterOptions

    const counterOutput = ref(0)

    // Utils
    function startCounter() {
        let startTimestamp: null | number = null

        const increaseCounter = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp

            const progress = Math.min((timestamp - startTimestamp) / options.counterDuration, 1)

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
