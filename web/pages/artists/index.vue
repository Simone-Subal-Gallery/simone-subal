<template>
  <main class="artists">
    <div v-for="(artist, i) in artists"
        :key="artist._id"
        class="artist-listing">
      <nuxt-link :to="'/artists/'+artist.slug.current"
      v-text="artist.title"
      @mouseover.native="mouseoverHandler(i, $event)"
      @mouseleave.native="mouseleaveHandler(i, $event)"
      class="artist-item artist-title" />
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'

export default Vue.extend({
  name: 'Artists',
  async asyncData({ app: { $sanity }}) {
    const query = groq`*[_type == "artist"] | order(sortName asc)`
    const artists = await $sanity.fetch(query)
    return {
      artists
    }
  },
  methods: {
    loadImages (artists) {
      for (var i = 0; i < artists.length; i++) {
        let img = new Image()
        let url = this.$urlFor(artists[i].thumbnail).url()
        img.src = url
        img.classList.add('bg-image')
        this.bgImages[i] = img
      }
    },
    mouseoverHandler (i, event) {
      let body = document.body
      let el = event.target
      let artists = document.querySelectorAll('.artist-item')
      body.appendChild(this.bgImages[i])
      artists.forEach((el) => el.classList.add('not-hovered'))
      el.classList.add("is-hovered")
    },
    mouseleaveHandler (i, event) {
      let body = document.body
      let img = body.querySelector('.bg-image')
      let el = event.target
      if (img != undefined) { body.removeChild(img) }
      let artists = document.querySelectorAll('.artist-item')
      artists.forEach((el) => el.classList.remove('not-hovered','is-hovered'))
    }
  },
  mounted () {
    this.loadImages(this.artists)
  },
  beforeDestroy() {
    let body = document.body
    let imgs = body.querySelectorAll('.bg-image')
    if (imgs != undefined) { imgs.forEach((img) => body.removeChild(img)) }
  },
  data () {
    return {
      title: 'Artists',
      bgImages: []
    }
  }
})
</script>
<style lang="scss">
.bg-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: -1;
}

main.artists {
  display: flex;
  flex-wrap: wrap;
  padding: 1.5rem 0;
  font-size: 1rem;
  .artist-item {
    opacity: 1;
    &.not-hovered {
      background-color: transparent;
    }
    &.is-hovered {
      opacity: 1;
      background-color: #fff;
    }
  }
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
