<template>
  <main>
    <h1 class="title" v-text="exhibition.title" />
    <div class="content">
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

export default Vue.extend({
  async asyncData({ params, app: { $sanity }}) {

    const query = groq`*[_type == "exhibition" && slug.current == "${params.slug}"][0]`
    const exhibition = await $sanity.fetch(query)
    console.log(params)
    console.log(exhibition)
    return {
      exhibition
    }
  },
  data () {
    return {
    }
  },
  mounted() {
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
</style>
