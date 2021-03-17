<template>
  <div :class="['banner', banner.type]">
    <template v-if="banner.type == 'image'">
      <figure class="image">
        <SanityImage
          :asset-id="banner.image.asset._ref"
          auto="format"
          :alt="banner.image.asset.altText"
          loading="lazy"
        />
        <figcaption>
          <SanityContent :blocks="banner.image.caption" />
        </figcaption>
      </figure>
    <!-- <img
      :src="$urlFor(banner.image.asset).size(2800, 1280)"
      loading="lazy"
    /> -->
    </template>
    <template v-if="banner.type == 'text'">
      <SanityContent :blocks="banner.text" />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    banner: {
      type: Object
    },
  },
  methods: {
  }
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
    margin: 0.5em 2em;
    font-size: 0.5em;
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
