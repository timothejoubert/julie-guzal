import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    {
        ignores: ['dist', '.output', './prismicio-types.d.ts'],
    },
).override('nuxt/vue/rules', {
    rules: {
        'vue/require-default-prop': 'off',
        'vue/multi-word-component-names': 'off',
    },
}).append({
    files: ['**/layouts/default.vue'],
    rules: {
        'vue/no-multiple-template-root': 'off',
    },
})
