<template>
  <main class="fair-single">
    <h1 class="title" v-html="fair.title" />
    <p class="artists" v-if="fair.artists != undefined && fair.artists.length > 0" v-html="formatArtists(fair.artists)" />
    <p class="dates" v-text="formatDates(fair.open_date, fair.close_date)" />
    <p class="opening" v-if="fair.opening != undefined" v-text="fair.opening" />
    <div class="content" v-if="fair.content != undefined && fair.content.length > 0">
      <component
        :is="block._type == 'banner' ? 'Banner' : block._type == 'cta' ? 'CTABlock' : block._type == 'galleryBlock' ? 'FairGalleryBlock' : block._type == 'textBlock' ? 'TextBlock' : block._type == 'workBlock' ? 'WorkBlock' : ''"
        v-for="(block, i) in fair.content"
        :key="block._key"
        :index="i"
        :block="block"
      />
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'
import mixinLinkClickRouting from '~/plugins/mixinLinkClickRouting'
import LazyImg from '~/components/LazyImg.vue'

import Banner from '~/components/blocks/Banner.vue'
import CTABlock from '~/components/blocks/CTABlock.vue'
import GalleryBlock from '~/components/blocks/GalleryBlock.vue'
import FairGalleryBlock from '~/components/blocks/FairGalleryBlock.vue'
import TextBlock from '~/components/blocks/TextBlock.vue'
import WorkBlock from '~/components/blocks/WorkBlock.vue'
import CodeBlock from '~/components/blocks/CodeBlock.vue'

export default Vue.extend({
  mixins: [mixinLinkClickRouting],
  async asyncData({ params, app: { $sanity }}) {
    const query = groq`{
      "fair": *[_type == "fair" && slug.current == "${params.slug}"][0] {
        ...,
        content[]{
          _type == 'banner' => {
            ...,
            'asset': image.asset->
          },
          _type == 'cta' => {
            ...
          },
          _type == 'galleryBlock' => {
            ...,
            install[]{
              ...,
              'asset': asset->
            },
            work[]{
              ...,
              'asset': asset->
            }
          },
          _type == 'textBlock' => {
            ...
          },
          _type == 'workBlock' => {
            ...,
            works[]{
              ...,
              images[]{
                ...,
                'asset': asset->
              },
              artist[]->
            }
          }
        },
        artists[]{
          _type == 'artist_additional' => {
            ...
          },
          ...@->
        }
      },
    }`
    const response = await $sanity.fetch(query)
    return { fair: response.fair }
  },
  components: {
    Banner,
    CTABlock,
    FairGalleryBlock,
    TextBlock,
    WorkBlock,
    LazyImg
  },
  data () {
    return {
      view: 'grid',
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: 'fair-single'
      },
      title: this.fair.title + ' | Simone Subal Gallery',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.fair.artists.map(artist => artist.title).join(", ") + '. ' + this.formatDates(this.fair.open_date, this.fair.close_date)
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.fair.title + ' | Simone Subal Gallery',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${this.$urlFor(this.fair.thumbnail.asset).size(1200)}`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `https://simonesubal.com/fairs/${this.fair.slug.current}`,
        },
      ]
    }
  },
  mounted() {
  },
  methods: {
    formatArtists (artists) {
      return artists.map(artist => {
        if (artist._type == 'artist') {
          return `<a href='/artists/${artist.slug.current}'>${artist.title}</a>`
        } else {
          return artist.title
        }
      }).join(", ")
    },
    formatDates (open, close) {
      open = DateTime.fromISO(open)
      close = DateTime.fromISO(close)
      const from = open.toLocaleString({ month: 'long', day: 'numeric' })
      let to = ''
      if (open.month == close.month) {
        to = close.toLocaleString({ day: 'numeric' })
      } else {
        to = close.toLocaleString({ month: 'long', day: 'numeric' })
      }
      const year = close.year
      return `${from} - ${to}, ${year}`
    }
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
  margin-top:4.5rem;
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
  @media screen and (max-width: 768px) {
    width: calc(100vw - 3rem);
    border-top-left-radius: 7em;
    border-top-right-radius: 7em;
    h1 {
      font-size:1.5em;
    }
  }
}
@media screen and (max-width: 768px) {
  body.fair-single {
    .container {
      overflow:visible;
    }
    #log {
      display:none;
    }
  }
}
</style>
