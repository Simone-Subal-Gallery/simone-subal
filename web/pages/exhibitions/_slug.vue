<template>
  <div class="exhibition-single">
    <main>
      <h1 class="title" v-html="exhibition.hide_title==true?artistsString:exhibition.title + '<br>' + artistsString" />
        <p v-text="formatDates(exhibition.open_date, exhibition.close_date, 'future')" />
        <p v-if="exhibition.opening != undefined" v-text="exhibition.opening" />
      <div class="content" v-if="exhibition.content != undefined && exhibition.content.length > 0">
        <component
          :is="block._type == 'banner' ? 'Banner' : block._type == 'codeBlock' ? 'CodeBlock' : block._type == 'cta' ? 'CTABlock' : block._type == 'galleryBlock' ? 'GalleryBlock' : block._type == 'textBlock' ? 'TextBlock' : block._type == 'workBlock' ? 'WorkBlock' : ''"
          v-for="block, i in exhibition.content"
          :key="block._key"
          :index="i"
          :block="block"
        />
          <!-- <Banner v-if="block._type == 'banner'" :banner="block" />
          <CTABlock v-if="block._type == 'cta'" :link="block.url" :text="block.text" :blank="block.blank" />
          <GalleryBlock v-if="block._type == 'galleryBlock'" :index="i" :work="block.work" :install="block.install" />
          <TextBlock v-if="block._type == 'textBlock'" :text="block.text" :boxed="block.boxed" />
          <WorkBlock v-if="block._type == 'workBlock'" :index="i" :works="block.works" />
          <CodeBlock v-if="block._type == 'codeBlock'" :content="block.code" /> -->
      </div>
    </main>

    <section class="more-exhibitions">
      <div class="header">
        <h2>More</h2>
        <div class="view-controls">
          <a :class="view == 'grid'?'active':''" @click="setView('grid')">Grid</a>
          <a :class="view == 'list'?'active':''" @click="setView('list')">List</a>
        </div>
        <div class="exhibition-search">
          <label id="search-exhibition">
            <input type="text" placeholder="Search" v-model="searchFeedValue" />
          </label>
        </div>
      </div>
      <div :class="['exhibition-list', view=='grid'?'grid':'list']">
        <div v-for="exhibition in filteredFeed" :key="exhibition._id" class="exhibition-listing">
          <nuxt-link :to="'/exhibitions/'+exhibition.slug.current" class="exhibition-item">

            <div :class="['thumbnail', exhibition.thumbnail==undefined?'empty':'']" v-show="view == 'grid'">
              <lazy-img
                :width="1280"
                :height="1080"
                :background-color="exhibition.thumbnail.asset.metadata.palette.vibrant.background"
                :lazy-src="$urlFor(exhibition.thumbnail.asset).size(640, 540)"
                :lazy-srcset="$urlFor(exhibition.thumbnail.asset).size(320, 270) + ' 0.5x, ' + $urlFor(exhibition.thumbnail.asset).size(1280, 1080) + ' 2x'"
                v-if="exhibition.thumbnail != undefined"
              />

            </div>
            <div class="artists">
              <p v-if="exhibition.artists && exhibition.artists.length > 0" v-text="formatArtists(exhibition.artists)"/>
            </div>
            <div class="title"><span v-if="exhibition.hide_title != true">{{ exhibition.title }}</span></div>
            <div class="dates" v-html="formatDates(exhibition.open_date, exhibition.close_date, 'future')" />
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
import { mapState } from 'vuex'
import mixinLinkClickRouting from '~/plugins/mixinLinkClickRouting'
import LazyImg from '~/components/LazyImg.vue'
import Log from '~/components/Log.vue'

import Banner from '~/components/blocks/Banner.vue'
import CTABlock from '~/components/blocks/CTABlock.vue'
import GalleryBlock from '~/components/blocks/GalleryBlock.vue'
import TextBlock from '~/components/blocks/TextBlock.vue'
import WorkBlock from '~/components/blocks/WorkBlock.vue'
import CodeBlock from '~/components/blocks/CodeBlock.vue'

export default Vue.extend({
  mixins: [mixinLinkClickRouting],
  head() {
    return {
      bodyAttrs: {
        class: 'exhibition-single'
      },
      title: this.exhibition.hide_title?this.exhibition.artists.map(artist => artist.title).join(", "):this.exhibition.title + ' | Simone Subal Gallery',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.exhibition.artists.map(artist => artist.title).join(", ") + '. ' + this.formatDates(this.exhibition.open_date, this.exhibition.close_date, 'future')
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.exhibition.hide_title?this.exhibition.artists.map(artist => artist.title).join(", "):this.exhibition.title + ' | Simone Subal Gallery',
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: `${this.$urlFor(this.exhibition.thumbnail.asset).size(1200)}`,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `https://simonesubal.com/exhibitions/${this.exhibition.slug.current}`,
        },
      ]
    }
  },
  async asyncData({ params, app: { $sanity }}) {
    const query = groq`{
      "exhibition": *[_type == "exhibition" && slug.current == "${params.slug}"][0] {
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
              asset->
            },
          },
          _type == 'textBlock' => {
            ...,
            text[]{
              ...,
              _type == 'image' => {
                asset->
              }
            }
          },
          _type == 'workBlock' => {
            ...,
            works[]{
              ...,
              artist[]->,
              images[]{
                ...,
                asset->
              }
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
      "exhibitions": *[_type == "exhibition" && slug.current != "${params.slug}"] | order(open_date desc) {
      	...,
        "thumbnail": {
       		"caption": thumbnail.caption,
       		"asset": thumbnail.asset->
      	},
        artists[]{
          _type == 'artist_additional' => {
            ...
          },
          ...@->
        }
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
    WorkBlock,
    CodeBlock,
    LazyImg
  },
  data () {
    return {
      view: 'grid',
      searchFeedValue: ''
    }
  },
  mounted() {
    if (this.exhibition.bg_color != undefined) {
      this.$store.commit('backgroundColor', this.exhibition.bg_color)
    } else {
      this.$store.commit('backgroundColor', this.site.bg_color)
    }
  },
  beforeMount () {
    // window.addEventListener('scroll', this.handleScroll, { passive: true })
  },
  beforeDestroy() {
    // window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    ...mapState(['site']),
    artistsString () {
      let artists = this.exhibition.artists
      let array = []

      artists.forEach(artist => {
        if (artist._type == 'artist') {
          array.push(`<a href='/artists/${artist.slug.current}'>${artist.title}</a>`)
        } else {
          array.push(artist.title)
        }
      })
      return array.join(", ")
    },
    filteredFeed() {
      let feed = this.exhibitions.filter(obj => {
        return (
          obj.title
            .toLowerCase()
            .indexOf(this.searchFeedValue.toLowerCase()) != -1
          ||
          obj.slug.current
            .toLowerCase().replace(/-/g,' ')
            .indexOf(this.searchFeedValue.toLowerCase()) != -1
          ||
          obj.open_date
            .toLowerCase().replace(/-/g,' ')
            .indexOf(this.searchFeedValue.toLowerCase()) != -1
          ||
          obj.artists.map(e => e.title).join(" ")
            .toLowerCase()
            .indexOf(this.searchFeedValue.toLowerCase()) != -1
        )
      })
      return feed
    }
  },
  methods: {
    formatDates (open, close, section) {
      open = DateTime.fromISO(open)
      close = DateTime.fromISO(close)

      if (this.view == 'grid' && section == 'past' || section == 'future') {
        const from = open.toLocaleString({ month: 'short', day: 'numeric' })
        let to = ''
        if (open.month == close.month) {
          to = close.toLocaleString({ day: 'numeric' })
        } else {
          to = close.toLocaleString({ month: 'short', day: 'numeric' })
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
      return artists.map(artist => artist.title).join(", ")
    }
  }
})
</script>

<style lang="scss">
.exhibition-single {
  main {
    min-height: 67vh;
    flex: 1;
  }
  @media screen and (max-width:768px) {
    width: calc(100vw - 3rem);
    h1.title {
      font-size:1.5em;
    }
  }
  .more-exhibitions {
    background-color: var(--background-color-secondary);
    margin-left:-1.5rem;
    margin-right: -4rem;
    margin-bottom:-5rem;
    width:100vw;
    min-height: calc(100vh - 12em);
    padding: 1.5rem;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5em;
      width:100%;
      padding-top:1.5em;
      h2, .exhibition-search {
        width: 120px;
      }
      h2 {
        align-self: flex-end;
        margin:0;
        width:30vw;
        font-size:1em;
      }
      .exhibition-search {
        width: 30vw;
        input {
          border:1px solid #000;
          border-radius: 1em;
          width: 100%;
          padding: 0.5em;
        }
      }
    }
    .exhibition-list {
      // font-size: 1.25rem;
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
        width:100%;
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
        // font-size: 1.25rem;
        padding-top:2em;
        .exhibition-item {
          display: flex;
          justify-content: space-between;
          .title {
            order: -1;
            width:35%;
            span {
              display: inline-block;
            }
          }
          .artists {
            width:45%;
            margin:0 1em;
          }
          .dates {
            width: 20%;
            text-align:left;
          }
        }
      }
    }
    @media screen and (max-width: 768px) {
      padding-bottom: 6rem;
      .header {
        flex-wrap:wrap;
        h2 {
          width:100%;
          margin-bottom:0.5em;
        }
        .view-controls {
          margin:0px;
          width:96px;
          height:1.5rem;
          align-items:center;
          a {
            font-size: 0.65em;
            padding: 0.5em;
          }
        }
        .exhibition-search {
          flex:1;
          margin-left:0.5em;
          input {
            padding:0.25em;
            font-size:0.75em;
            height:1.5rem;
          }
        }
      }
      .exhibition-list.grid {
        grid-column-gap:0.5rem;
        .exhibition-listing {
          font-size:0.75rem;
          margin-bottom: 0.5rem;
          .thumbnail {
            margin-bottom:0.25rem;
          }
        }
      }
      .exhibition-list.list {
        font-size:0.75rem;
        padding-top:0rem;
        .exhibition-listing {
          margin-bottom:0.5rem;
          .exhibition-item {
            display:grid;
            grid-template-columns: 1fr 1fr 120px;;
            width:100%;
            grid-column-gap:0.5rem;
            .title {
              width: unset;
            }
            .artists {
              margin:0;
              width:unset;
            }
            .exhibition-header {
              margin:0;
              .title {
                width:100%;
              }
            }
            .dates {
              width:unset;
            }
          }
        }
      }
    }
  }
  .view-controls {
    display: flex;
    width: 8em;
    margin:0.5em;
    a {
      flex: 1;
      padding:0.5em;
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

body.exhibition-single .container {
  overflow:visible;
}
.container.log-open {
  .more-exhibitions {
    display:none;
  }
}

@media screen and (max-width:768px) {
  body.exhibition-single {
    .container {
      overflow:visible;
    }
  }
}
</style>
