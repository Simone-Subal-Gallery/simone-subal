<template>
  <div class="exhibition-gallery">
    <div class="install" v-if="install.length > 0">
      <!-- <h3>Installation</h3> -->
        <Lightbox class="grid" :id="'installlightbox'+index" :images="install" />
    </div>
    <div class="work" v-if="work.length > 0">
      <!-- <h3>Works</h3> -->
      <Lightbox class="grid" :type="'workGallery'" :id="'worklightbox'+index" :images="work" />
    </div>
  </div>
</template>

<script>
import Lightbox from '~/components/Lightbox.vue'

export default {
  props: {
    work: {
      type: Array
    },
    install: {
      type: Array
    },
    index: {
      type: Number
    }
  },
  components: {
    Lightbox
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
