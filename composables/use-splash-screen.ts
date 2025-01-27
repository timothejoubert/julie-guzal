type SplashScreenState = 'pending' | 'enter' | 'leave' | 'done'

export function useSplashScreen() {
    const state = useState<SplashScreenState>('splashScreenState', () => 'pending')

    return state
}
