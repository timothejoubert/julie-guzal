<script  lang="ts" setup>
const typographies = [
    {
        name: 'H1',
        cssClass: 'text-h1',
        content: 'Heading de niveau 1',
    },
    {
        name: 'H2',
        cssClass: 'text-h2',
        content: 'Heading de niveau 2',
    },
    {
        name: 'H3',
        cssClass: 'text-h3',
        content: 'Heading de niveau 3',
    },
    {
        name: 'H4',
        cssClass: 'text-h4',
        content: 'Heading de niveau 4',
    },
    {
        name: 'H5',
        cssClass: 'text-h5',
        content: 'Heading de niveau 5',
    },
    {
        name: 'Body LG',
        cssClass: 'text-body-lg',
        content: 'My approach to design is heavily influenced by the Brutalist style, characterized by bold, utilitarian aesthetics that focus on functionality and purpose. At the same time, I prioritize creating work that\'s user-centered, empathetic, and resonates with the target audience.',
    },
    {
        name: 'Body MD',
        cssClass: 'text-body-md',
        content: 'My approach to design is heavily influenced by the Brutalist style, characterized by bold, utilitarian aesthetics that focus on functionality and purpose. At the same time, I prioritize creating work that\'s user-centered, empathetic, and resonates with the target audience.',
    },
    {
        name: 'Body SM',
        cssClass: 'text-body-sm',
        content: 'My approach to design is heavily influenced by the Brutalist style, characterized by bold, utilitarian aesthetics that focus on functionality and purpose. At the same time, I prioritize creating work that\'s user-centered, empathetic, and resonates with the target audience.',
    },
    {
        name: 'Body XS',
        cssClass: 'text-body-xs',
        content: 'My approach to design is heavily influenced by the Brutalist style, characterized by bold, utilitarian aesthetics that focus on functionality and purpose. At the same time, I prioritize creating work that\'s user-centered, empathetic, and resonates with the target audience.',
    },
]
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant
            v-for="typo in typographies"
            :key="typo.name"
            :title="typo.name"
        >
            <div :class="typo.cssClass">
                {{ typo.content }}
            </div>
            <hr :class="$style.hr">
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.hr {
    margin-block: 30px;
}
</style>
