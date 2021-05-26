<template>
  <section :class="['works', 'count-'+block.works.length]">
    <Lightbox class="work-item" v-for="(work, i) in block.works" :type="'workSingle'" :key="work._key" :id="'worklightbox'+index+i" :images="work.images" :caption="getCaption(work)" />
  </section>
</template>
<script>
import Lightbox from '~/components/Lightbox.vue'

export default {
  props: {
    block: {
      type: Object
    },
    // works: {
    //   type: Array
    // },
    index: {
      type: Number
    }
  },
  mounted() {
  },
  components: {
    Lightbox
  },
  methods: {
    getCaption(work) {
      console.log(work)
      let string = ''
      if (work.artist!=undefined && work.artist.length > 0) {
        string = `${work.artist[0].title}.`
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
      if (work.more_info!=undefined) {
        let more = work.more_info
        string += `<br class="more-info"><br class="more-info"><span class="more-info">${more}</span>`
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
  align-items:flex-start;
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
      object-fit: contain;
      width:100%;
      object-position: center;
    }
    figcaption {
      margin:0.5em 0;
      font-size: 0.75em;
      .more-info {
        display:none;
      }
    }
  }
  &.count-2, &.count-3, &.count-4 {
    .work-item {
      width:calc(50% - 4em);
    }
  }
  &.count-5, &.count-6, &.count-7, &.count-8, &.count-9, &.count-10, &.count-11, &.count-12 {
    .work-item {
      width:calc(33% - 4em);
    }
  }
  @media screen and (max-width: 768px) {
    &.count-2, &.count-3, &.count-4, &.count-5, &.count-6, &.count-7, &.count-8, &.count-9, &.count-10, &.count-11, &.count-12 {
      .work-item {
        width:100%;
      }
    }
  }
}
</style>
