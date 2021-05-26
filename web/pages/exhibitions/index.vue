<template>
  <main class="exhibitions">
    <section class="current" v-if="current!=undefined && current.length>0">
      <h2>Current</h2>
      <div v-for="exhibition in current" :key="exhibition._id" class="exhibition-listing">
        <p class="exhibition-dates" v-text="formatDates(exhibition.open_date, exhibition.close_date, 'future')" />
        <nuxt-link :to="'/exhibitions/'+exhibition.slug.current" class="exhibition-item">
          <div class="thumbnail" :style="'background-image:url('+$urlFor(exhibition.thumbnail.asset).size(2800)+')'">
            <h3 :class="['exhibition-header', exhibition.artists.length==1?'solo':'']">
              <div class="exhibition-title" v-text="exhibition.title" v-if="exhibition.hide_title != true"/>
              <div v-if="exhibition.artists" v-text="formatArtists(exhibition.artists)" class="artist-title" />
            </h3>
          </div>
        </nuxt-link>
      </div>
    </section>
    <!-- <section class="current" v-if="next!=undefined && next!=null">
      <h2>Next</h2>
      <div class="exhibition-listing">
        <p class="exhibition-dates" v-text="formatDates(next.open_date, next.close_date, 'future')" />
        <nuxt-link :to="'/exhibitions/'+next.slug.current" class="exhibition-item">
          <div class="thumbnail" :style="'background-image:url('+$urlFor(next.thumbnail.asset).size(2800)+')'">
            <h3 class="exhibition-header">
              <div class="exhibition-title" v-text="next.title" v-if="next.hide_title != true"/>
              <div v-if="next.artists" v-text="formatArtists(next.artists)" class="artist-title" />
            </h3>
          </div>
        </nuxt-link>
      </div>
    </section> -->
    <section class="future" v-if="future.length > 0">
      <h2>Future</h2>
      <div class="exhibition-list">
        <div v-for="exhibition in future" :key="exhibition._id" class="exhibition-listing">
          <nuxt-link :to="'/exhibitions/'+exhibition.slug.current" class="exhibition-item">
              <div :class="['exhibition-header', exhibition.artists.length==1?'solo':'']">
                <div class="title" v-text="exhibition.title" v-if="exhibition.hide_title != true"/>
                <div class="artists" v-if="exhibition.artists && exhibition.artists.length > 0" >
                  <p v-text="formatArtists(exhibition.artists)"/>
                </div>
              </div>
              <div class="dates" v-text="formatDates(exhibition.open_date, exhibition.close_date, 'future')" />
          </nuxt-link>
        </div>
      </div>
    </section>
    <section class="past" v-if="past.length > 0">
      <div class="header">
        <h2>Past</h2>
        <div class="view-controls">
          <a :class="view == 'grid'?'active':''" @click="setView('grid')">Grid</a>
          <a :class="view == 'list'?'active':''" @click="setView('list')">List</a>
        </div>
        <div class="exhibition-search">
          <input type="text" placeholder="Search" v-model="searchFeedValue" />
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

                <!-- <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 1280 1080"
                     width="1280"
                     height="auto"
                    >
                  <rect width="1280" height="1080" :fill="exhibition.thumbnail.asset.metadata.palette.vibrant.background"></rect>
                </svg> -->
              </div>

              <div :class="['exhibition-header', exhibition.artists.length==1?'solo':'']">
                <p class="title"><span v-if="exhibition.hide_title != true">{{ exhibition.title }}</span></p>
                <p class="artists" v-if="exhibition.artists && exhibition.artists.length > 0" v-text="formatArtists(exhibition.artists)"/>
              </div>
              <p class="dates" v-html="formatDates(exhibition.open_date, exhibition.close_date, 'past')" />
          </nuxt-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import "swiper/css/swiper.css"

import LazyImg from '~/components/LazyImg.vue'

export default Vue.extend({
  name: 'Exhibitions',
  async asyncData({ app: { $sanity }}) {
    const query = groq`*[_type == "exhibition"] | order(open_date desc)
    {
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
  	}`
    const today = DateTime.now()
    const exhibitions = await $sanity.fetch(query)

    let future = []
    future = exhibitions.filter((item) => {
      return DateTime.fromISO(item.open_date) > today
    })

    let past = []
    past = exhibitions.filter((item) => {
      return DateTime.fromISO(item.close_date) < today
    })

    let current=[]
    current = exhibitions.filter((item) => {
      return DateTime.fromISO(item.open_date) <= today &&
             DateTime.fromISO(item.close_date) >= today
    })
    // exhibitions.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))

    return {
      exhibitions,
      future,
      past,
      current
    }
  },
  components: {
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  methods: {
    setView(view) {
      this.view = view
    },
    formatArtists (artists) {
      return artists.map(artist => artist.title).join(", ")
    },
    formatDates (open, close) {
      open = DateTime.fromISO(open)
      close = DateTime.fromISO(close)
      const from = open.toLocaleString({ month: 'short', day: 'numeric' })
      let to = ''
      if (open.month == close.month) {
        to = close.toLocaleString({ day: 'numeric' })
      } else {
        to = close.toLocaleString({ month: 'short', day: 'numeric' })
      }
      const year = close.year
      return `${from} - ${to}, ${year}`
    }
  },
  computed: {
    filteredFeed() {
      let feed = this.past.filter(obj => {
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
  head: {
    bodyAttrs: {
      class: 'exhibitions-index'
    }
  },
  data () {
    return {
      title: 'Exhibitions',
      view: 'grid',
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 1,
          disableOnInteraction: false
        },
        slidesPerView: 'auto',
        speed: 1000,
      },
      searchFeedValue: ''
    }
  },
  mounted() {
  }
})
</script>

<style lang="scss">
main.exhibitions {
  h2 {
    font-size: 1em;
  }
  .exhibition-header {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-left: -0.5em;
    margin-bottom:0.5em;
    font-size: 1em;
  }
  .thumbnail {
    border: 1px solid #000;
    line-height:0;
  }
  section {
    margin:3em 0;
    &:first-child {
      margin-top:0px;
    }
    &.current {
      margin-top:1em;
      .exhibition-dates {
        margin-bottom: 0.5em;
      }
      .thumbnail {
        height:67vh;
        background-position:center;
        background-size:cover;
        padding:1em;
        .exhibition-header {
          margin:0;
          &.solo {
            flex-direction: row-reverse;
            justify-content: flex-end;
            flex-wrap: wrap-reverse;
          }
        }
      }
      .exhibition-title {
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;
        flex-direction:column;
        text-align: left;
        font-size:1.5em;
        p {
          font-size: 0.5em;
          margin-top: 0.25em;
        }
      }
      .artist-title {
        font-size:1.5em;
      }
      .artists.many {
          margin: 2em 0;
        .artist-title {
          margin: -0.5em 0.125em;
        }
      }
    }
    &.future {
      h2 {
        margin-bottom: 0.5em;
      }
      .exhibition-list {
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #000;
        .exhibition-item {
          padding: 1.5em;
          display: block;
          text-align: center;
          line-height: 1.5;
          .exhibition-header {
            margin:0px;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            justify-content: center;
            &.solo {
              justify-content: flex-end;
              flex-wrap: wrap-reverse;
            }
          }
        }
      }
    }
    &.past {
      min-height: calc(100vh - 12em);
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5em;
        position: sticky;
        top: 4.5rem;
        padding: 0.5rem 0;
        h2 {
          align-self: flex-end;
          margin:0;
          width:240px;
        }
        .exhibition-search {
          width: 240px;
          input {
            border:1px solid #000;
            border-radius: 1em;
            width: 100%;
            padding: 0.5em 0.5em 0.5em 0.75em;
          }
        }
      }
      .exhibition-list {
        font-size: 1.25rem;
        .exhibition-listing {
          margin-bottom: 0.5em;
          line-height: 1;
          div {
            margin: 0.5em 0;
            flex:1;
          }
        }
        &.grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-column-gap: 2em;
          grid-row-gap: 1em;
          .thumbnail {
            margin-bottom: 0.5em;
          }
          .exhibition-listing {
            div {
              margin:0px;
            }
            p {
              margin-top:0.25em;
            }
            .exhibition-header {
              flex-direction: column;
              flex-wrap: wrap;
              &.solo {
                flex-direction: column-reverse;
                justify-content: flex-end;
                flex-wrap: wrap-reverse;
              }
            }
          }
        }
        &.list {
          font-size: 1.25rem;
          padding-top:2em;
          .exhibition-item {
            display: flex;
            align-items: flex-start;
            .title {
              order: -1;
              width:50%;
              span {
              }
            }
            .artists {
              width:40%;
              margin:0 1em;
              p {
              }
            }
            .dates {
              margin: 0.5em 0;
              width: 200px;
              text-align:left;
            }
          }
        }
      }
    }
    @media screen and (max-width: 768px) {
      margin:1.5em 0;
      &.current .artist-title, &.current .exhibition-title {
        font-size:1em;
      }
      &.current .thumbnail {
        padding:0.5em;
      }
      &.past {
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
              padding: 0.5em 0.5em 0.4em 0.5em;
            }
          }
          .exhibition-search {
            flex:1;
            margin-left:0.5em;
            input {
              padding:0.25em 0.25em 0.25em 0.5em;
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
          padding-top:0.5rem;
          .exhibition-listing {
            margin-bottom:0.5rem;
            .exhibition-item {
              display:grid;
              grid-template-columns:1fr 120px;
              width:100%;
              grid-column-gap:0.5rem;
              .exhibition-header {
                margin:0;
                line-height: 1.33;
                .title {
                  width:100%;
                }
                .artists {
                  margin:0;
                  width:unset;
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
  }
  .view-controls {
    display: flex;
    width: 8em;
    margin:0.5em;
    a {
      flex: 1;
      padding:0.5em 0.5em 0.4em 0.5em;
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
@media screen and (max-width:768px) {
  body.exhibitions-index {
    .container {
      overflow:visible;
    }
    #log {
      display:none;
    }
  }
  main.exhibitions {
    width: calc(100vw - 3rem);
  }
}
</style>
