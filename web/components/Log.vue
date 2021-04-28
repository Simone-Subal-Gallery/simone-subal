<template>
  <div :class="['log', open?'is-open':'', partial_open?'is-partial-open':'']" @click="openLog()" id="log">
    <div v-for="item in filteredLog" :class="['log-item', item.category]" :key="item._key">
      <div class="date" v-text="formatDate(item.date)" v-if="open || partial_open" />
      <component :is="item.category" class="dot"/>
      <div class="title" v-text="item.title" v-if="open"/>
      <div class="type" v-text="item.category" v-if="open"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { DateTime } from 'luxon'

import acquisitions from '~/components/log/acquisitions.vue'
import artists from '~/components/log/artists.vue'
import awards from '~/components/log/awards.vue'
import events from '~/components/log/events.vue'
import exhibitions from '~/components/log/exhibitions.vue'
import fairs from '~/components/log/fairs.vue'
import fundraisers from '~/components/log/fundraisers.vue'
import gallery_shows from '~/components/log/gallery-shows.vue'
import museum_shows from '~/components/log/museum-shows.vue'
import press from '~/components/log/press.vue'
import publications from '~/components/log/publications.vue'
import residency from '~/components/log/residencies.vue'

export default Vue.extend({
  name: 'Log',
  components: {
    acquisitions,
    artists,
    awards,
    events,
    exhibitions,
    fairs,
    fundraisers,
    gallery_shows,
    museum_shows,
    press,
    publications,
    residency
  },
  data() {
    return {
      log: [],
      filteredLog: [],
      partial_open: false
    }
  },
  watch: {
    '$route' () {
      this.open = false
      if (this.$route.name == 'artists-slug') {
        this.filteredLog = this.log.filter(o => ('artist' in o) && (o.artist.slug==this.$route.params.slug))
        window.addEventListener('scroll', this.handleScroll)
      } else if (this.$route.name == 'artists') {
        this.filteredLog = this.log.filter(o => ('artist' in o))
        window.removeEventListener('scroll', this.handleScroll)
      } else if (this.$route.name == 'exhibitions-slug') {
        this.filteredLog = this.log.filter(o => ('exhibition' in o) && (o.exhibition.slug.current==this.$route.params.slug))
        window.removeEventListener('scroll', this.handleScroll)
      } else if (this.$route.name == 'exhibitions') {
        this.filteredLog = this.log.filter(o => ('exhibition' in o))
        window.removeEventListener('scroll', this.handleScroll)
      } else if (this.$route.name == 'fairs-slug') {
        this.filteredLog = this.log.filter(o => ('fair' in o) && (o.fair.slug.current==this.$route.params.slug))
        window.removeEventListener('scroll', this.handleScroll)
      } else if (this.$route.name == 'fairs') {
        this.filteredLog = this.log.filter(o => ('fair' in o))
        window.removeEventListener('scroll', this.handleScroll)
      } else {
        this.filteredLog = this.log
        window.removeEventListener('scroll', this.handleScroll)
      }
    }
  },
  props: ['open'],
  created() {
    this.log = this.$store.state.log
    if (this.$route.name == 'artists-slug') {
      this.filteredLog = this.log.filter(o => ('artist' in o) && (o.artist.slug==this.$route.params.slug))
    } else if (this.$route.name == 'artists') {
      this.filteredLog = this.log.filter(o => ('artist' in o))
    } else if (this.$route.name == 'exhibitions-slug') {
      this.filteredLog = this.log.filter(o => ('exhibition' in o) && (o.exhibition.slug.current==this.$route.params.slug))
    } else if (this.$route.name == 'exhibitions') {
      this.filteredLog = this.log.filter(o => ('exhibition' in o))
    } else if (this.$route.name == 'fairs-slug') {
      this.filteredLog = this.log.filter(o => ('fair' in o) && (o.fair.slug.current==this.$route.params.slug))
    } else if (this.$route.name == 'fairs') {
      this.filteredLog = this.log.filter(o => ('fair' in o))
    } else {
      this.filteredLog = this.log
    }
  },
  mounted() {
    console.log(this.$route)
  },
  beforeMount () {
    if (this.$route.name == 'artists-slug') {
      window.addEventListener('scroll', this.handleScroll, { passive: true })
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    openLog() {
      if (this.open == false && this.partial_open == false) {
        this.open = true
        this.$emit('opened')
      }
    },
    handleScroll() {
      let el = document.querySelector('#gallery')
      let desc = document.querySelector('#description')
      let el2 = document.querySelector('#logRow')
      let log = document.querySelector('#log')

      if (el2.getBoundingClientRect().top <= 82) {
        this.open = true
        this.partial_open = false
        log.style.top = (desc.getBoundingClientRect().height + desc.offsetTop + 128) + "px"
      } else if (el.getBoundingClientRect().bottom <= 82) {
        this.partial_open = true
        this.open = false
        log.style.top = "6rem"
      } else {
        this.partial_open = false
        this.open = false
      }
    },
    formatDate(date) {
      let d = DateTime.fromISO(date)
      return d.toFormat('dd.MM.yyyy')
    }
  }
})
</script>

<style lang="scss">
.log {
  display: block;
  position: fixed;
  top: 6rem;
  left:3rem;
  transition: transform 333ms ease-in-out;
  transform:translateX(100%);
  width: calc(100% - 6.5rem);
  z-index:1;
  &.is-partial-open {
    transform: translateX(calc(100% - 9.5rem));
    position: fixed;
  }
  &.is-open {
    transform:translateX(0);
    position:absolute;
  }
  .log-item {
    display: flex;
    align-items: center;
  }
  .date {
    flex:0;
    margin-right:1.5rem;
    width: 4rem;
  }
  .time {
    width: 58px;
  }
  .title {
    flex: 1;
    margin-left:1.5rem;
  }
  .type {
    width: 120px;
  }
  .dot {
    width:1rem;
    height: 1rem;
    margin:0.5rem;
    transition: transform 100ms ease-in-out;
    cursor: pointer;
    svg {
    }
    &:hover {
      transform:scale(1.1);
    }
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
