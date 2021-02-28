<template>
  <div class="log">
    <div v-for="event in events" :key="event._id" v-text="event.title"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

export default Vue.extend({
  name: 'Log',
  async asyncData({ app: { $sanity }}) {
    const query = groq`*[_type == "event"]`
    const events = await $sanity.fetch(query)
    return { events }
  }
})
</script>

<style>
</style>
