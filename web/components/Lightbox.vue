<template>
  <div :id="id">
    <figure class="image" v-for="image, i in images" :key="image._id">
      <a :href="$urlFor(image).size(2800)" class="lightbox-image">
        <SanityImage
          :asset-id="image.asset._ref"
          auto="format"
          :alt="'alttext'"
          loading="lazy"
        />
      </a>
      <figcaption>
        <!-- <p v-if="type!=undefined && type == 'workGallery'" v-text="i+1"/>
        <p v-if="type!=undefined && type != 'workSingle'" v-html="caption" /> -->
        <p v-if="numbered != undefined && numbered == true" v-html="i+1+'.'"/>
        <p v-if="caption != undefined" v-html="caption"/>
        <SanityContent v-if="caption==undefined" :blocks="image.caption" class="caption"/>
      </figcaption>
    </figure>
  </div>
</template>

<script>
import SimpleLightbox from "simplelightbox"

export default {
  props: {
    images: {
      type: Array
    },
    id: {
      type: String
    },
    type: {
      type: String
    },
    numbered: {
      type: Boolean
    },
    caption: {
      type: String
    }
  },
  data() {
    return {
      lightboxOptions: {
        fadeSpeed: 0,
        animationSlide: false,
        history: false,
        focus: true,
        loop: true,
        captionSelector: ( element ) => element.nextElementSibling,
        captionType: 'text',
        heightRatio: 0.7
      },
    }
  },
  mounted() {
    // const captionHtml = blocksToHtml({
    //   blocks: this.image.caption
    // })
    // this.lightboxOptions.additionalHtml = captionHtml

    let query = '#' + this.id + ' .lightbox-image'
    let lightbox = new SimpleLightbox(query, this.lightboxOptions)
    console.log(lightbox)
  },
  methods: {
  }
}
</script>
