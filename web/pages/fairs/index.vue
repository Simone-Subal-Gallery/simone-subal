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
          <nuxt-link :to="'/fairs/'+fair.slug.current" class="fair-item" :data-duplicate="fair.duplicate_id">
            <div class="title" v-text="fair.title" />
            <div class="dates" v-text="formatDates(fair.open_date, fair.close_date)" />
          </nuxt-link>
        </template>
        <template v-else>
          <template v-if="fair.link">
            <a :href="fair.link" class="fair-item" :data-duplicate="fair.duplicate_id">
              <div class="title" v-text="fair.title" />
              <div class="dates" v-text="formatDates(fair.open_date, fair.close_date)" />
            </a>
          </template>
          <template v-else>
            <div class="fair-item" :data-duplicate="fair.duplicate_id">
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

    // const duplicates = fairs
    // .map((el, i) => {
    //     return fairs.find((element, index) => {
    //         if (i !== index && element.title === el.title) {
    //             return el.title
    //         }
    //     })
    // })
    // .filter(x => x)

    let duplicates = []
    fairs.forEach((el, i) => {
      fairs.forEach((element, index) => {
        if (i === index) return null
        if (element.title === el.title) {
          let slug = el.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '')
          fairs[index].duplicate_id = slug
          if (!duplicates.includes(slug)) {
            duplicates.push(slug)
          }
        }
      })
    })

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
      current,
      duplicates
    }
  },
  data () {
    return {
      title: 'Fairs'
    }
  },
  created() {
  },
  mounted() {
    console.log("duplicates:", this.duplicates)
    var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']

    let i = 0
    for (i = 0; i < this.duplicates.length; i++) {
      let hex = colorArray[Math.floor(Math.random() * colorArray.length)]

      let els = document.querySelectorAll(".fair-item[data-duplicate="+this.duplicates[i]+"]")
      let index = 0
      for (index = 0; index < els.length; index++) {
        els[index].style.color = hex
      }
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
        color: #fff;
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
