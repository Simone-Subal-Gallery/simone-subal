<template>
  <main class="viewing-room">
    <section>
      <h2>Viewing Room</h2>
    </section>
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

export default Vue.extend({
  name: 'Viewing Room',
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
