<template>
  <main>
    <h1 class="title" v-text="fair.title" />
    <div class="content">
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

export default Vue.extend({
  async asyncData({ params, $sanity }) {
    const query = groq`*[_type == "fair" && slug.current == "${params.slug}"][0]`
    const fair = await $sanity.fetch(query)
    return { fair }
  },
  data () {
    return {
    }
  },
  mounted() {
    console.log(this.fair)
  },
  methods: {
    formatDates (open: string, close: string) {
      open = DateTime.fromISO(open)
      close = DateTime.fromISO(close)
      const from = open.toLocaleString({ month: 'long', day: 'numeric' })
      let to: string = ''
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
main.fair {
}
</style>
