<template>
  <a :href="href" target="_blank">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String
    }
  },
  mounted() {
  }
}
</script>
