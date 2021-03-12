<template>
  <div class="exhibition-gallery">
    <template v-for="image in works">
        <SanityImage
          :asset-id="image.asset._ref"
          auto="format"
          :alt="image.asset.altText"
          loading="lazy"
        />
    </template>
    <template v-for="image in install">
      <SanityImage
        :asset-id="image.asset._ref"
        auto="format"
        :alt="image.asset.altText"
        loading="lazy"
      />
    </template>
  </div>
</template>

<script>
export default {
  props: {
    works: {
      type: Object
    },
    install: {
      type: Object
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.banner {
  height:67vh;
  margin: 1rem -4rem 2rem -1.5rem;
  img {
    object-fit: cover;
    width:100vw;
  }
  figcaption {
    margin: 0.5em 1em;
  }
  &.text {
    height: 60vh;
    display: flex;
    font-size: 2em;
    align-items: center;
    justify-content: center;
  }
}
</style>
