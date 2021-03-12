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
  height:67vh;
  margin: 1rem -4rem 1rem -1.5rem;
  img {
    object-fit: cover;
    width:100vw;
  }
  figcaption {
    margin: 0.5em 1em;
  }
}
</style>
