<template>
  <section class="text">
    <SanityContent :blocks="text" :class="boxed?'boxed':''" />
  </section>
</template>

<script>
export default {
  props: {
    text: {
      type: Array
    },
    boxed: {
      type: Boolean
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
section.text {
  margin: 6em 0;
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
}
</style>
