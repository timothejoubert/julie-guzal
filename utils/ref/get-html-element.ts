import type { Component, ComponentPublicInstance, MaybeRefOrGetter } from 'vue'

export type TemplateElement = HTMLElement | SVGElement | ComponentPublicInstance | Component | null
export type TemplateElementRef = MaybeRefOrGetter<TemplateElement>

export function isComponentInstanceElement(el: TemplateElement) {
    return el && '$data' in el && '$props' in el && '$props' in el
}

export function isDomElement(el: TemplateElement) {
    if (!el || isComponentInstanceElement(el)) return false
    return (el as HTMLElement).ownerDocument?.documentElement.tagName.toLowerCase() === 'html'
}

export function getHtmlElement<T extends HTMLElement>(element: TemplateElementRef) {
    const el = toValue(element)
    if (!el) return

    return ((el as ComponentPublicInstance)?.$el || el) as T | undefined
}
