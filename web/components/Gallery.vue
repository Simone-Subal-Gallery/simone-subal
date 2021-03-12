<template>
  <section class="gallery">
    <div v-swiper:mySwiper="swiperOption" ref="swiper" @click-slide="clickSlide">
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
        <div class="swiper-pagination"></div>
      </div>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import "swiper/css/swiper.css"
// import '~/assets/css/swiper.css'

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
  directives: {
    swiper: directive
  },
  data() {
    return {
      swiperOption: {
        spaceBetween: 32,
        pagination: {
          el: '.swiper-pagination',
          type: 'progressbar',
          clickable: true
        },
        keyboard: {
          enabled: true,
        },
      }
    }
  },
  methods: {
    clickSlide () {
      this.mySwiper.slideNext()
    }
  }
}
</script>

<style lang="scss">
.gallery {
  width:100%;
  .swiper-container{
    width: 100%;
  }
  .swiper-slide {
    text-align: left;
    width: auto;
    margin:0;
    img {
      width: auto;
      height:67vh;
      object-fit: contain;
    }
  }
  figcaption {
    font-size:0.85rem;
    padding: 0.5rem 0;
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
