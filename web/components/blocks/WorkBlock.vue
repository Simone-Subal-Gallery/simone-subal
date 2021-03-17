<template>
  <section class="works">
      <!-- <h3>Works</h3> -->
      <div class="work-item" v-for="work in works" :key="work._key">
        <figure class="image" :key="image._id" v-for="image, i in work.images">
          <SanityImage
            :asset-id="image.asset._ref"
            auto="format"
            :alt="image.asset.altText"
            loading="lazy"
          />
          <figcaption>
            <!-- <span>{{ i+1 }}</span>
            <SanityContent :blocks="image.caption" class="caption"/> -->
            <em>{{ work.title }}</em>
          </figcaption>
        </figure>
      </div>
  </section>
</template>

<script>
export default {
  props: {
    works: {
      type: Array
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
section.works {
  display: flex;
  flex-direction:row;
  flex-wrap: wrap;
  .work-item {
    flex: auto;
    margin: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction:column;
    figure {
      display:none;
      &:first-child {
        display: block;
      }
    }
    img {
      max-height: 70vh;
      object-fit: contain;
      object-position: center;
    }
  }
}
</style>
