<script  lang="ts" setup>

</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Render Char">
            <VSplitText
                render="chars"
                content="Un exemple de pt mot a la suite pour test mon split si c'est ouf ou pas, coir carrement tres long, je sais pas c'est un test"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Render word">
            <VSplitText
                render="words"
                content="Un exemple de pt mot a la suite pour test mon split si c'est ouf ou pas, coir carrement tres long, je sais pas c'est un test"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Render lines">
            <VSplitText
                render="lines"
                content="Un exemple de pt mot a la suite pour test mon split si c'est ouf ou pas, coir carrement tres long, je sais pas c'est un test"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Render All">
            <VSplitText
                render="all"
                content="Un exemple de pt mot a la suite pour test mon split si c'est ouf ou pas, coir carrement tres long, je sais pas c'est un test"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Render All (with one line)">
            <VSplitText
                render="all"
                content="Une ligne courte"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

 <style lang="scss" module>
 .root {
     position: relative;
 }
 </style>
