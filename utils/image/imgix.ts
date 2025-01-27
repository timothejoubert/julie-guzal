import type { PropType } from 'vue'

export const imgixProviderAttributes = {
    crop: String,
    ar: String,
    width: String,
    rect: String,
    height: String,
    fit: String as PropType<'crop'>,
    imageWidth: String,
    imageHeight: String,
    auto: String,
}

export type ImgixProviderProps = typeof imgixProviderAttributes
export type ImgixProviderPropsKeys = keyof ImgixProviderProps
