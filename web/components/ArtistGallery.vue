<template>
  <section class="gallery artist-gallery">
    <div class="view-controls">
      <a :class="view == 'flow'?'active':''" @click="setView('flow')">Flow</a>
      <a :class="view == 'grid'?'active':''" @click="setView('grid')">Grid</a>
    </div>
    <flickity ref="flickity" v-show="view == 'flow'" :options="flickityOptions" class="carousel" @init="onInit"
      @mouseenter.native="pause" @mouseleave.native="play" @focusin.native="pause" @focusout.native="play">
        <a :href="$urlFor(image).size(1920)" v-for="image in images" :key="image._key">
          <img
            :src="$urlFor(image).size(400)"
            :data-flickity-lazyload="$urlFor(image).size(1920)"
            :data-flickity-lazyload-srcset="`
              ${$urlFor(image).size(2880)} 2880w,
              ${$urlFor(image).size(1920)} 1920w,
              ${$urlFor(image).size(1024)} 1024w,
              ${$urlFor(image).size(960)} 960w,
              ${$urlFor(image).size(720)} 720w,
              ${$urlFor(image).size(480)} 480w,
              ${$urlFor(image).size(270)} 270w`"
            sizes="(min-width: 1920px) 2880px,
                   (min-width: 1280px) 1920px,
                   (min-width: 960px) 1024px,
                   (min-width: 720px) 960px,
                   (min-width: 480px) 720px,
                   (min-width: 360px) 480px,
                   270px"
            :data-flickity-lazyload-src="$urlFor(image).size(1920)"
            :alt="image.asset.altText"
          />
        </a>
    </flickity>
    <div class="image-grid" v-show="view == 'grid'">
      <a class="grid-item" v-for="image in images" :key="image._key" :href="$urlFor(image).size(1920)">
        <SanityContent :blocks="image.caption" class="caption"/>
        <img
          :src="$urlFor(image).size(480)"
          :alt="image.asset.altText"
        />
      </a>
    </div>
    <!-- <div v-swiper:mySwiper="swiperOption" ref="swiper" @click-slide="clickSlide">
      <div class="swiper-wrapper">
        <figure v-for="image in images" :key="image._key" class="image swiper-slide">
          <SanityImage
            :asset-id="image.asset._id"
            auto="format"
            class="mainImage"
            height="480"
            :alt="image.asset.altText"
          />
          <figcaption>
            <SanityContent :blocks="image.caption" />
          </figcaption>
        </figure>
      </div>
    </div> -->
  </section>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import "swiper/css/swiper.css"
import SimpleLightbox from "simplelightbox"

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  props: {
    images: {
      type: Array
    },
    paginationId: {
      type: String
    }
  },
  // directives: {
  //   swiper: directive
  // },
  data() {
    return {
      flickityOptions: {
        prevNextButtons: false,
        pageDots: false,
        draggable: true,
        wrapAround: true,
        selectedAttraction: 0.01,
        friction: 0.15,
        cellSelector: 'img',
        imagesLoaded: true,
        lazyLoad: 4,
        freeMode: true
      },
      swiperOption: {
        spaceBetween: 8,
        speed: 3000,
        loop: true,
        autoplay: {
          delay: 0,
          disableOnInteraction: false
        },
        freeMode: true,
        autoplay: true,
        slidesPerView: 8,
        keyboard: {
          enabled: true,
        },
      },
      lightboxOptions: {
        fadeSpeed: 0,
        animationSlide: false,
        history: false,
        focus: true,
        loop: true,
        captionSelector: '.caption',
        captionType: 'text',
        heightRatio: 0.7
      },
      isPaused: false,
      tickerSpeed: 1,
      view: 'flow',
      slideIndex: 0,
      flickityReady: false
    }
  },
  methods: {
    setView(view) {
      this.view = view
      if (view == 'flow') {
        // this.$refs.flickity.resize()
        this.isPaused = false
        this.update()
      } else if (view == 'grid') {
        this.isPaused = true
      }
    },
    update () {
      const tickerSpeed = 1

      if (this.isPaused) return
      if (this.view != 'flow') return
      if (this.$refs.flickity.$flickity.slides) {
        this.$refs.flickity.$flickity.x = (this.$refs.flickity.$flickity.x - this.tickerSpeed) % this.$refs.flickity.$flickity.slideableWidth
        this.$refs.flickity.$flickity.selectedIndex = this.$refs.flickity.$flickity.dragEndRestingSelect()
        this.$refs.flickity.$flickity.updateSelectedSlide()
        this.$refs.flickity.$flickity.settle(this.$refs.flickity.$flickity.x)
        this.$refs.flickity.lazyLoad
      }
      window.requestAnimationFrame(this.update)
    },
    pause () {
      this.isPaused = true
    },
    play () {
      if (this.isPaused) {
        this.isPaused = false
        window.requestAnimationFrame(this.update)
      }
    },
    onInit () {
      // console.log(this.$refs.flickity.$flickity)
      this.$refs.flickity.$flickity.x = 0
      this.$refs.flickity.$flickity.on('dragStart', () => {
        this.isPaused = true
      })
      this.update()
    }
  },
  mounted () {
    let lightbox = new SimpleLightbox('.image-grid a', this.lightboxOptions)
  }
}
</script>

<style lang="scss">
.gallery.artist-gallery {
  margin: 0 -2rem;
  .view-controls {
    display: flex;
    width: 120px;
    margin:0.5em;
    position: absolute;
    top: 1.25em;
    right: 1.5em;
    margin: 0.5em;
    a {
      flex: 1;
      padding: 0.5em;
      background-color: transparent;
      border:1px solid #000;
      margin:0;
      text-align: center;
      font-size: 0.85em;
      line-height:1;
      text-transform:uppercase;
      cursor: pointer;
      &.active {
        background-color: #eee;
      }
      &:first-child {
        border-radius: 2em 0em 0em 2em;
        border-right:0px;
      }
      &:last-child {
        border-radius: 0em 2em 2em 0em;
      }
    }
  }
  .carousel {
    height:67vh;
    img {
      display:block;
      height: 67vh;
      margin-right:0.5em;
      max-width:none;
      opacity:0;
      transition: opacity 333ms ease-out;
      &.flickity-lazyloaded {
        opacity:1;
      }
      &:after {
        content:'+';
        display:block;
        cursor:pointer;
      }
    }
  }
  // .swiper-container{
  //   width: 100%;
  // }
  // .swiper-wrapper {
  //   transition-timing-function:linear !important;
  // }
  // .swiper-slide {
  //   text-align: left;
  //   width: auto;
  //   margin:0;
  //   img {
  //     width: auto;
  //     height:67vh;
  //   }
  // }
  figcaption {
    font-size:0.85rem;
    padding: 0.5rem 0;
  }
  .image-grid {
    display: flex;
    flex-wrap:wrap;
    justify-content: space-evenly;
    align-items: center;
    a {
      display:block;
      width:160px;
      margin:0.5em;
      line-height:0;
      &:hover {
        outline: 1px solid #000;
        img {
          opacity:0;
        }
        .caption {
          display:block;
        }
      }
    }
    .caption {
      font-size:0.5em;
      line-height:1;
      display:none;
      position: absolute;
      padding: 1em;
      max-width:160px;
    }
  }
  @media screen and (max-width: 768px) {
    .swiper-wrapper {
      figure.swiper-slide {
      }
    }
  }
}

.swiper-pagination {
  .swiper-pagination-bullet {
  }
  .swiper-pagination-bullet-active {
  }
}
</style>
