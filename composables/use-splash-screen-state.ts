type SplashScreenState = 'pending' | 'enter' | 'leave' | 'done'

export function useSplashScreenState() {
    return useState<SplashScreenState>('splashScreenState', () => 'pending')
}
