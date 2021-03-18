<template>
  <section :class="['works', 'count-'+works.length]">
    <Lightbox class="work-item" v-for="work, i in works" :key="work._key" :id="'lightbox'+i" :images="work.images" :caption="getCaption(work)" />
  </section>
</template>

<script>
import Lightbox from '~/components/Lightbox.vue'

export default {
  props: {
    works: {
      type: Array
    }
  },
  mounted() {
  },
  components: {
    Lightbox
  },
  methods: {
    getCaption(work) {
      let string = ''
      if (work.artist!=undefined) {
        let artist = work.artist[0].title
        string = `${artist}.`
      }
      if (work.artist_additional!=undefined) {
        let artist_additional = work.artist_additional
        string = `${artist_additional}.`
      }
      let title = work.title || 'Untitled'
      string += ` <em>${title}</em>`
      if (work.year!=undefined) {
        let year = work.year.slice(0, 4)
        string += `, ${year}.`
      }
      if (work.medium!=undefined) {
        let medium = work.medium
        string += ` ${medium}.`
      }
      if (work.dimensions!=undefined) {
        let dimensions = work.dimensions
        string += ` ${dimensions}.`
      }
      if (work.description!=undefined) {
        let description = work.description
        string += ` ${description}`
      }
      return string
    }
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
    justify-content: flex-end;
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
      width:100%;
      object-position: center;
    }
    figcaption {
      margin:0.5em 0;
      font-size: 0.75em;
    }
  }
  &.count-2 {
    .work-item {
      width:calc(50% - 4em);
    }
  }
}
</style>
