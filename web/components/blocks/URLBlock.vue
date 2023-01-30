<template>
    <a :href="href" target="_blank">
      <slot></slot>
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
