<script  lang="ts" setup>
const embedVimeo = {
    embed_url: 'https://vimeo.com/379011318',
    type: 'video',
    version: '1.0',
    title: 'Showreel | Timothé Joubert | 2019',
    author_name: 'Timothe Joubert',
    author_url: 'https://vimeo.com/timothe',
    provider_name: 'Vimeo',
    provider_url: 'https://vimeo.com/',
    thumbnail_url: 'https://i.vimeocdn.com/video/838938393-44cfbc70189aa01f4ffbe67670b1843a7ae5bd7603030a9719ff1fbf236a13e0-d_295x166',
    thumbnail_width: 295,
    thumbnail_height: 166,
    html: '<iframe src="https://player.vimeo.com/video/379011318?app_id=122963" width="426" height="240" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" title="Showreel | Timothé Joubert | 2019"></iframe>',
    is_plus: '0',
    account_type: 'free',
    width: 426,
    height: 240,
    duration: 23,
    description: '',
    thumbnail_url_with_play_button: 'https://i.vimeocdn.com/filter/overlay?src0=https%3A%2F%2Fi.vimeocdn.com%2Fvideo%2F838938393-44cfbc70189aa01f4ffbe67670b1843a7ae5bd7603030a9719ff1fbf236a13e0-d_295x166&src1=http%3A%2F%2Ff.vimeocdn.com%2Fp%2Fimages%2Fcrawler_play.png',
    upload_date: '2019-12-12 07:19:30', video_id: 379011318, uri: '/videos/379011318',
}

const embedYoutube = {
    author_name: 'Timothe Joubert',
    author_url: 'https://www.youtube.com/@timothejoubert5225',
    embed_url: 'https://youtu.be/9-bz5Vipgho?si=lTanYaaonWVoMs9M',
    height: 113,
    html: '<iframe width="200" height="113" src="https://www.youtube.com/embed/9-bz5Vipgho?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="Animation-Les Abattoirs"></iframe>',
    provider_name: 'YouTube',
    provider_url: 'https://www.youtube.com/',
    thumbnail_height: 360,
    thumbnail_url: 'https://i.ytimg.com/vi/9-bz5Vipgho/hqdefault.jpg',
    thumbnail_width: 480,
    title: 'Animation-Les Abattoirs',
    type: 'video',
    version: '1.0',
    width: 200,
}

const prismicVideo = {
    id: 'Z6JiqZbqstJ9-OVw',
    key: 'b8d1a948-20af-4037-93c6-12090f8112a0',
    kind: 'file',
    link_type: 'Media',
    name: 'loop-2.mp4',
    size: '616086',
    text: 'Display text',
    url: 'https://julie-guzal.cdn.prismic.io/julie-guzal/Z6JiqZbqstJ9-OVw_loop-2.mp4',
}

const imageField = {
    dimensions: {
        width: 1200,
        height: 828,
    },
    alt: null,
    copyright: null,
    url: 'https://images.prismic.io/julie-guzal/Z5vz1pbqstJ9-EMM_french-fred-attraper-au-vol-5-1.jpg?auto=format,compress',
    id: 'Z5vz1pbqstJ9-EMM',
    edit: {
        x: 0,
        y: 0,
        zoom: 1,
        background: 'transparent',
    },
}
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Image field">
            <VPrismicMedia
                :document="imageField"
                :class="$style.media"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Media field">
            <VPrismicMedia
                :document="prismicVideo"
                :class="$style.media"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Embed Vimeo">
            <VPrismicMedia
                :document="embedVimeo"
                :class="$style.media"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Embed Youtube">
            <VPrismicMedia
                :document="embedYoutube"
                :class="$style.media"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Media field with thumbnail">
            <VPrismicMedia
                :document="prismicVideo"
                :video="{ thumbnail: imageField }"
                :class="$style.media"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Embed Vimeo with thumbnail">
            <VPrismicMedia
                :document="embedVimeo"
                :video="{ thumbnail: imageField }"
                :class="$style.media"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Embed Youtube with thumbnail">
            <VPrismicMedia
                :document="embedYoutube"
                :video="{ thumbnail: imageField }"
                :class="$style.media"
            />
        </NuxtStoryVariant>
    </nuxtstory>
</template>

 <style lang="scss" module>
 .media {
     width: 100%;
 }
 </style>
