<template>
  <main class="index">
    <section class="featured">
      <div :class="['featured-block', item._type]"
           v-for="item in site.featured"
           :key="item._id"
           :style="'background-image:url('+$urlFor(item.thumbnail.asset).size(2800)+')'"
           @click="clickFeatured(item)">
        <div :class="[item.artists.length > 2 || item.artists_additional.length > 2 ? 'many':'', 'artists']">
          <template v-if="item.artists && item.artists.length > 0">
            <div v-for="artist in item.artists" :key="artist._id" v-text="artist.title" class="artist-title" />
          </template>
          <template v-if="item.artists_additional && item.artists_additional.length > 0">
            <div v-for="(artist, i) in item.artists_additional" :key="i" v-text="artist" class="artist-title" />
          </template>
        </div>
        <h2 class="exhibition-title" v-text="item.title" />
      </div>
    </section>
    <section class="announcement">
      <SanityContent :blocks="site.announcement" />
    </section>
    <section class="search">
      <input type="text" placeholder="Search" v-model="searchFeedValue" />
    </section>
    <div class="recent">
      <div v-for="item in filteredFeed" :key="item._id" :class="item._type">
        <nuxt-link :to="'/'+item._type+'s/'+item.slug.current" :class="item._type + '-title'" v-text="item.title" />
      </div>
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'

export default Vue.extend({
  async asyncData({ app: { $sanity }}) {
    const query = groq`*[_type in ["artist", "exhibition", "fair"]]`
    const feed = await $sanity.fetch(query)
    return { feed }
  },
  mounted() {
    console.log(this.$store.state.site)
  },
  computed: {
    site() {
      return this.$store.state.site
    },
    filteredFeed() {
      function compare(a, b) {
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1

        return 0
      }

      let feed = this.feed.filter(obj => {
        return (
          obj.title
            .toLowerCase()
            .indexOf(this.searchFeedValue.toLowerCase()) != -1
          ||
          obj.slug.current
            .toLowerCase().replace(/-/g,' ')
            .indexOf(this.searchFeedValue.toLowerCase()) != -1
        )
      })

      feed.sort(compare)

      return feed
    }
  },
  methods: {
    clickFeatured(item) {
      this.$router.push('/'+item._type+'s/'+item.slug.current)
    }
  },
  data() {
    return {
      searchFeedValue: ''
    }
  }
})
</script>

<style lang="scss">
main.index {
  .recent {
    display: flex;
    flex-wrap: wrap;
    min-height:calc(100vh - 220px);
    align-content: flex-start;
  }
  .fair {
    align-items: center;
    align-self: flex-end;
    justify-content: center;
    padding: 1.5em;
  }
  section {
    margin: 1.5rem 0;
    background: #fff;
    border: 1px solid #000;
    &.featured .featured-block {
      height: 60vh;
      min-height:480px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-size: cover;
      background-position: center;
      cursor:pointer;
      .artists.many {
        .artist-title {
          margin: -0.5em 1em;
        }
      }
    }
    &.announcement{
      height: 160px;
      border-radius: 6rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &.search {
      height: 80px;
      width: 80%;
      position: sticky;
      top: 6.5rem;
      margin: 1.5rem auto;
      border-radius: 3rem;
      display: flex;
      align-items:center;
      justify-content: flex-start;
      padding:0 3rem;
      input {
        font-size: 2em;
        height: 100%;
        width: 100%;
        border: 0px;
      }
    }
  }
}

</style>
