<template>
    <a :href="href" target="_blank">
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
    href: {
      type: String
    },
  },
  methods: {
  }
}
</script>
