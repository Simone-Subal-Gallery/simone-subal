<template>
  <main class="artists">
    <div v-for="artist in artists" :key="artist._id" class="artist-listing">
      <nuxt-link :to="'/artists/'+artist.slug.current" v-text="artist.title" class="artist-item artist-title" />
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'

export default Vue.extend({
  name: 'Artists',
  async asyncData({ app: { $sanity }}) {
    const query = groq`*[_type == "artist"]`
    const artists = await $sanity.fetch(query)

    artists.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))

    console.log(artists)
    return {
      artists
    }
  },
  data () {
    return {
      title: 'Artists'
    }
  }
})
</script>
<style lang="scss">
main.artists {
  display: flex;
  flex-wrap: wrap;
  padding: 1.5rem 0;
  font-size: 1rem;
}
@media screen and (min-width: 1024px) {
  main.artists {
    font-size: 1.25rem;
  }
}
@media screen and (min-width: 1440px) {
  main.artists {
    font-size: 1.5rem;
  }
}
@media screen and (max-width: 768px) {
  main.artists {
    font-size: 0.75rem;
  }
}
@media screen and (max-width: 640px) {
  main.artists {
    font-size: 0.5rem;
  }
}
</style>
