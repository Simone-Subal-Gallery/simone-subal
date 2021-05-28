<template>
  <main class="page-single">
    <h1 class="title" v-html="page.title" />
    <div class="content" v-if="page.content != undefined && page.content.length > 0">
      <SanityContent :blocks="page.content" :serializers="serializers" />
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

import PDFBlock from '~/components/blocks/PDFBlock.vue'
import URLBlock from '~/components/blocks/URLBlock.vue'

const Link = {
  props: {
    href: {
      type: String
    }
  },
  render(createElement) {
    const props = {
      attrs: {
        href: this.href,
        target: '_blank'
      }
    }
    return createElement('a', props, this.$slots.default)
  }
}

const Image = {
  props: {
    asset: {
      type: Object
    }
  },
  render(createElement) {
    const props = {
      attrs: {
        src: this.asset.url
      }
    }
    return createElement('img', props, this.$slots.default)
  }
}

export default Vue.extend({
  // async asyncData({ params, app: { $sanity }}) {
  //   const query = groq`*[_type == "page" && slug.current == "${params.slug}"][0]`
  //   const page = await $sanity.fetch(query)
  //   return { page }
  // },
  head: {
    bodyAttrs: {
      class: 'page-single'
    }
  },
  async asyncData({ params, app: { $sanity }}) {
    const query = groq`{
      "page": *[_type == "page" && slug.current == "${params.slug}"][0] {
        ...,
        content[]{
        ...
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
      serializers: {
        types: {
          pdf: PDFBlock,
          link: URLBlock,
          image: Image
        },
        marks: {
          link: Link
        }
      }
    }
  },
  mounted() {
  },
  methods: {
  }
})
</script>

<style lang="scss">
body.page-single {
  .container {
    padding-top:4rem;
  }
}
main.page-single {
  background-color: #fff;
  border: 1px solid #000;
  padding: 2rem;
  overflow: hidden;
  max-width:720px;
  line-height:1.2;
  h1 {
    margin: 0.5rem 0.5em;
  }
  h1, .artists, .dates, .opening {
    text-align: center;
  }
  h2 {
    margin:0.5rem 0;
  }
  .content {
    width: 100%;
    section {
      margin: 2em 0;
    }
    p {
      margin:1rem 0;
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
