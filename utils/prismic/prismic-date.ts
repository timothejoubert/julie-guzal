import type { DateField } from '@prismicio/client'

export function parseDate(date: DateField | string | undefined | null) {
    if (!date) return

    const [year, month, day] = date?.split('-') || [null, null, null]

    return { year, month, day }
}
