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
          <div class="exhibition-item">
              <div :class="['exhibition-header', exhibition.artists.length==1?'solo':'']">
                <div class="title" v-text="exhibition.title" v-if="exhibition.hide_title != true"/>
                <div class="artists" v-if="exhibition.artists && exhibition.artists.length > 0" >
                  <p v-text="formatArtists(exhibition.artists)"/>
                </div>
              </div>
              <div class="dates" v-text="formatDates(exhibition.open_date, exhibition.close_date, 'future')" />
          </div>
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
              <div class="thumbnail" v-show="view == 'grid'">
                <img
                  :src="$urlFor(exhibition.thumbnail.asset).size(1280,1080)"
                  width="1280"
                  loading="lazy"
                />
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
              flex-direction: row-reverse;
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
            padding: 0.5em 0.5em 0.25em 0.5em;
          }
        }
      }
      .exhibition-list {
        font-size: 1.25rem;
        .exhibition-listing {
          margin-bottom: 2em;
          line-height: 1;
          div {
            margin: 0.5em 0;
          }
        }
        &.grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-column-gap: 2em;
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
            .title {
              order: -1;
              width:35%;
              span {
              }
            }
            .artists {
              width:45%;
              margin:0 1em;
              p {
              }
            }
            .dates {
              width: 20%;
              text-align:left;
            }
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
