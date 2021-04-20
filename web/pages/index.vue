<template>
  <main class="index">
    <section class="featured">
      <div :class="['featured-block', item._type]"
           v-for="item in site.featured"
           :key="item._id"
           :style="'background-image:url('+$urlFor(item.thumbnail.asset).size(2800)+')'"
           @click="clickFeatured(item)">
        <div class="artists artist-title">
          <template v-if="item.artists && item.artists.length > 0 && item.artists.length < 3">
            <div v-for="artist in item.artists" :key="artist._id" v-text="artist.title" class="artist-title" />
          </template>
          <template v-else>
            <div v-swiper:mySwiper="swiperOption" ref="swiper">
              <div class="swiper-wrapper">
                <div v-for="artist in item.artists" :key="artist._id" v-text="artist.title" class="swiper-slide" />
              </div>
            </div>
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
      <div class="shuffle-btn" @click="shuffleFeed(feed)"><ShuffleIcon /></div>
    </section>
    <div class="recent">
      <div v-for="item in filteredFeed" :key="item._id" :class="item._type">
        <template v-if="item._type == 'contact'">
          <div class="overlay-toggle" @click="toggleOverlay">
            <span>Contact</span>
            <div class="circle"></div>
          </div>
        </template>
        <template v-else-if="item._type == 'artist' || item._type == 'exhibition'">
          <nuxt-link @mouseenter.native="hoverFeedItem(item.thumbnail.asset)" :to="'/'+item._type+'s/'+item.slug.current" :class="item._type + '-title'" v-text="item.title" />
        </template>
        <template v-else>
          <nuxt-link :to="'/'+item._type+'s/'+item.slug.current" :class="item._type + '-title'" v-text="item.title" />
          <span v-if="item._type == 'fair'" v-text="item.open_date.slice(0,4)" />
        </template>
      </div>
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import "swiper/css/swiper.css"

import ReloadIcon from '~/components/ReloadIcon.vue'
import ShuffleIcon from '~/components/ShuffleIcon.vue'

export default Vue.extend({
  components: {
    Swiper,
    SwiperSlide,
    ReloadIcon,
    ShuffleIcon
  },
  directives: {
    swiper: directive
  },
  async asyncData({ app: { $sanity }}) {
    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
    }
    const query = groq`*[_type in ["artist", "exhibition", "fair", "contact"]]`
    let feed = await $sanity.fetch(query)
    shuffleArray(feed)
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
      let feed = this.feed.filter(obj => {
        if (obj._type == 'exhibition' || obj._type == 'fair') {
          return (
            obj.title
              .toLowerCase()
              .indexOf(this.searchFeedValue.toLowerCase()) != -1
            ||
            obj.slug.current
              .toLowerCase().replace(/-/g,' ')
              .indexOf(this.searchFeedValue.toLowerCase()) != -1
            ||
            obj.open_date
              .toLowerCase().replace(/-/g,' ')
              .indexOf(this.searchFeedValue.toLowerCase()) != -1
          )
        } if (obj._type == 'contact') {
          return (
            obj.title
              .toLowerCase()
              .indexOf(this.searchFeedValue.toLowerCase()) != -1
            ||
            obj.slug.current
              .toLowerCase().replace(/-/g,' ')
              .indexOf(this.searchFeedValue.toLowerCase()) != -1
            ||
            obj.staff.map(e => e.title).join(" ")
              .toLowerCase()
              .indexOf(this.searchFeedValue.toLowerCase()) != -1
          )
        } else {
          return (
            obj.title
              .toLowerCase()
              .indexOf(this.searchFeedValue.toLowerCase()) != -1
            ||
            obj.slug.current
              .toLowerCase().replace(/-/g,' ')
              .indexOf(this.searchFeedValue.toLowerCase()) != -1
          )
        }
      })
      return feed
    }
  },
  methods: {
    toggleOverlay() {
      this.$nuxt.$emit('toggleOverlay')
    },
    clickFeatured(item) {
      this.$router.push('/'+item._type+'s/'+item.slug.current)
    },
    hoverFeedItem(asset) {
      if ( asset != undefined ) {
        let img = document.createElement('img')
        let body = document.querySelector('body')
        let bodyHeight = body.scrollHeight.toString() + 'px'
        let xns = [0, 1, 2]

        img.src = this.$urlFor(asset).size(540)
        img.style.bottom = 0

        img.classList.add('feed-floater')
        let startY = window.scrollY
        let positionX = xns[Math.floor(Math.random()*xns.length)]*33.333

        body.appendChild(img)

        let floating = [
          { transform: `translate3D(${positionX}vw, ${startY}px, 0)`},
          { transform: `translate3D(${positionX}vw, -${bodyHeight}, 0)`}
        ]
        let timing = {
          duration: 15000,
          iterations: 1
        }

        img.animate(
          floating,
          timing
        )

        Promise.all(
          img.getAnimations().map(animation => animation.finished)
        ).then(() => img.remove())
      }
    },
    shuffleFeed(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = array[i]
        Vue.set(this.feed, i, array[j])
        Vue.set(this.feed, j, temp)
      }
    },
  },
  data() {
    return {
      searchFeedValue: '',
      swiperOption: {
        loop: true,
        spaceBetween: 0,
        speed: 5000,
        grabCursor: true,
        freeMode: true,
        autoplay: 0.001,
        autoplay: {
          delay: 1
        },
      }
    }
  }
})
</script>

<style lang="scss">
@keyframes rotation {
  from {
    transform: rotate(359deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.feed-floater {
  width:33.333vw;
  height: auto;
  background-color: blue;
  position: absolute;
  z-index:-1;
  left:0;
}

main.index {
  .shuffle-btn {
    line-height:0;
    svg {
      width: 2.5em;
      cursor: pointer;
      height: auto;
      // animation: rotation 15s infinite linear;
    }
  }
  .recent {
    display: flex;
    flex-wrap: wrap;
    min-height: calc(100vh - 14em);
    align-content: flex-start;
  }
  .fair {
    align-items: center;
    align-self: flex-end;
    justify-content: center;
    padding: 1.5em;
    span {
      color: #fff;
      cursor: pointer;
    }
  }
  .contact {
    align-items: center;
    align-self: flex-end;
    justify-content: center;
    z-index:0;
    .overlay-toggle {
      margin:0.5em;
      border: 1px solid black;
      border-radius: 0.75rem;
      width: unset;
      padding: 1rem;
      font-size: 1.5em;
      height: unset;
      position: static;
      top: unset;
      right: unset;
      z-index: unset;
      display: flex;
      align-items: center;
      align-self: baseline;
      justify-content: center;
      cursor: pointer;
      box-sizing: content-box;
      span {
        line-height: 0.85;
        display: inline-block;
        padding-right: 1rem;
      }
    }
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
      .artists.artist-title {
        overflow: hidden;
        flex:1;
        padding:0;
        .swiper-container {
          .swiper-container-free-mode > .swiper-wrapper {
            transition-timing-function: linear !important;
          }
          .swiper-slide {
            padding: 0.5em 1em;
          }
        }
      }
      .exhibition-title {
        flex: 1;
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
      z-index:1;
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
