<template>
  <div :class="['log', open?'is-open':'']" @click="openLog()">
    <div v-for="(item, index) in events" class="event" :key="index">
      <div class="date" v-text="item.date" v-if="open" />
      <div class="time" v-text="item.time" v-if="open" />
      <div :class="['dot', item.color]" :key="index"/>
      <div class="title" v-text="item.title" v-if="open"/>
      <div class="type" v-text="item.type" v-if="open"/>
    </div>
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
  props: ['open'],
  data() {
    return {
      events: [
        {
          color: 'black',
          date: 'Sun Feb 28 2021',
          time: '18:02:13',
          title: 'Baseera Khan at MoMA (March 1 - June 15, 2021)',
          type: 'Event',
        },
        {
          color: 'black',
          date: 'Fri Feb 26 2021',
          time: '12:04:45',
          title: 'Jesse Wine at New Museum (March 1 - June 15, 2021)',
          type: 'Event',
        },
        {
          color: 'orange',
          date: 'Wed Feb 24 2021',
          time: '11:38:04',
          title: 'New Exhibition Title announcement',
          type: 'Announcement',
        },
        {
          color: 'black',
          date: 'Wed Feb 24 2021',
          time: '11:36:51',
          title: 'Artist Talk at Artists Space',
          type: 'Event',
        },
        {
          color: 'black',
          date: 'Wed Feb 24 2021',
          time: '11:32:37',
          title: 'Kiki Kogelnik in Artforum',
          type: 'Press',
        },
        {
          color: 'green',
          date: 'Wed Feb 24 2021',
          time: '11:28:13',
          title: 'Curator-in-Residence: First Name Last Name',
          type: 'Residency',
        },
        {
          color: 'magenta',
          date: 'Wed Feb 24 2021',
          time: '11:26:47',
          title: 'Name Name added to gallery roster!',
          type: 'Announcement',
        },
        {
          color: 'black',
          date: 'Sun Feb 21 2021',
          time: '09:05:47',
          title: 'Cameron Clayborn in Artnet',
          type: 'Press',
        },
        {
          color: 'black',
          date: 'Sun Feb 21 2021',
          time: '09:02:34',
          title: 'Florian Meisenberg in FLASH Art',
          type: 'Press',
        },
        {
          color: 'black',
          date: 'Sun Feb 21 2021',
          time: '09:00:12',
          title: 'Artist Talk at Artists Space',
          type: 'Event',
        },
        {
          color: 'black',
          date: 'Sun Feb 21 2021',
          time: '08:53:02',
          title: 'Artist interview in Artforum',
          type: 'Press',
        },
        {
          color: 'black',
          date: 'Tue Feb 08 2021',
          time: '14:20:33',
          title: 'Frieze Press Release',
          type: 'Press',
        },
        {
          color: 'cyan',
          date: 'Tue Feb 08 2021',
          time: '11:32:37',
          title: 'Design update',
          type: 'Announcement',
        },
        {
          color: 'black',
          date: 'Tue Feb 08 2021',
          time: '14:20:33',
          title: 'Artist interview with curator of Museum',
          type: 'Press',
        },
        {
          color: 'yellow',
          date: 'Wed Feb 02 2021',
          time: '18:02:13',
          title: 'The Players (Jesse Wine) opens February 4',
          type: 'Exhibition',
        },
        {
          color: 'black',
          date: 'Wed Feb 02 2021',
          time: '18:02:13',
          title: 'Article in Magazine',
          type: 'Press',
        },
        {
          color: 'black',
          date: 'Wed Feb 02 2021',
          time: '14:20:33',
          title: 'Update on COVID-19 policies',
          type: 'News',
        },
        {
          color: 'green',
          date: 'Fri Jan 28 2021',
          time: '14:20:33',
          title: 'Participating in Art Basel 2021',
          type: 'Announcement',
        },
        {
          color: 'black',
          date: 'Tue Jan 25 2021',
          time: '11:32:37',
          title: 'Article in Newspaper',
          type: 'Press',
        },
        {
          color: 'black',
          date: 'Tue Jan 25 2021',
          time: '14:20:33',
          title: 'Archival acquisition',
          type: 'Announcement',
        },
        {
          color: 'magenta',
          date: 'Sat Jan 21 2021',
          time: '18:02:13',
          title: 'Museum show opening',
          type: 'Event',
        },
        {
          color: 'black',
          date: 'Sat Jan 21 2021',
          time: '14:20:33',
          title: 'Interview w/ newspaper',
          type: 'Press',
        },
        {
          color: 'orange',
          date: 'Sat Jan 21 2021',
          time: '11:32:37',
          title: 'New website launch!',
          type: 'Announcement',
        }
      ]
    }
  },
  methods: {
    openLog() {
      this.open = true
      this.$emit('opened')
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
  transition: transform 333ms ease-in-out;
  transform:translateX(0px);
  &.is-open {
    width: calc(100% - 4rem);
  }
  .event {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  .date {
    width:130px;
    margin-right:0.5rem;
  }
  .time {
    width: 58px;
  }
  .title {
    flex: auto;
  }
  .type {
    width: 120px;
  }
  .dot {
    width:1rem;
    height: 1rem;
    margin:0.5rem;
    border: 1px solid #000;
    border-radius: 100%;
    transition: transform 100ms ease-in-out;
    cursor: pointer;
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
