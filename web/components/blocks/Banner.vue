<template>
  <div :class="['banner', block.type]">
    <template v-if="block.type == 'image'">
      <figure class="image">
        <SanityImage
          :asset-id="block.image.asset._ref"
          auto="format"
          :alt="block.image.asset.altText"
          loading="lazy"
        />
        <figcaption>
          <SanityContent :blocks="block.image.caption" />
        </figcaption>
      </figure>
    <!-- <img
      :src="$urlFor(banner.image.asset).size(2800, 1280)"
      loading="lazy"
    /> -->
    </template>
    <template v-if="block.type == 'text'">
      <SanityContent :blocks="block.text" />
    </template>
    <template v-if="block.type == 'video'">
      <Video :asset="block.video.asset._ref" :caption="block.video_caption" />
    </template>
  </div>
</template>

<script>
import Video from '~/components/blocks/Video.vue'

export default {
  props: {
    block: {
      type: Object
    },
  },
  components: {
    Video
  },
}
</script>

<style lang="scss">
.banner {
  margin: 1em -4rem 3em -1.5rem;
  &.image {
    height: calc(100vh - 3rem);
    figure {
      height:100%;
      img {
        object-fit: cover;
        max-width:100%;
        height: 100%;
        width:100%;
      }
    }
  }
  figcaption {
    margin: 0.5rem 1.5rem;
    font-size: 0.75em;
  }
  &.text {
    padding: 20vh 2em;
    display: flex;
    font-size: 2em;
    align-items: center;
    justify-content: center;
  }
}
</style>
