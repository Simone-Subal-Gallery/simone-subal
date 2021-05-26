<template>
  <div :class="['banner', block.type]">
    <template v-if="block.type == 'image'">
      <figure class="image">
        <lazy-img
          :background-color="block.asset.metadata.palette.vibrant.background"
          :lazy-src="$urlFor(block.asset).size(1400)"
          :width="block.asset.metadata.dimensions.width"
          :height="block.asset.metadata.dimensions.height"
          :lazy-srcset="$urlFor(block.asset).size(700) + ' 0.5x, ' + $urlFor(block.asset).size(2800) + ' 2x, ' + $urlFor(block.asset).size(4200) + ' 3x'"
          :alt="block.asset.altText"
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
  margin: 1em -4rem 1em -1.5rem;
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
  @media screen and (max-width:768px) {
    margin: 1em -1.5rem;
    &.image {
      height:auto;
      figure img {
        height: calc(60vh - 3rem);
      }
    }
  }
}
</style>
