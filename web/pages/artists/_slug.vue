<template>
  <main>
    <h1 class="title" v-text="artist.title" />
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
    const query = groq`*[_type == "artist" && slug.current == "${params.slug}"][0]`
    const artist = await $sanity.fetch(query)
    return { artist }
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
