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
      <div class="recent">
        <div v-for="item in feed" :key="item._id" :class="item._type">
          <nuxt-link :to="'/'+item._type+'s/'+item.slug.current" :class="item._type + '-title'" v-text="item.title" />
        </div>
      </div>
    </main>

  </div>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'

export default Vue.extend({
  async asyncData({ app: { $sanity }}) {
    const query = groq`*[_type in ["artist", "exhibition", "fair"]]`
    const feed = await $sanity.fetch(query)
    return { feed }
  }
})
</script>

<style lang="scss">
main.index {
  .recent {
    display: flex;
    flex-wrap: wrap;
  }
  .fair {
    align-items: center;
    align-self: flex-end;
    justify-content: center;
    padding: 1.5em;
  }
}
</style>
