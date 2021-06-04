<template>
  <section class="artist-url">
    <a :href="href" target="_blank">
      {{ title }}
    </a>
  </section>
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

<style lang="scss">
section.artist-url {
  margin: 3em 0;
  display: flex;
  justify-content: center;
  align-items:flex-start;
  flex-direction: column;
  a {
    border-radius: 2em;
    border: 1px solid #000;
    padding: 1em 2em;
  }
}
</style>
