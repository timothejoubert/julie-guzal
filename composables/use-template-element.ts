import type { Component } from 'vue'
import { customRef, getCurrentInstance, onUpdated } from 'vue'
import { getHtmlElement } from '~/utils/ref/get-html-element'

export function useTemplateRefElement<T extends HTMLElement | SVGElement | Component | null, Keys extends string = string>(
    key: Keys,
    initialValue: T | null = null,
) {
    const instance = getCurrentInstance()
    let _trigger = () => {}

    const element = customRef((track, trigger) => {
        _trigger = trigger
        return {
            get() {
                track()
                const refEl = instance?.proxy?.$refs[key] as T
                return getHtmlElement(refEl ?? initialValue)
            },
            set() {},
        }
    })

    tryOnMounted(_trigger)
    onUpdated(_trigger)

    return element as Readonly<(typeof element)>
}
