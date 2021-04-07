<template>
  <main class="fairs">
    <section class="current" v-if="current != undefined && current.length>0">
      <h2>Current</h2>
      <div class="fair-list">
        <div v-for="fair in current" :key="fair._id" class="fair-listing">
          <div class="fair-item">
              <div class="title" v-text="fair.title"/>
              <div class="artists" v-if="fair.artists && fair.artists.length > 0" >
                <p v-text="formatArtists(fair.artists)"/>
              </div>
              <div class="dates" v-text="formatDates(fair.open_date, fair.close_date, 'future')" />
          </div>
        </div>
      </div>
    </section>
    <div v-for="(year, index) in years" :key="index" class="year-list">
      <!-- <div class="year">{{ year }}</div> -->
      <div v-for="fair in groups[year]" :key="fair._id" class="fair-listing">
        <div class="year" v-text="fair.year" />
        <template v-if="fair.more_content">
          <nuxt-link :to="'/fairs/'+fair.slug.current" class="fair-item">
            <div class="title" v-text="fair.title" />
            <div class="dates" v-text="formatDates(fair.open_date, fair.close_date)" />
          </nuxt-link>
        </template>
        <template v-else>
          <template v-if="fair.link">
            <a :href="fair.link" class="fair-item">
              <div class="title" v-text="fair.title" />
              <div class="dates" v-text="formatDates(fair.open_date, fair.close_date)" />
            </a>
          </template>
          <template v-else>
            <div class="fair-item">
              <div class="title" v-text="fair.title" />
              <div class="dates" v-text="formatDates(fair.open_date, fair.close_date)" />
            </div>
          </template>
        </template>

      </div>
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

export default Vue.extend({
  name: 'Fairs',
  async asyncData({ app: { $sanity }}) {
    const query = groq`
    *[_type == "fair"] | order(open_date desc)
      {
      	...,
        artists[]{
          _type == 'artist_additional' => {
            ...
          },
          ...@->
        }
    	}`
    let fairs = await $sanity.fetch(query)
    const today = DateTime.now()

    let current=[]
    current = fairs.filter((item) => {
      return DateTime.fromISO(item.open_date) <= today &&
             DateTime.fromISO(item.close_date) >= today
    })

    if (current.length > 0) {
      fairs = fairs.filter((item) => {
        return DateTime.fromISO(item.open_date) > today ||
               DateTime.fromISO(item.close_date) < today
      })
    }

    function setYear(objectArray) {
      for (const object of objectArray) {
        const dt = DateTime.fromISO(object.open_date)
        const year = dt.year
        object.year = year
      }
    }

    function groupBy(objectArray, property) {
       return objectArray.reduce((acc, obj) => {
          const key = obj[property]
          if (!acc[key]) {
             acc[key] = []
          }
          // Add object to list for given key's value
          acc[key].push(obj)
          return acc;
       }, {})
    }

    setYear(fairs)
    fairs.sort((a, b) => new Date(b.open_date) - new Date(a.open_date))
    let groups = groupBy(fairs, 'year')
    let years = Object.keys(groups)
    years.sort( function ( a, b ) { return b - a } )

    console.log(groups)
    return {
      groups,
      years,
      current
    }
  },
  data () {
    return {
      title: 'Fairs'
    }
  },
  methods: {
    formatArtists (artists) {
      return artists.map(artist => artist.title).join(", ")
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
main.fairs {
  .current {
    margin-bottom: 3em;
    h2 {
      font-size: 1em;
    }
    .fair-list {
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #000;
      .fair-item {
        padding: 1.5em;
        display: block;
        text-align: center;
        line-height: 1.5;
      }
    }
  }
  .year-list {
    margin: 1rem;
    .fair-listing {
      display: grid;
      grid-template-columns: 1fr 5fr;
      margin: 1em 0;
      .year {
        opacity:0;
      }
      .fair-item {
        display: flex;
        & > div {
          flex: 1;
        }
      }
    }
  }
  .year-list > .fair-listing:first-child {
    .year {
      opacity:1;
    }
  }
}
</style>
