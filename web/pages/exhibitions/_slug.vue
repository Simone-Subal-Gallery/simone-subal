<template>
  <div class="exhibition-single">
    <main>
      <h1 class="title" v-html="exhibition.title + '<br>' + artistsString" />
        <p v-text="formatDates(exhibition.open_date, exhibition.close_date, 'future')" />
        <p v-if="exhibition.opening != undefined" v-text="exhibition.opening" />
      <div class="content" v-if="exhibition.content != undefined && exhibition.content.length > 0">
        <template v-for="block, i in exhibition.content">
          <Banner v-if="block._type == 'banner'" :key="block._key" :banner="block" />
          <CTABlock v-if="block._type == 'cta'" :key="block._key" :link="block.url" :text="block.text" :blank="block.blank" />
          <GalleryBlock v-if="block._type == 'galleryBlock'" :key="block._key" :index="i" :work="block.work" :install="block.install" />
          <TextBlock v-if="block._type == 'textBlock'" :key="block._key" :text="block.text" :boxed="block.boxed" />
          <WorkBlock v-if="block._type == 'workBlock'" :key="block._key" :index="i" :works="block.works" />
        </template>
      </div>
    </main>
    <section class="more-exhibitions">
      <div class="header">
        <h2>More</h2>
        <div class="view-controls">
          <a :class="view == 'grid'?'active':''" @click="setView('grid')">Grid</a>
          <a :class="view == 'list'?'active':''" @click="setView('list')">List</a>
        </div>
        <div class="exhibition-search">SEARCH</div>
      </div>
      <div :class="['exhibition-list', view=='grid'?'grid':'list']">
        <div v-for="exhibition in exhibitions" :key="exhibition._id" class="exhibition-listing">
          <nuxt-link :to="'/exhibitions/'+exhibition.slug.current" class="exhibition-item">
              <div :class="['thumbnail', exhibition.thumbnail.asset==undefined?'empty':'']" v-show="view == 'grid'">
                <img
                  :src="$urlFor(exhibition.thumbnail.asset).size(1280, 1024)"
                  loading="lazy"
                  v-if="exhibition.thumbnail.asset != undefined"
                />
                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 1280 1024"
                     width="1280"
                     height="1024"
                     v-if="exhibition.thumbnail.asset == undefined">
                  <rect width="1280" height="1024" fill="#eee"></rect>
                </svg>
              </div>
              <div class="artists">
                <template v-if="exhibition.artists != undefined && exhibition.artists.length > 0">
                  <p v-for="artist in exhibition.artists" :key="artist._id" v-text="artist.title" />
                </template>
                <p v-if="view == 'grid' && exhibition.artists_additional != undefined && exhibition.artists_additional.length > 0" v-text="formatArtists(exhibition.artists_additional)" />
                <template v-if="view == 'list' && exhibition.artists_additional && exhibition.artists_additional.length > 0">
                  <p v-for="artist in exhibition.artists_additional" :key="artist._id" v-text="artist" />
                </template>
              </div>
              <div class="title"><span>{{ exhibition.title }}</span></div>
              <div class="dates" v-html="formatDates(exhibition.open_date, exhibition.close_date, 'past')" />
          </nuxt-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

import Banner from '~/components/blocks/Banner.vue'
import CTABlock from '~/components/blocks/CTABlock.vue'
import GalleryBlock from '~/components/blocks/GalleryBlock.vue'
import TextBlock from '~/components/blocks/TextBlock.vue'
import WorkBlock from '~/components/blocks/WorkBlock.vue'

export default Vue.extend({
  async asyncData({ params, app: { $sanity }}) {
    const query = groq`{
      "exhibition": *[_type == "exhibition" && slug.current == "${params.slug}"][0] {
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
              "artist": artist->
            }
          }
        },
        "artists": artists[] -> {title, slug, _id}
      },
      "exhibitions": *[_type == "exhibition" && slug.current != "${params.slug}"] | order(open_date desc) {
      	...,
        "thumbnail": {
       		"caption": thumbnail.caption,
       		"asset": thumbnail.asset->
      	},
        "artists": artists[] -> {title, slug, _id},
        "artists_additional": artists_additional[],
    	}
    }`
    const response = await $sanity.fetch(query)
    return { exhibition: response.exhibition, exhibitions: response.exhibitions }
  },
  components: {
    Banner,
    CTABlock,
    GalleryBlock,
    TextBlock,
    WorkBlock
  },
  data () {
    return {
      view: 'grid',
      artistsString: ''
    }
  },
  mounted() {
    if (this.exhibition.bg_color != undefined) {
      document.body.style.backgroundColor = this.exhibition.bg_color
    } else {
      document.body.style.backgroundColor = "#fff"
    }

    let artists = this.exhibition.artists
    let artists_addtl = this.exhibition.artists_additional
    if (artists_addtl != undefined) { this.artistsString = artists_addtl.join(", ") } else {
        this.artistsString = artists.map(artist => artist.title).join(", ")
    }

  },
  beforeDestroy() {
    document.body.style.backgroundColor = "#eee"
  },
  computed: {
  },
  methods: {
    formatDates (open, close, section) {
      open = DateTime.fromISO(open)
      close = DateTime.fromISO(close)

      if (this.view == 'grid' && section == 'past' || section == 'future') {
        const from = open.toLocaleString({ month: 'long', day: 'numeric' })
        let to = ''
        if (open.month == close.month) {
          to = close.toLocaleString({ day: 'numeric' })
        } else {
          to = close.toLocaleString({ month: 'long', day: 'numeric' })
        }
        const year = close.year
        return `${from} - ${to}, ${year}`
      } else {
        const from = open.toFormat("MM'.'dd'.'yy")
        const to = close.toFormat("MM'.'dd'.'yy")

        return `${from}<br>${to}`
      }
    },
    setView(view) {
      this.view = view
    },
    formatArtists (artists) {
      let length = artists.length
      let text = ''

      if (length == 1) {
        text = artists[0]
      } else {
        for (let i = 0; i < length; i++) {
          if ( i == (length - 1) ) {
            text += artists[i]
          } else {
            text += artists[i] + ", "
          }
        }
      }
      return text
    }
  }
})
</script>

<style lang="scss">
.exhibition-single {
  .more-exhibitions {
    background: #eee;
    margin-left:-1.5rem;
    margin-right: -4rem;
    margin-bottom:-1.5rem;
    width:100vw;
    padding: 1.5rem;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5em;
      h2, .exhibition-search {
        width: 120px;
      }
      h2 {
        align-self: flex-end;
        margin:0;
      }
    }
    .exhibition-list {
      font-size: 1.25rem;
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
        grid-column-gap: 2em;
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
            font-size: 0.75em;
          }
        }
      }
    }
  }
  .view-controls {
    display: flex;
    width: 120px;
    margin:0.5em;
    a {
      flex: 1;
      padding:0.5em 0.5em 0.25em 0.5em;
      background-color: transparent;
      border:1px solid #000;
      margin:0;
      text-align: center;
      font-size: 0.85em;
      line-height:1;
      text-transform:uppercase;
      cursor: pointer;
      &.active {
        background-color: #fff;
      }
      &:first-child {
        border-radius: 2em 0em 0em 2em;
        border-right:0px;
      }
      &:last-child {
        border-radius: 0em 2em 2em 0em;
      }
    }
  }
}
</style>
