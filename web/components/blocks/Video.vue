<template>
  <div class="video-wrapper">
    <video controls width="100%" ref="video">
      <source type="video/mov">
      Video is not supported in this browser.
    </video>
    <SanityContent :blocks="caption" class="caption" />
  </div>
</template>

<script>
import { groq } from '@nuxtjs/sanity'
import Hls from 'hls.js'

export default {
  props: {
    asset: {
      type: String
    },
    caption: {
      type: Array
    }
  },
  data() {
    return {
      video: {
        type: Object
      }
    }
  },
  async fetch() {
    const vid = this.$props.asset
    const query = groq`*[ _id == "${vid}"][0]`
    this.video = await this.$sanity.fetch(query)
  },
  mounted() {
    this.mountVideo()
  },
  methods: {
    mountVideo () {
      const playbackId = this.video.playbackId
      const width = 1280
      const time = this.video.thumbTime
      const fitMode = 'preserve'
      let url = `https://stream.mux.com/${playbackId}.m3u8`
      let posterUrl = `https://image.mux.com/${playbackId}/thumbnail.png?width=${width}&fit_mode=${fitMode}&time=${time}`
      if (Hls.isSupported()) {
        let hls = new Hls()
        hls.loadSource(url)
        hls.attachMedia(this.$refs.video)
      } else {
        this.$refs.video.src = url
      }
      this.$refs.video.poster = posterUrl
    }
  }
}
</script>

<style lang="scss">
.video-wrapper {
  .caption {
    font-size:0.75em;
    margin: 0.5rem 1.5rem;
  }
}
</style>
