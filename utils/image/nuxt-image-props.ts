import type { PropType } from 'vue'

// @nuxt/image v2 no longer exposes its runtime prop definitions (`#image/components/_base`) nor its utils (`#image/utils`).
// These are copied from @nuxt/image v1.11 so our custom VImg / VPicture / VPrismicImage keep the same API.
// @see https://github.com/nuxt/image/blob/v1.11.0/src/runtime/components/_base.ts

export const baseImageProps = {
    // input source
    src: { type: String, required: false },
    // modifiers
    format: { type: String, required: false },
    quality: { type: [Number, String], required: false },
    background: { type: String, required: false },
    fit: { type: String, required: false },
    modifiers: { type: Object as PropType<Record<string, unknown>>, required: false },
    // options
    preset: { type: String, required: false },
    provider: { type: String, required: false },
    sizes: { type: [Object, String] as PropType<string | Record<string, unknown>>, required: false },
    densities: { type: String, required: false },
    preload: {
        type: [Boolean, Object] as PropType<boolean | { fetchPriority: 'auto' | 'high' | 'low' }>,
        required: false,
    },
    // <img> attributes
    width: { type: [String, Number], required: false },
    height: { type: [String, Number], required: false },
    alt: { type: String, required: false },
    referrerpolicy: { type: String, required: false },
    usemap: { type: String, required: false },
    longdesc: { type: String, required: false },
    ismap: { type: Boolean, required: false },
    loading: {
        type: String as PropType<'lazy' | 'eager'>,
        required: false,
        validator: (val: string) => ['lazy', 'eager'].includes(val),
    },
    crossorigin: {
        type: [Boolean, String] as PropType<'anonymous' | 'use-credentials' | boolean>,
        required: false,
        validator: (val: string | boolean) => ['anonymous', 'use-credentials', '', true, false].includes(val),
    },
    decoding: {
        type: String as PropType<'async' | 'auto' | 'sync'>,
        required: false,
        validator: (val: string) => ['async', 'auto', 'sync'].includes(val),
    },
    // csp
    nonce: { type: [String], required: false },
}

export const pictureProps = {
    ...baseImageProps,
    legacyFormat: { type: String, default: null },
    imgAttrs: { type: Object as PropType<Record<string, unknown>>, default: null },
}

export const imgProps = {
    ...baseImageProps,
    placeholder: { type: [Boolean, String, Number, Array], required: false },
    placeholderClass: { type: String, required: false },
    custom: { type: Boolean, required: false },
}

export function getInt(x: unknown): number | undefined {
    if (typeof x === 'number') return x
    if (typeof x === 'string') return Number.parseInt(x, 10)

    return undefined
}

export function parseSize(input: string | number | undefined = ''): number | undefined {
    if (typeof input === 'number') return input
    if (typeof input === 'string' && input.replace('px', '').match(/^\d+$/g)) return Number.parseInt(input, 10)

    return undefined
}
