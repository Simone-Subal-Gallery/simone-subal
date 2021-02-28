<template>
  <div class="container">

    <main class="index">
      <section class="featured">
        featured
      </section>
      <section class="announcement">
        ANNOUNCEMENT
      </section>
      <section class="search">
        SEARCH
      </section>
      <div class="artists">
        <div v-for="artist in artists" :key="artist._id">
          <h2><a v-bind:href="artist.slug.current" v-text="artist.title" /></h2>
        </div>
      </div>
    </main>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'

export default Vue.extend({
  async asyncData({ app: { $sanity }}) {
    const query = groq`*[_type == "artist"]`
    const artists = await $sanity.fetch(query)
    return { artists }
  }
})
</script>

<style>
</style>
