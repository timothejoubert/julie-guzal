// The splash screen is only played on the first visit of a browser session.
// The decision is taken by an inline <head> script (before first paint, so no
// flash on reloads): it adds `SPLASH_ACTIVE_CLASS` on <html> when the session
// hasn't seen the splash yet and motion isn't reduced. Without JS, or when
// storage is unavailable, the class is never set and the splash stays hidden.
export const SPLASH_STORAGE_KEY = 'splash-seen'
export const SPLASH_ACTIVE_CLASS = 'splash-active'

export const SPLASH_HEAD_SCRIPT = `(function(){try{if(sessionStorage.getItem('${SPLASH_STORAGE_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;sessionStorage.setItem('${SPLASH_STORAGE_KEY}','1');document.documentElement.classList.add('${SPLASH_ACTIVE_CLASS}')}catch(e){}})()`
