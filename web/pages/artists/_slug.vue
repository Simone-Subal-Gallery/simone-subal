<template>
  <div class="artist-single">
  <main>
    <h1 class="title" v-text="artist.title" />
    <Gallery :images="artist.gallery" />
    <div class="content">
      <SanityContent :blocks="artist.description" :serializers="serializers" class="description"/>
      <section class="selected-exhibitions" v-if="artist.exhibitions.length > 0">
        <h2>Selected Exhibitions</h2>
        <div class="exhibition-list grid">
        <div v-for="exhibition in artist.exhibitions" :key="exhibition._key" class="exhibition-listing">
          <nuxt-link :to="'/exhibitions/'+exhibition.slug.current" class="exhibition-item">
              <div class="thumbnail">
                <img
                  :src="$urlFor(exhibition.thumbnail.asset).size(1280, 1024)"
                  loading="lazy"
                />
              </div>
              <div class="artists">
                <template v-if="exhibition.artists && exhibition.artists.length > 0">
                  <p v-for="artist in exhibition.artists" :key="artist._id" v-text="artist.title" />
                </template>
                <!-- <p v-if="exhibition.artists_additional && exhibition.artists_additional.length > 0" v-text="formatArtists(exhibition.artists_additional)" /> -->
              </div>
              <div class="title"><span>{{ exhibition.title }}</span></div>
              <div class="dates" v-html="formatDates(exhibition.open_date, exhibition.close_date)" />
          </nuxt-link>
        </div>
      </div>
      </section>
      <div class="more row">
        <section class="press" v-if="artist.press && artist.press.length > 0">
          <h2>Press</h2>
          <div v-for="item in artist.press" :key="item._key" class="press-item">
          <template v-if="Boolean(item.pdf)">
            <a :href="item.pdf.asset.url" target="_blank">
            {{ item.title }}
            </a>
          </template>
          <template v-else-if="Boolean(item.url)">
            <a :href="item.url" target="_blank">
            {{ item.title }}
            </a>
          </template>
          <template v-else>
            {{ item.title }}
          </template>
          </div>
        </section>
        <section class="bibliography" v-if="artist.bibliography && artist.bibliography.length > 0">
          <h2>Bibliography</h2>
          <SanityContent :blocks="artist.bibliography" :serializers="serializers" />
        </section>
        <section class="awards" v-if="artist.awards && artist.awards.length > 0">
          <h2>Awards</h2>
          <SanityContent :blocks="artist.awards" :serializers="serializers" />
        </section>
      </div>
    </div>
  </main>
  <section class="more-artists">
    <div v-for="(artist, i) in artists"
        :key="artist._id"
        class="artist-listing">
      <nuxt-link :to="'/artists/'+artist.slug.current"
      v-text="artist.title"
      class="artist-item artist-title" />
    </div>
  </section>
  </div>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

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

export default Vue.extend({
  async asyncData({ params, app: { $sanity }}) {
    const query = groq`{
      "artist": *[_type == "artist" && slug.current == "${params.slug}"][0] {
        ...,
        gallery[] {
        	...,
        	asset->
      	},
        press[] {
          ...,
          pdf {
            asset->
          }
        },
        "exhibitions": *[ _type == "exhibition" && ^._id in artists[]._ref  ] | order(open_date desc)
      },
      "artists": *[_type == "artist"][slug.current != "${params.slug}"] | order(title asc)
    }`
    const response = await $sanity.fetch(query)
    return { artist: response.artist, artists: response.artists }
  },
  data () {
    return {
      serializers: {
        types: {
          pdf: PDFBlock,
          link: URLBlock
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
.artist-single {
  main {
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 2em;
    padding: 2rem;
    h1 {
      margin-top:0;
    }
    .content {
      width: 75%;
      section {
        margin: 2em 0;
      }
      .description {
        margin-top: 2em;
      }
    }
    .description p {
      margin: 1em 0;
    }
    .exhibition-list {
      font-size: 1em;
      .exhibition-listing {
        margin-bottom: 2em;
        line-height: 1;
        div {
          margin: 0.25em 0;
        }
      }
      &.grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 1em;
        .thumbnail {
          margin-bottom: 0.5em;
        }
      }
      &.list {
        font-size: 1.25rem;
        padding-top:2em;
        .exhibition-item {
          display: flex;
          justify-content: space-between;
          .title {
            order: -1;
            width:35%;
            span {
              display: inline-block;
              background-color: #fff;
              border:1px solid #000;
              padding: 1em;
            }
          }
          .artists {
            width:45%;
            p {
              display: inline-block;
              background-color: #fff;
              border:1px solid #000;
              padding: 1em;
              border-radius: 3em;
              margin:0.25em;
              text-align: center;
            }
          }
          .dates {
            padding-top:1em;
          }
        }
      }
    }
    .more.row {
      display: flex;
      flex-wrap: wrap;
      .press, .bibliography {
        width:50%;
      }
      .awards {
        width:50%;
      }
    }
  }
  .more-artists {
    display: flex;
    flex-wrap: wrap;
    padding: 1.5rem 0;
    font-size: 1rem;
  }
}
@media screen and (min-width: 1024px) {
  .more-artists {
    font-size: 1.25rem;
  }
}
@media screen and (min-width: 1440px) {
  .more-artists {
    font-size: 1.5rem;
  }
}
@media screen and (max-width: 768px) {
  .more-artists {
    font-size: 0.75rem;
  }
}
@media screen and (max-width: 640px) {
  .more-artists {
    font-size: 0.5rem;
  }
}
</style>
