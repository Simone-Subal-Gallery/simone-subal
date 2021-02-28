<template>
  <div class="log">
    <div v-for="dot in dots" :class="['dot', dot.color]" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

export default Vue.extend({
  async asyncData({ app: { $sanity }}) {
    const query = groq`*[_type == "event"]`
    const events = await $sanity.fetch(query)
    return { events }
  },
  data() {
    return {
      dots: [
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'orange'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'green'
        },
        {
          color: 'magenta'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'cyan'
        },
        {
          color: 'black'
        },
        {
          color: 'yellow'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'magenta'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'green'
        },
        {
          color: 'orange'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        },
        {
          color: 'cyan'
        },
        {
          color: 'black'
        },
        {
          color: 'yellow'
        },
        {
          color: 'magenta'
        },
        {
          color: 'black'
        },
        {
          color: 'black'
        }
      ]
    }
  }
})
</script>

<style lang="scss">
.log {
  display: block;
  position: absolute;
  top: 6rem;
  right:1rem;
  .dot {
    width:1rem;
    height: 1rem;
    margin:1rem;
    border: 1px solid #000;
    border-radius: 100%;
    &.black {
      background-color: #000;
    }
    &.magenta {
      background-color: magenta;
    }
    &.yellow {
      background-color: yellow;
    }
    &.cyan {
      background-color: cyan;
    }
    &.orange {
      background-color: orange;
    }
    &.green {
      background-color: lightgreen;
    }
  }
}
</style>
