<template>
  <div :class="['log', open?'is-open':'', expanded?'is-expanded':'', partial_open?'is-partial-open':'']" @click="openLog()">
    <div v-for="item in filteredLog" :class="['log-item', item.category]" :key="item._key">
      <div class="date" v-text="formatDate(item.date)" v-if="open || partial_open || expanded" />
      <component :is="item.category" class="dot"/>
      <div class="main-info" v-if="open || expanded">
        <div class="title" v-text="formatTitle(item)" @click="itemClick(item)"/>
        <div class="references">
          <NuxtLink v-for="(ref, index) in item.references"
          :key="ref._key"
          :to="'/'+ref._type+'s/'+ref.slug.current">
          {{ ref.title}}<span v-if="index != item.references.length - 1">, </span>
          </NuxtLink>
        </div>
      </div>
      <div class="type" v-text="formatCategory(item.category)" v-if="open || expanded"/>
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
      partial_open: false,
      expanded: false
    }
  },
  watch: {
    '$route' () {
      this.open = false
      this.partial_open = false
      this.expanded = false
      if (this.$route.name == 'artists-slug') {
        this.filteredLog = this.log.filter(o => o.references.some(ref => ref.slug.current == this.$route.params.slug))
        window.addEventListener('scroll', this.handleScroll)
      } else if (this.$route.name == 'artists') {
        this.filteredLog = this.log.filter(o => o.references.some(ref => ref._type == 'artist') || o.category == 'artists')
        window.removeEventListener('scroll', this.handleScroll)
      } else if (this.$route.name == 'exhibitions-slug') {
        this.filteredLog = this.log.filter(o => o.references.some(ref => ref.slug.current == this.$route.params.slug))
        window.removeEventListener('scroll', this.handleScroll)
      } else if (this.$route.name == 'exhibitions') {
        this.filteredLog = this.log.filter(o => o.references.some(ref => ref._type == 'exhibition'))
        window.removeEventListener('scroll', this.handleScroll)
      } else if (this.$route.name == 'fairs-slug') {
        this.filteredLog = this.log.filter(o => o.references.some(ref => ref.slug.current == this.$route.params.slug))
        window.removeEventListener('scroll', this.handleScroll)
      } else if (this.$route.name == 'fairs') {
        this.filteredLog = this.log.filter(o => o.references.some(ref => ref._type == 'fair') || o.category == 'fairs')
        window.removeEventListener('scroll', this.handleScroll)
      } else {
        this.filteredLog = this.log
        window.removeEventListener('scroll', this.handleScroll)
      }
    }
  },
  props: ['open', 'primary'],
  created() {
  },
  mounted() {
    this.log = this.$store.state.log
    if (this.$route.name == 'artists-slug') {
      this.filteredLog = this.log.filter(o => o.references.some(ref => ref._type == 'artist') && o.references.some(ref => ref.slug.current == this.$route.params.slug))
    } else if (this.$route.name == 'artists') {
      this.filteredLog = this.log.filter(o => o.references.some(ref => ref._type == 'artist'))
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
  beforeMount () {
    if (this.$route.name == 'artists-slug') {
      window.addEventListener('scroll', this.handleScroll, { passive: true })
    }
  },
  beforeDestroy() {
  },
  methods: {
    openLog() {
      if (this.open == false && this.expanded==false && this.partial_open==false) {
        this.open = true
        this.$emit('opened')
      } else if ( this.partial_open == true ) {
        // scroll down to expanded breakpoint
        const yOffset = -72
        const element = document.querySelector('#logRow')
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({top: y, behavior: 'smooth'});

      } else if ( this.expanded == true ) {
      }
    },
    handleScroll() {
      let el = document.querySelector('#gallery')
      let desc = document.querySelector('#description')
      let exhibitions = document.querySelector('#selected_exhibitions')
      let el2 = document.querySelector('#logRow')
      let log = document.querySelector('#log')

      if (this.primary==true && this.open==false) {
        if (el2.getBoundingClientRect().top <= 128) {
          this.expanded = true
          this.partial_open = false
          log.style.top = (desc.getBoundingClientRect().height + exhibitions.getBoundingClientRect().height + desc.offsetTop + 48) + "px"
          el2.style.height = (log.getBoundingClientRect().height - 5*16) + "px"
        } else if (el.getBoundingClientRect().bottom <= 64) {
          this.partial_open = true
          this.expanded = false
          log.style.top = "0px"
        } else {
          this.partial_open = false
          this.expanded = false
        }
      }
    },
    itemClick(item) {
      if (this.open == true || this.expanded == true) {
        if (item.external_link != undefined) {
          window.open(item.external_link, '_blank')
        } else if (item.url != undefined) {
          window.open(item.url, '_blank')
        } else if (item.pdf != undefined) {
          window.open(item.pdf, '_blank')
        } else if (item.fair != undefined) {
          this.$router.push({ name: 'fairs-slug', params: { slug: item.fair.slug.current }})
        } else if (item.exhibition != undefined) {
          this.$router.push({ name: 'exhibitions-slug', params: { slug: item.exhibition.slug.current }})
        } else if (item.artist != undefined) {
          this.$router.push({ name: 'artists-slug', params: { slug: item.artist.slug.current }})
        }
      }
    },
    formatTitle(item) {
      let string = ''
      // if (item.references!=undefined && item.references.length>0) {
      //   let refs = item.references.map(r => r.title)
      //   let refString = refs.join(", ")
      //   string += refString + ' - '
      // }
      if (item.category == 'press' && item.publication!=undefined) {
        string += item.publication + ': ' + item.title
      } else {
        string += item.title
      }
      return string
    },
    formatCategory(category) {
      let text = ''
      switch (category) {
        case 'acquisitions':
          text = 'Acquisition'
          break
        case 'artists':
            text = 'Artist'
            break
        case 'awards':
            text = 'Award'
            break
        case 'events':
            text = 'Event'
            break
        case 'exhibitions':
            text = 'Exhibition'
            break
        case 'fairs':
            text = 'Fair'
            break
        case 'fundraisers':
            text = 'Fundraiser'
            break
        case 'gallery_shows':
          text = 'Gallery Show'
          break
        case 'museum_shows':
          text = 'Museum Show'
          break
        case 'press':
          text = 'Press'
          break
        case 'publications':
          text = 'Publication'
          break
        case 'residency':
          text = 'Residency'
          break
        default:
          text = 'Event'
      }
      return text
    },
    formatDate(date) {
      let d = DateTime.fromISO(date)
      return d.toFormat('dd.MM.yyyy')
    }
  }
})
</script>

<style lang="scss">
.container .log-open {

}

.log {
  &.mobile {
    display:none;
  }
  &:not(.mobile) {
    overflow: hidden;
    position: fixed;
    top: 0rem;
    left:3.5rem;
    padding-top:5rem;
    padding-right:3rem;
    transition: transform 333ms ease-in-out;
    transform:translateX(100%);
    width: calc(100% - 6.5rem);
    z-index:1;
    @media screen and (max-width:768px) {
      left:3.5rem;
      padding-top:5rem;
      padding-right:0px;
    }
  }
  display: block;
  &.is-partial-open {
    transform: translateX(calc(100% - 9.5rem));
    position: fixed;
  }
  &.is-open {
    transform:translateX(0);
    &:not(.mobile) {
      overflow: scroll;
      height: 100vh;
      padding-right:0px;
      left:3rem;
    }
  }
  &.is-expanded {
    transform:translateX(0);
    position: absolute;
  }
  &.mobile {
    position: static;
  }
  .log-item {
    display: flex;
    align-items: flex-start;
    margin:1em 0;
    grid-column-gap:1.5rem;
  }
  .date {
    flex:0;
    width: auto;
  }
  .time {
    width: 58px;
  }
  .main-info {
    flex: 1;
    cursor:pointer;
    .title {

    }
    .references {
      font-size:0.75em;
    }
  }
  .type {
    width: 120px;
  }
  .dot {
    width:1rem;
    height: 1rem;
    margin:0;
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
  @media screen and (max-width:768px) {
    &.mobile {
      display:block;
    }
    .log-item {
      display:grid;
      grid-template-columns: 1rem 1fr 1fr;
      grid-template-rows:1fr;
      grid-column-gap:0.5em;
      margin:1em 0;
    }
    .dot {
      order:1;
      margin:0px;
    }
    .date {
      order:2;
      text-align:left;
      margin-left:0;
      width:auto;
      font-size:0.75em;
    }
    .type {
      order:3;
      text-align:right;
      width:unset;
      font-size:0.75em;
    }
    .main-info {
      order:4;
      margin:0;
      margin-left:1.5rem;
      grid-column:span 3;
    }
  }
}
</style>
