<template>
  <main class="fairs">
    <div v-for="(year, index) in years" :key="index" class="year-list">
      <!-- <div class="year">{{ year }}</div> -->
      <div v-for="fair in groups[year]" :key="fair._id" class="fair-listing">
        <div class="year" v-text="fair.year" />
        <nuxt-link :to="'/fairs/'+fair.slug.current" class="fair-item">
          <div class="title" v-text="fair.title" />
          <div class="dates" v-text="formatDates(fair.open_date, fair.close_date)" />
        </nuxt-link>
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
    const query = groq`*[_type == "fair"]`
    const fairs = await $sanity.fetch(query)

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
      years
    }
  },
  data () {
    return {
      title: 'Fairs'
    }
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
main.fairs {
  .year-list {
    margin: 1rem;
  }
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
  .year-list > .fair-listing:first-child {
    .year {
      opacity:1;
    }
  }
}
</style>
