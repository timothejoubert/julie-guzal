<script lang="ts">
import { cloneVNode, createTextVNode } from 'vue'
import type { PropType, VNode } from 'vue'
import type { SplitText } from '~/utils/split-text'

export type VSplitTextRender = 'all' | 'lines' | 'words' | 'chars'

export default defineComponent({
    inheritAttrs: false,
    props: {
        content: { type: String, required: true },
        render: String as PropType<VSplitTextRender>,
    },
    emits: {
        customEvent: Function,
        onCustomEvent: Function,
    },
    setup(props, { attrs }) {
        const splitTextData = splitText(props.content)
        const $style = useCssModule()

        function renderLine(line: SplitText['all'][0]) {
            return line.content.map((word, wordIndex) => {
                return h('div', {
                    'class': [attrs.class, $style.word],
                    'data-word-index': word.index,
                },
                [
                    ...word.content.map((char) => {
                        return h('div', {
                            'class': $style.char,
                            'style': { '--v-split-text-index': char.index },
                            'data-content': char.content,
                        },
                        char.content)
                    }),
                    wordIndex !== line.content.length - 1 && h('div', {
                        'class': $style.char,
                        'style': { '--v-split-text-index': 0 },
                        'data-content': ' ',
                    }, createTextVNode(' ')),
                ])
            })
        }

        // const emits = defineEmits(['customEvent'])

        // TODO: render space char (&nbsp;)
        return () => {
            let renderNodes: VNode[] | VNode[][] | null = null

            if (props.render === 'chars') {
                renderNodes = splitTextData.characters.map((char, i) => {
                    return h('span', {
                        'class': attrs.class,
                        'data-content': char,
                        'style': { '--v-split-text-index': i },
                    }, createTextVNode(char))
                })
            }
            else if (props.render === 'words') {
                renderNodes = splitTextData.words.map((word, i) => {
                    return h('span', {
                        'class': [attrs.class, $style.word],
                        'data-content': word,
                        'style': { '--v-split-text-index': i },
                    }, word)
                })
            }
            else if (props.render === 'lines') {
                renderNodes = splitTextData.lines.map((line, i) => {
                    return h('div', {
                        'class': [attrs.class, $style.char],
                        'data-content': line,
                        'style': { '--v-split-text-index': i },
                    }, line)
                })
            }
            else if (splitTextData.all.length === 1) {
                renderNodes = renderLine(splitTextData.all[0])
            }
            else {
                renderNodes = splitTextData.all.map(line => renderLine(line))
            }

            // The split nodes are decorative (one node per char/word/line): hide them from assistive technologies
            // and expose the full text once, in a visually hidden node, so it is read as a whole (RGAA 8.9 / WCAG 1.3.1)
            const splitNodes = (renderNodes.flat() as VNode[]).map(node => cloneVNode(node, { 'aria-hidden': 'true' }))

            return [
                h('span', { class: 'visually-hidden' }, props.content),
                ...splitNodes,
            ]
        }
    },
})
</script>

<style lang="scss" module>
.word {
    display: flex;
}
</style>
