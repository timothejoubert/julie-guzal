type SplashScreenState = 'active' | 'done'

export function useSplashScreenState() {
    return useState<SplashScreenState>('splashScreenState', () => 'active')
}
