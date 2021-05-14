<template>
  <main class="page-single">
    <h1 class="title" v-html="page.title" />
    <div class="content" v-if="page.content != undefined && page.content.length > 0">
      <SanityContent :blocks="page.content" />
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

import Banner from '~/components/blocks/Banner.vue'
import CTABlock from '~/components/blocks/CTABlock.vue'
import FairGalleryBlock from '~/components/blocks/FairGalleryBlock.vue'
import TextBlock from '~/components/blocks/TextBlock.vue'
import WorkBlock from '~/components/blocks/WorkBlock.vue'
import CodeBlock from '~/components/blocks/CodeBlock.vue'

export default Vue.extend({
  async asyncData({ params, app: { $sanity }}) {
    const query = groq`*[_type == "page" && slug.current == "${params.slug}"][0]`
    const page = await $sanity.fetch(query)
    return { page }
  },
  async asyncData({ params, app: { $sanity }}) {
    const query = groq`{
      "page": *[_type == "page" && slug.current == "${params.slug}"][0] {
        ...,
        content[]{
          _type == 'banner' => {
            ...
          },
          _type == 'cta' => {
            ...
          },
          _type == 'galleryBlock' => {
            ...
          },
          _type == 'textBlock' => {
            ...
          },
          _type == 'workBlock' => {
            ...,
            works[]{
              ...,
              artist[]->
            }
          }
        }
      },
    }`
    const response = await $sanity.fetch(query)
    return { page: response.page }
  },
  components: {
    Banner,
    CTABlock,
    FairGalleryBlock,
    TextBlock,
    WorkBlock,
  },
  data () {
    return {
      view: 'grid',
    }
  },
  mounted() {
  },
  methods: {
  }
})
</script>

<style lang="scss">
main.fair-single {
  background-color: #fff;
  border: 1px solid #000;
  border-top-left-radius: 10em;
  border-top-right-radius: 10em;
  padding: 2rem;
  overflow: hidden;
  h1 {
    margin: 0 0.5em;
  }
  h1, .artists, .dates, .opening {
    text-align: center;
  }
  .content {
    width: 100%;
    section {
      margin: 2em 0;
    }
    .description {
      margin-top: 2em;
    }
    .banner {
      margin: 1em -2rem 3em -2rem;
    }
  }
  .description p {
    margin: 1em 0;
    text-align: justify;
  }
  .more-artists {
    display: flex;
    flex-wrap: wrap;
    padding: 1.5rem 0;
    font-size: 1rem;
  }
}
</style>
