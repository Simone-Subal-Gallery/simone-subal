<template>
  <section class="cta">
    <a :href="block.url" :target="block.blank?'_blank':''" v-text="block.text" />
  </section>
</template>

<script>
export default {
  props: {
    block: {
      type: Object
    }
    // link: {
    //   type: String
    // },
    // text: {
    //   type: String
    // },
    // blank: {
    //   type: Boolean
    // }
  },
  methods: {
  }
}
</script>

<style lang="scss">
section.cta {
  margin: 6em 0;
  display: flex;
  justify-content: center;
  align-items:center;
  flex-direction: column;
  a {
    border-radius: 2em;
    border: 1px solid #000;
    padding: 1em 2em;
  }
}
</style>
