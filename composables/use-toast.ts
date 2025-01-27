export type ToastData = {
    id: string
    message: string
    type?: 'success' | 'error'
    duration?: number
    repeat?: number
}

export function useToast() {
    const toasts = useState<ToastData[]>('toast-list', () => [])

    function addToast(newToast: ToastData) {
        const index = toasts.value.findIndex(t => t.id === newToast.id)

        if (index !== -1) {
            toasts.value[index].repeat = (toasts.value[index].repeat || 0) + 1
            return
        }
        console.log('new toast')

        toasts.value.push({ ...newToast, repeat: 0 })
        if (newToast.duration) {
            window?.setTimeout(() => {
                removeToast(newToast)
            }, newToast.duration)
        }
    }

    function removeToast(toast: ToastData) {
        const index = toasts.value.findIndex(item => item.id === toast.id)
        if (index !== -1) toasts.value.splice(index, 1)
    }

    return { toasts, addToast, removeToast }
}
