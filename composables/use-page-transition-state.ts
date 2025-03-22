export const pageTransition = {
    DEFAULT: 'default',
    HOME_CARD_TO_PROJECT: 'home-card-to-project',
    SLIDE_LEFT: 'slide-left',
    SLIDE_RIGHT: 'slide-right',
    FIRST_REVEAL: 'first-reveal',
} as const

type PageTransition = (typeof pageTransition)[keyof (typeof pageTransition)]

export function usePageTransitionState() {
    const name = useState<PageTransition>('page-transition-name', () => 'first-reveal')
    const pageDirection = useState<'forwards' | 'backwards'>('page-direction', () => 'backwards')
    const animationComplete = useState<boolean>('page-transition-complete', () => false)

    return { name, animationComplete, pageDirection }
}
