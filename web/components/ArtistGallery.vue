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
        let imagesLoaded = 0
        this.$refs.flickity.$flickity.on( 'lazyLoad', function( event, cellElement ) {
          imagesLoaded++
          console.log(imagesLoaded)
        })
        if (imagesLoaded > 3) {
          this.$refs.flickity.$flickity.resize()
          console.log('resize slideshow!)')
        }

        this.$refs.flickity.$flickity.x = 0
        this.$refs.flickity.$flickity.on('dragStart', () => {
          this.isPaused = true
        })
        this.update()
      }
    }
  },
  mounted () {
    let lightbox = new SimpleLightbox('.image-grid a', this.lightboxOptions)
    // this.onInit()
  }
}
</script>

<style lang="scss">
.gallery.artist-gallery {
  margin: 0 -2rem;
  @media screen and (max-width: 768px) {
    margin: 0 -1rem;
  }
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
    @media screen and (max-width: 768px) {
      width: 96px;
      margin: 0.25em;
      top: 0.5em;
      right: unset;
      left: 50%;
      transform: translateX(-50%);
      a {
        padding: 0.5em;
        font-size: 0.65em;
      }
    }
  }
  .carousel {
    height:67vh;
    img {
      display:block;
      max-height: 67vh;
      min-height:67vh;
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
    @media screen and (max-width: 768px) {
      height: 50vh;
      img {
        max-height: 50vh;
        min-height:50vh;
      }
    }
  }
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
    @media screen and (max-width: 768px) {
      padding: 0 0.25em;
      a {
        width:96px;
        margin:0.25em;
        &:hover {
          img {
            opacity:1;
          }
          .caption {
            display:none;
          }
        }
      }
    }
  }
}
</style>
