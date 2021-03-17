<template>
  <div class="exhibition-gallery">
    <div class="install" v-if="install.length > 0">
      <!-- <h3>Installation</h3> -->
      <div class="grid">
        <figure class="image" :key="image._id" v-for="image in install">
          <SanityImage
            :asset-id="image.asset._ref"
            auto="format"
            :alt="image.asset.altText"
            loading="lazy"
          />
          <figcaption>
            <SanityContent :blocks="image.caption" />
          </figcaption>
        </figure>
      </div>
    </div>
    <div class="work" v-if="work.length > 0">
      <!-- <h3>Works</h3> -->
      <div class="grid">
        <figure class="image" :key="image._id" v-for="image, i in work">
          <SanityImage
            :asset-id="image.asset._ref"
            auto="format"
            :alt="image.asset.altText"
            loading="lazy"
          />
          <figcaption>
            <span>{{ i+1 }}</span>
            <SanityContent :blocks="image.caption" class="caption"/>
          </figcaption>
        </figure>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    work: {
      type: Array
    },
    install: {
      type: Array
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.exhibition-gallery {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2em;
  .install .grid {
    position: sticky;
    top: 6.5rem;
    grid-template-columns: repeat(1, 1fr);
    figcaption {
      font-size: 0.5em;
      max-width:720px;
    }
  }
  .work .grid {
    position: sticky;
    top: 6.5rem;
    grid-template-columns: repeat(1, 1fr);
    figure {
      display: grid;
      grid-template-columns: 4fr 2fr;
      grid-gap: 0.5em;
      figcaption {
        font-size:0.5em;
        align-self:end;
      }
    }
  }
  .grid {
    margin-top:1em;
    display: grid;
    gap: 1em;
    align-items: center;
    justify-content: center;
  }
}
</style>
