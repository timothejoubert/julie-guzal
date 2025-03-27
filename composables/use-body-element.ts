export function useBodyElement() {
    const bodyRef = useState<HTMLElement>('body_element')
    tryOnMounted(() => {
        if (bodyRef.value) return
        bodyRef.value = document.body
    })

    return bodyRef
}
