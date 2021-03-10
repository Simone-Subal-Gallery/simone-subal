<template>
    <!-- <nuxt-link v-if="currentSlug" :to="{ path: `/speakers/${currentSlug}` }">
      <b>{{ personName }} </b>
    </nuxt-link>
    <b v-if="!currentSlug">{{ personName }} </b> -->
    <a :href="getUrlFromId(asset._ref)" target="_blank" class="pdf button">
      {{ title }}
      <!-- <span class="date">{{ date_published }}</span> -->
    </a>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    asset: {
      type: Object
    }
  },
  methods: {
    getUrlFromId(ref) {
      // Example ref: file-207fd9951e759130053d37cf0a558ffe84ddd1c9-mp3
      // We don't need the first part, unless we're using the same function for files and images
      const [_file, id, extension] = ref.split('-')
      return `https://cdn.sanity.io/files/ub94fyvm/production/${id}.${extension}`
    }
  }
}
</script>
