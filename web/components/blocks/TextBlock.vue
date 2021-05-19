<template>
  <section class="text">
    <SanityContent :blocks="block.text" :class="block.boxed?'boxed':''" :serializers="serializers"/>
  </section>
</template>

<script>
import PDFBlock from '~/components/blocks/PDFBlock.vue'
import URLBlock from '~/components/blocks/URLBlock.vue'

const Link = {
  props: {
    href: {
      type: String
    }
  },
  render(createElement) {
    const props = {
      attrs: {
        href: this.href,
        target: '_blank'
      }
    }
    return createElement('a', props, this.$slots.default)
  }
}

const Image = {
  props: {
    asset: {
      type: Object
    }
  },
  render(createElement) {
    const props = {
      attrs: {
        src: this.asset.url
      }
    }
    return createElement('img', props, this.$slots.default)
  }
}

export default {
  data () {
    return {
      serializers: {
        types: {
          pdf: PDFBlock,
          link: URLBlock,
          image: Image
        },
        marks: {
          link: Link
        }
      }
    }
  },
  props: {
    block: {
      type: Object
    }
    // text: {
    //   type: Array
    // },
    // boxed: {
    //   type: Boolean
    // }
  },
  methods: {
  }
}
</script>

<style lang="scss">
section.text {
  margin: 3em 0;
  .boxed {
    border: 1px solid #000;
    padding: 2em 1em;
    font-size: 0.75em;
    display:flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  p {
    max-width: 800px;
    margin: 1em 0;
  }
  @media screen and (max-width:768px) {
    margin:1.5em 0;
  }
}
</style>
