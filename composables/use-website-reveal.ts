export function useWebsiteReveal() {
    const pageReveal = useState<boolean>('pageReveal', () => false)
    const firstReveal = useState<boolean>('firstReveal', () => false)

    // const appConfig = useAppConfig()
    // if (!appConfig?.featureFlags?.splashScreen) firstReveal.value = true

    return { pageReveal, firstReveal }
}
