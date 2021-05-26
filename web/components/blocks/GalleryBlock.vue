<template>
  <div :class="['exhibition-gallery', !block.display?'sticky_col':block.display]" :id="'exhibitionGallery'+index">
    <div class="install" v-if="block.install!=undefined && block.install.length > 0">
      <!-- <h3>Installation</h3> -->
        <Lightbox :id="'installlightbox'+index" :images="block.install" />
    </div>
    <div class="work">
      <!-- <h3>Works</h3> -->
      <Lightbox v-if="block.work!=undefined && block.work.length > 0" :type="'workGallery'" :id="'worklightbox'+index" :numbered="block.numbered" :images="block.work" />
    </div>
  </div>
</template>

<script>
import Lightbox from '~/components/Lightbox.vue'
import LazyImg from '~/components/LazyImg.vue'

export default {
  props: {
    block: {
      type: Object
    },
    // work: {
    //   type: Array
    // },
    // install: {
    //   type: Array
    // },
    index: {
      type: Number
    }
  },
  components: {
    Lightbox
  },
  methods: {
  },
  mounted () {
    console.log(this.block)
    // let el = '#exhibitionGallery' + this.index
    // let wrapper = document.getElementById('exhibitionGallery' + this.index)
    // let height = wrapper.offsetHeight
    // let divs = document.querySelectorAll(`${el} .work, ${el} .install`)
    // let i
    //
    // var controller = new this.$scrollmagic.Controller()
    // // create a scene
    // new this.$scrollmagic.Scene({
    // 	duration: height, // the scene should last for a scroll distance of 100px
    //   triggerElement: el,
    //   triggerHook: 0
    // })
    // 	.setPin(el) // pins the element for the the scene's duration
    // 	.addTo(controller) // assign the scene to the controller


    // window.onscroll = function() {
    //   console.log(window.pageYOffset - wrapper.offsetTop)
    //   if (window.pageYOffset - wrapper.offsetTop > 0 || window.pageYOffset > wrapper.offsetTop + wrapper.innerHeight) {
    //     wrapper.classList.add('sticky')
    //     wrapper.style.top = window.top
    //   } else {
    //     wrapper.classList.remove('sticky')
    //   }
    // }

    // if (wrapper.offsetTop <= 20) {
    //   alert('offset')
    // }

    // /** Scroll sync between editor and preview **/
    // // Locks so that only one pane is in control of scroll sync
    // var eScroll = false
    // var pScroll = false
    // // Set the listener to scroll
    // this.edit.on('scroll', function() {
    //     if(eScroll) { // Lock the editor pane
    //         eScroll = false
    //         return;
    //     }
    //     pScroll = true // Enable the preview scroll
    //
    //     // Set elements to variables
    //     let current = self.edit.get(0)
    //     let other = self.preview.get(0)
    //
    //     // Calculate the position of scroll position based on percentage
    //     let percentage = current.scrollTop / (current.scrollHeight - current.offsetHeight)
    //
    //     // Set the scroll position on the other pane
    //     other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight)
    // });
    // this.preview.on('scroll', function() {
    //     if(pScroll) { // Lock the preview pane
    //         pScroll = false
    //         return
    //     }
    //     eScroll = true // Enable the editor scroll
    //
    //     // Set elements to variables
    //     let current = self.preview.get(0)
    //     let other = self.edit.get(0)
    //
    //     // Calculate the position of scroll position based on percentage
    //     let percentage = current.scrollTop / (current.scrollHeight - current.offsetHeight)
    //
    //     // Set the scroll position on the other pane
    //     other.scrollTop = percentage * (other.scrollHeight - other.offsetHeight)
    //
    // })

  }
}
</script>

<style lang="scss">
.exhibition-gallery {
  padding: 3em 0;
  &.sticky_col {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 1rem;
    .install, .work {
      position: sticky;
      top:6rem;
      align-self:start;
    }
  }
  .install {
    figcaption {
      font-size: 0.75rem;
      max-width:720px;
      margin-bottom: 1rem;
      margin-top: 0.75rem;
    }
  }
  .work {
    figure {
      display: grid;
      grid-template-columns: 4fr 2fr;
      grid-gap: 0.75em;
      margin-bottom:1rem;
      figcaption {
        font-size:0.75rem;
        align-self:end;
        margin-bottom: 0.5rem;
      }
    }
  }
  @media screen and (max-width:768px) {
    &.sticky_col {
      grid-template-columns: 1fr;
      .install, .work {
        position: static;
      }
    }
  }
}
</style>
