<template>
  <main class="index">
    <div class="featured">
      <section :class="['featured-block', item._type]"
           v-for="item in site.featured"
           :key="item._id"
           :tabindex="0"
           :style="'background-image:url('+featuredBG(item)+')'"
           @click="clickFeatured(item)">
        <template v-if="item._type!='artist'">
          <div :class="['artists', item.artists.length>=3?'many':'']">
          <template v-if="item.artists && item.artists.length > 0 && item.artists.length < 3">
            <div class="artist-title" v-for="artist in item.artists" :key="artist._id" v-text="artist.title" />
          </template>
          <template v-else>
            <div class="artist-title" >
              <div v-swiper:mySwiper="swiperOption" ref="swiper">
                <div class="swiper-wrapper">
                  <div v-for="artist in item.artists" :key="artist._id" v-text="artist.title" class="swiper-slide" />
                </div>
              </div>
            </div>
          </template>
          </div>
        </template>
        <h2 class="exhibition-title" v-if="item._type!='artist'" v-text="item.title" />
        <h2 class="artist-title" v-if="item._type=='artist'" v-text="item.title" />
      </section>
    </div>
    <section class="announcement">
      <SanityContent :blocks="site.announcement" />
    </section>
    <section class="search" role="search">
      <label id="search-home-label" for="search-home-input">
        Search:
        <input id="search-home-input" type="text" v-model="searchFeedValue" />
      </label>
      <div class="shuffle-btn" @click="shuffleFeed(feed)"><ShuffleIcon /></div>
    </section>
    <div class="recent">
      <div v-for="item in filteredFeed" :key="item._id" :class="item._type">
        <template v-if="item._type == 'contact'">
          <div class="overlay-toggle" @click="toggleOverlay" role="button" tabindex="0">
            <span>Contact</span>
            <div class="circle"></div>
          </div>
        </template>
        <template v-else-if="item._type == 'artist' || item._type == 'exhibition'">
          <nuxt-link @mouseenter.native="hoverFeedItem(item.thumbnail.asset)" :to="'/'+item._type+'s/'+item.slug.current" :class="item._type + '-title'" v-text="item.title" />
        </template>
        <template v-else>
          <nuxt-link :to="'/'+item._type+'s/'+item.slug.current" :class="item._type + '-title'" v-text="item.title" />
          <span v-if="item._type == 'fair'" v-text="item.open_date.slice(0,4)" tabindex="0" />
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
  head: {
    bodyAttrs: {
      class: 'home-index'
    }
  },
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
      let lightbox = document.querySelector('.simple-lightbox')
      if (lightbox == undefined) {this.$nuxt.$emit('toggleOverlay')}
    },
    clickFeatured(item) {
      this.$router.push('/'+item._type+'s/'+item.slug.current)
    },
    featuredBG(item) {
      if (item.cover!=undefined) {
        return this.$urlFor(item.cover.asset).size(2800)
      } else if (item.thumbnail!=undefined) {
        return this.$urlFor(item.thumbnail.asset).size(2800)
      } else {
        return 'transparent'
      }
    },
    hoverFeedItem(asset) {
      if ( asset != undefined ) {
        let img = document.createElement('img')
        let body = document.querySelector('body')
        let bodyHeight = body.scrollHeight.toString() + 'px'
        let xns = [0, 1, 2]
        let durations = [3000, 5000, 7500, 10000, 12500, 15000, 20000]

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

        let duration = durations[Math.floor(Math.random()*durations.length)]

        let timing = {
          duration: duration,
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
  position: absolute;
  z-index:-1;
  left:0;
}

body.home-index {
  #log {
    display: block;
  }
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
    @media screen and (max-width:768px) {
      margin: 0 -0.25em;
    }
    .fair {
      align-items: center;
      align-self: flex-end;
      justify-content: center;
      padding: 1.5em;
      span {
        color: #FF7D15;
        cursor: pointer;
      }
      @media screen and (max-width:768px) {
        padding:0.5em;
        font-size:0.75em;
      }
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
    @media screen and (max-width:768px) {
      .overlay-toggle {
        font-size: 1em;
        padding:0.5em;
        border-radius: 0.5rem;
        .circle {
          width:0.5rem;
          height:0.5rem;
        }
      }
    }
  }
  section {
    margin: 1.5rem 0;
    background: #fff;
    border: 1px solid #000;
    @media screen and (max-width: 768px) {
      margin:0.5rem 0;
    }
    &.announcement{
      height: 160px;
      border-radius: 6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      @media screen and (max-width: 768px) {
        height:auto;
        padding: 1.5em;
        border-radius:3em;
      }
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
      padding:0 3rem 0 2rem;
      z-index:1;
      color:#FF7D15;
      label#search-home-label {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 1.5em;
      }
      input {
        font-size: 2em;
        height: 100%;
        width: 100%;
        border: 0px;
      }
      @media screen and (max-width:768px) {
        height:unset;
        width:100%;
        padding:0.5em;
        font-size:1em;
        input {
          font-size: 1em;
        }
        .shuffle-btn svg {
          width:1.5em;
        }
      }
    }
  }
  .featured {
    section.featured-block {
      height: 60vh;
      min-height:480px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-size: cover;
      background-position: center;
      cursor:pointer;
      &:first-of-type {
        margin-top:0px;
      }
      .artists.many {
        flex: 1;
        overflow:hidden;
        .artist-title {
          overflow:hidden;
          padding-left:0px;
          padding-right:0px;
        }
      }
      .swiper-wrapper {
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
        max-width:67%;
      }
      @media screen and (max-width:768px) {
        min-height:unset;
        height:calc(60vh - 7.5rem);
        padding:0.5em;
        flex-direction:column;
        align-items:flex-start;
        justify-content: flex-start;
        .exhibition-title, .artist-title {
          max-width:unset;
        }
      }
    }
  }
}

</style>
