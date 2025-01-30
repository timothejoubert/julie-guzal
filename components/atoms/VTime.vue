<script  lang="ts" setup="">
import type { DateField } from '@prismicio/types'
import { parseDate } from '~/utils/prismic/prismic-date'

const props = withDefaults(defineProps<{
    date: string | undefined | DateField
    output?: 'year' | 'month' | 'day' | 'full'
}>(), {
    output: 'year',
})

const output = computed(() => {
    const date = parseDate(props.date)
    if (props.output === 'year') return date?.year
    else if (props.output === 'month') return date?.month
    else if (props.output === 'day') return date?.day

    return props.date
})
</script>

<template>
    <time
        v-if="date"
        :datetime="date"
    >{{ output }}</time>
</template>
