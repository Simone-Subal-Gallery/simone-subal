<template>
  <div class="artist-single">
  <main>
    <h1 class="title" v-text="artist.title" />
    <ArtistGallery :images="artist.gallery" id="gallery" />
    <div class="content">
      <SanityContent :blocks="artist.description" :serializers="serializers" id="description" class="description"/>
      <section class="selected-exhibitions" v-if="artist.selected_exhibitions!=undefined && artist.selected_exhibitions.length > 0" id="selected_exhibitions">
        <h2>Selected Exhibitions</h2>
        <div class="exhibition-list grid">
        <div v-for="exhibition in artist.selected_exhibitions" :key="exhibition._key" class="exhibition-listing">
          <nuxt-link :to="'/exhibitions/'+exhibition.slug.current" class="exhibition-item" v-if="exhibition._type == 'exhibition'">
            <div :class="['thumbnail', exhibition.thumbnail==undefined?'empty':'']">
              <img
                :src="$urlFor(exhibition.thumbnail.asset).size(1280, 1024)"
                loading="lazy"
                v-if="exhibition.thumbnail != undefined"
              />
              <svg xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 1280 1024"
                   width="1280"
                   height="1024"
                   v-if="exhibition.thumbnail == undefined">
                <rect width="1280" height="1024" fill="#eee"></rect>
              </svg>
            </div>
            <div class="artists">
              <template v-if="exhibition.artists && exhibition.artists.length > 0">
                <p v-for="artist in exhibition.artists" :key="artist._id" v-text="artist.title" />
              </template>
            </div>
            <div class="title"><span>{{ exhibition.title }}</span></div>
            <div class="dates" v-html="formatDates(exhibition.open_date, exhibition.close_date)" />
          </nuxt-link>
          <nuxt-link :to="'/fairs/'+exhibition.slug.current" class="exhibition-item" v-if="exhibition._type == 'fair'">
            <div :class="['thumbnail', exhibition.thumbnail==undefined?'empty':'']">
              <img
                :src="$urlFor(exhibition.thumbnail.asset).size(1280, 1024)"
                loading="lazy"
                v-if="exhibition.thumbnail != undefined"
              />
              <svg xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 1280 1024"
                   width="1280"
                   height="1024"
                   v-if="exhibition.thumbnail == undefined">
                <rect width="1280" height="1024" fill="#eee"></rect>
              </svg>
            </div>
            <div class="title"><span>{{ exhibition.title }}</span></div>
            <div class="dates" v-html="formatDates(exhibition.open_date, exhibition.close_date)" />
          </nuxt-link>
          <a :href="exhibition.link!=undefined?exhibition.link:null" target="_blank" class="exhibition-item" v-if="exhibition._type == 'exhibition_offsite'">
            <div :class="['thumbnail', exhibition.thumbnail==undefined?'empty':'']">
              <img
                :src="$urlFor(exhibition.thumbnail.asset).size(1280, 1024)"
                loading="lazy"
                v-if="exhibition.thumbnail != undefined"
              />
              <svg xmlns="http://www.w3.org/2000/svg"
                   viewBox="0 0 1280 1024"
                   width="1280"
                   height="1024"
                   v-if="exhibition.thumbnail == undefined">
                <rect width="1280" height="1024" fill="#eee"></rect>
              </svg>
            </div>
            <div class="title"><span>{{ exhibition.title }}</span></div>
            <div class="place"><span>{{ exhibition.place}}</span></div>
            <div class="dates" v-html="formatDates(exhibition.open_date, exhibition.close_date)" />
          </a>
        </div>
      </div>
      </section>
      <div id="logRow" class="log-row">
        <!-- <section class="log-block" style="width:100%">
          <h2>Log</h2>
          <p v-for="item in log" :key="item._key">
            {{ item.title }}
          </p>
        </section> -->

        <!-- <section class="press" v-if="artist.press!=undefined && artist.press.length > 0">
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
        </section> -->
        <!-- <section class="bibliography" v-if="artist.bibliography && artist.bibliography.length > 0">
          <h2>Bibliography</h2>
          <SanityContent :blocks="artist.bibliography" :serializers="serializers" />
        </section>
        <section class="awards" v-if="artist.awards && artist.awards.length > 0">
          <h2>Awards</h2>
          <SanityContent :blocks="artist.awards" :serializers="serializers" />
        </section> -->
      </div>
    </div>
  </main>
  <section class="more-artists">
    <div v-for="artist in artists"
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
import { mapMutations } from 'vuex'

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
        selected_exhibitions[] {
          _type == "exhibition_offsite" => {
            ...
          },
          ...@->
        }
      },
      "artists": *[_type == "artist"][slug.current != "${params.slug}"] | order(title asc)
    }`
    const response = await $sanity.fetch(query)
    return { artist: response.artist, artists: response.artists }
  },
  head: {
    bodyAttrs: {
      class: 'artist-single'
    }
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
    console.log(this.$store.state.log)
    console.log(this.$store.state.logFilter)
    const logRow = document.querySelector('#logRow')
    const log = document.querySelector('#log')

    logRow.style.height = log.getBoundingClientRect().height + 32 + "px"
  },
  created() {
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
      text-align: justify;
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
          &.empty {
            svg {
              max-width: 100%;
              height: auto;
            }
          }
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
    .log-row {
      display: block;
      position: relative;
    }
    @media screen and (max-width: 768px) {
      width: calc(100vw - 3rem);
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
