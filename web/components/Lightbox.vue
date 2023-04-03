<template>
  <div :id="id">
    <figure class="image" v-for="image, i in images" :key="image._id">
      <a :href="image.asset.url" class="lightbox-image">
        <lazy-img
          :background-color="image.asset.metadata.palette.vibrant.background"
          :lazy-src="$urlFor(image).size(1920).toString()"
          :width="image.asset.metadata.dimensions.width"
          :height="image.asset.metadata.dimensions.height"
          :lazy-srcset="`
            ${$urlFor(image).size(2880).toString()} 2880w,
            ${$urlFor(image).size(1920).toString()} 1920w,
            ${$urlFor(image).size(1024).toString()} 1024w,
            ${$urlFor(image).size(960).toString()} 960w,
            ${$urlFor(image).size(720).toString()} 720w,
            ${$urlFor(image).size(480).toString()} 480w,
            ${$urlFor(image).size(270).toString()} 270w`"
          :alt="caption"
        />
      </a>
      <figcaption>
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
  },
  methods: {
  }
}
</script>
<style>
.sl-wrapper .sl-image .sl-caption {
  display: block;
  max-height: 15vh;
  overflow: scroll;
}
</style>
