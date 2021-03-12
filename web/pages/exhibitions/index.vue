<template>
  <main class="exhibitions">
    <section class="current">
      <h2>Current</h2>
      <div v-for="exhibition in current" :key="exhibition._id" class="exhibition-listing">
        <p class="exhibition-dates" v-text="formatDates(exhibition.open_date, exhibition.close_date, 'future')" />
        <nuxt-link :to="'/exhibitions/'+exhibition.slug.current" class="exhibition-item">
          <h3 class="exhibition-header">
            <div :class="[exhibition.artists.length > 2 || exhibition.artists_additional.length > 2 ? 'many':'', 'artists']">
              <div v-if="exhibition.artists && exhibition.artists.length > 0" :key="artist._i" v-for="artist in exhibition.artists" v-text="artist.title" class="artist-title" />
              <div v-if="exhibition.artists_additional && exhibition.artists_additional.length > 0" v-for="artist in exhibition.artists_additional" v-text="artist" class="artist-title" />
            </div>
            <div class="exhibition-title" v-text="exhibition.title" />
          </h3>
          <div class="thumbnail">
            <img
              :src="$urlFor(exhibition.thumbnail.asset).size(2800)"
              width="2800"
              loading="lazy"
            />
          </div>
        </nuxt-link>
      </div>
    </section>
    <section class="future" v-if="future.length > 0">
      <h2>Future</h2>
      <div class="exhibition-list">
        <div v-for="exhibition in future" :key="exhibition._id" class="exhibition-listing">
          <nuxt-link :to="'/exhibitions/'+exhibition.slug.current" class="exhibition-item">
              <div class="title" v-text="exhibition.title" />
              <div class="artists">
                <template v-if="exhibition.artists && exhibition.artists.length > 0">
                  <p v-for="artist in exhibition.artists" :key="artist._id" v-text="artist.title" />
                </template>
                <p v-if="exhibition.artists_additional && exhibition.artists_additional.length > 0" v-text="formatArtists(exhibition.artists_additional)" />
              </div>
              <div class="dates" v-text="formatDates(exhibition.open_date, exhibition.close_date, 'future')" />
          </nuxt-link>
        </div>
      </div>
    </section>
    <section class="past">
      <div class="header">
        <h2>Past</h2>
        <div class="view-controls">
          <a :class="view == 'grid'?'active':''" @click="setView('grid')">Grid</a>
          <a :class="view == 'list'?'active':''" @click="setView('list')">List</a>
        </div>
        <div class="exhibition-search">SEARCH</div>
      </div>
      <div :class="['exhibition-list', view=='grid'?'grid':'list']">
        <div v-for="exhibition in past" :key="exhibition._id" class="exhibition-listing">
          <nuxt-link :to="'/exhibitions/'+exhibition.slug.current" class="exhibition-item">
              <div class="thumbnail" v-show="view == 'grid'">
                <img
                  :src="$urlFor(exhibition.thumbnail.asset).size(1280)"
                  width="1280"
                  loading="lazy"
                />
              </div>
              <div class="artists">
                <template v-if="exhibition.artists && exhibition.artists.length > 0">
                  <p v-for="artist in exhibition.artists" :key="artist._id" v-text="artist.title" />
                </template>
                <p v-if="view == 'grid' && exhibition.artists_additional && exhibition.artists_additional.length > 0" v-text="formatArtists(exhibition.artists_additional)" />
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
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

export default Vue.extend({
  name: 'Exhibitions',
  async asyncData({ app: { $sanity }}) {
    const query = groq`*[_type == "exhibition"]
    {
    	...,
      "thumbnail": {
     		"caption": thumbnail.caption,
     		"asset": thumbnail.asset->
    	},
      "artists": artists[] -> {title, slug, _id},
      "artists_additional": artists_additional[],
  	}`
    const exhibitions = await $sanity.fetch(query)
    exhibitions.sort((a, b) => new Date(b.open_date) - new Date(a.open_date))

    const today = DateTime.now()

    let future = exhibitions.filter((item) => {
      return DateTime.fromISO(item.open_date) >= today
    })

    let past = exhibitions.filter((item) => {
      return DateTime.fromISO(item.close_date) < today
    })

    let current = exhibitions.filter((item) => {
      return DateTime.fromISO(item.open_date) <= today &&
             DateTime.fromISO(item.close_date) >= today
    })

    console.log(future)
    // exhibitions.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))

    return {
      exhibitions,
      future,
      past,
      current
    }
  },
  methods: {
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
    },
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
    }
  },
  data () {
    return {
      title: 'Exhibitions',
      view: 'grid'
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
    justify-content: center;
  }
  .thumbnail {
    border: 1px solid #000;
    line-height:0;
  }
  section {
    margin:3em 0;
    &.current {
      .exhibition-title {
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;
        flex-direction:column;
        p {
          font-size: 0.5em;
          margin-top: 0.5em;
        }
      }
      .artists.many {
          margin: 2em 0;
        .artist-title {
          margin: -0.5em 0.25em;
        }
      }
    }
    &.future {
      .exhibition-list {
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #000;
        a {
          padding: 1.5em;
          display: block;
          text-align: center;
          line-height: 1.5;
        }
      }
    }
    &.past {
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
