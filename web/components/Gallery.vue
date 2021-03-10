<template>
  <section class="gallery">
    <div v-swiper:mySwiper="swiperOption" ref="swiper" @click-slide="clickSlide">
      <div class="swiper-wrapper">
        <figure v-for="image in images" :key="image._key" class="image swiper-slide">
          <SanityImage
            :asset-id="image.asset._id"
            auto="format"
            class="mainImage"
            :alt="image.asset.altText"
          />
          <figcaption>
            <SanityContent :blocks="image.caption" />
          </figcaption>
        </figure>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import '~/assets/css/swiper.css'

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
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 32,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'fraction'
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
  .swiper-container {
    height:60vh;
  }
  .swiper-wrapper {
    .swiper-slide {
      width:unset;
      img {
        height:100%;
        width:auto;
      }
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
