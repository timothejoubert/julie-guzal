import type { I18nOptions } from 'vue-i18n'

export const I18N_LOCALES = ['en'] as const
export const I18N_DEFAULT_LOCALE = 'en'
export const I18N_DEFAULT_TIMEZONE = 'Europe/Paris'

// type I18nLocale = typeof I18N_LOCALES[number]

// defineI18nConfig() does not work
// therefore we need to type the config object
export default {} as I18nOptions
