import type { DateTimeFormat } from '@intlify/core-base'
import { I18N_DEFAULT_TIMEZONE, I18N_LOCALES } from '~/constants/i18n'

export default defineI18nConfig(() => ({
    datetimeFormats: I18N_LOCALES.reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: {
                // mon. 28/01
                date: {
                    weekday: 'short',
                    day: '2-digit',
                    month: '2-digit',
                    hour12: false,
                    timeZone: I18N_DEFAULT_TIMEZONE,
                },
            },
        }),
        {} as Record<typeof I18N_LOCALES[number], DateTimeFormat>,
    ),
}))
