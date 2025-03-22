export function useWebsiteReveal() {
    const appConfig = useAppConfig()
    const hasSplashScreen = appConfig.featureFlags.splashScreen

    const pageReveal = useState<boolean>('pageReveal', () => false)
    const firstReveal = useState<boolean>('firstReveal', () => !hasSplashScreen)

    return { pageReveal, firstReveal }
}
