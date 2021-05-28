<template>
  <section class="gallery artist-gallery">
    <div class="view-controls">
      <a :class="view == 'flow'?'active':''" @click="setView('flow')">Flow</a>
      <a :class="view == 'grid'?'active':''" @click="setView('grid')">Grid</a>
    </div>
    <flickity ref="flickity" v-show="view == 'flow'" :options="flickityOptions" class="carousel" @init="onInit"
      @mouseenter.native="pause" @mouseleave.native="play" @focusin.native="pause" @focusout.native="play">
          <img
            v-for="image in images" :key="image._key"
            :src="$urlFor(image).size(800)"
            style="margin:0 0.25em"
            :width="image.asset.metadata.dimensions.width"
            :height="image.asset.metadata.dimensions.height"
            :data-flickity-lazyload="$urlFor(image).size(1920)"
            :data-flickity-lazyload-srcset="`
              ${$urlFor(image).size(2880)} 2880w,
              ${$urlFor(image).size(1920)} 1920w,
              ${$urlFor(image).size(1024)} 1024w,
              ${$urlFor(image).size(960)} 960w,
              ${$urlFor(image).size(720)} 720w,
              ${$urlFor(image).size(480)} 480w,
              ${$urlFor(image).size(270)} 270w`"
            sizes="(min-width: 2440px) 2880px,
                   (min-width: 1440px) 1920px,
                   (min-width: 960px) 1024px,
                   (min-width: 720px) 960px,
                   (min-width: 480px) 720px,
                   (min-width: 360px) 480px,
                   270px"
            :data-flickity-lazyload-src="$urlFor(image).size(1920)"
            :alt="image.asset.altText"
          />
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
  </section>
</template>

<script>
export default {
  props: {
    images: {
      type: Array
    },
    paginationId: {
      type: String
    }
  },
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
        lazyLoad: 5,
        freeMode: true,
        cellAlign: 'left'
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
      if (this.$refs.flickity.$flickity != undefined) {
        this.$refs.flickity.$flickity.x = 0

        this.$refs.flickity.$flickity.on('ready', () => {
          this.$refs.flickity.$flickity.resize()
          this.play()
        })
        this.$refs.flickity.$flickity.on('dragStart', () => {
          this.isPaused = true
        })
        this.$refs.flickity.$flickity.on('dragEnd', () => {
          this.play()
        })

        this.$refs.flickity.$flickity.resize()
        this.$refs.flickity.$flickity.reposition()
        this.update()
      }
    }
  },
  mounted () {
    let lightbox = new SimpleLightbox('.image-grid a', this.lightboxOptions)
    this.onInit()
  }
}
</script>

<style lang="scss">

</style>
