<script  lang="ts" setup>
import type { ToastData } from '~/composables/use-toast'

function shakeToast(toast: ToastData) {
    const el = document.getElementById(toast.id)
    if (!el) return

    el.animate(
        [
            { rotate: '2deg' },
            { rotate: '-2deg' },
        ],
        {
            duration: 100,
            easing: 'ease-in-out',
            iterations: 3,
        },
    )
}

const { toasts, removeToast } = useToast()

watch(toasts, (list) => {
    const alreadyExistToast = list.find(toast => !!toast.repeat)
    if (alreadyExistToast) shakeToast(alreadyExistToast)
}, { deep: true })
</script>

<template>
    <TransitionGroup
        :name="$style['transition-slide-in']"
        tag="ul"
        :class="$style.root"
    >
        <template v-if="toasts.length">
            <li
                v-for="toast in toasts"
                :id="toast.id"
                :key="toast.id"
                :class="[$style.toast, toast.type && $style[`toast--type-${toast.type}`]]"
                class="text-body-sm"
            >
                {{ toast.message }}
                <button
                    :aria-label="$t('close')"
                    :class="$style.close"
                    @click="removeToast(toast)"
                >
                    <VIcon name="close" />
                </button>
            </li>
        </template>
    </TransitionGroup>
</template>

<style lang="scss" module>
@use 'assets/scss/variables/fonts' as *;

.root {
    position: fixed;
    z-index: 999;
    right: calc(var(--gutter) + 15px);
    bottom: var(--gutter);
    display: flex;
    flex-direction: column;
    margin: 0;
    gap: rem(8);
}

.toast {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: rem(16) rem(16) rem(16) rem(24);
    border-radius: rem(4);
    background-color: var(--theme-color-background);
    color: var(--theme-color-on-background);
    font-family: $font-suisse-family;
    font-size: rem(14);
    font-weight: 400;
    gap: rem(20);
    line-height: 1.4;
    transform-origin: center;

    // box-shadow: 0 0 20px var(--theme-color-primary);

    &:first-child {
        margin-block: 0;
    }
}

.close {
    border: initial;
    background-color: initial;
    color: inherit;
    cursor: pointer;

    svg {
        width: rem(12);
    }
}

.transition-slide-in {
    &:global(#{'-move'}),
    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        transition: translate 0.5s ease(out-quad), opacity 0.3s;
    }

    &:global(#{'-enter-from'}) {
        translate: 0 100%;
    }

    &:global(#{'-leave-to'}) {
        opacity: 0;
        translate: 0 rem(-10);
    }

    // &:global(#{'-leave-active'}) {
    //    position: absolute;
    // }
}

@keyframes shake {
    30% {
        rotate: 10%;
    }

    70% {
        rotate: -10%;
    }
}
</style>
