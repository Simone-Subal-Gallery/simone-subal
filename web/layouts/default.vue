<template>
  <div>
    <header>
      <div class="main-nav-wrapper">
        <a href="/">
          <h1 v-text="site.title" />
        </a>
        <Nav />
      </div>
    </header>
    <div class="overlay-toggle">
      <div class="circle"></div>
    </div>

    <Log />

    <Nuxt />

    <aside class="overlay">
      <p>131 Bowery, 2nd floor<br>New York, NY 10002</p>
      <p>917 409 0612</p>
      <p>info@simonesubal.com</p>
    </aside>

  </div>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'

export default Vue.extend({
  computed: {
    site() {
      return this.$store.state.site
    }
  },
  mounted () {
    console.log(this.$store.state.site)
  }
})
</script>

<style lang="scss">
header {
  border: 1px solid #000;
  background-color: #fff;
  z-index:2;
  position:absolute;
  top:1.5rem;
  left:1.5rem;
  right: 4rem;
}

.main-nav-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  z-index:2;
  align-items: center;
  height: 3rem;
}

header h1 {
  margin-left: 1rem;
  font-size: 1.5rem;
}

nav {
  display: inline-block;
  margin-right: 2rem;
}

main {
  margin-top: 4.5rem;
}

.overlay-toggle {
  border:1px solid black;
  border-radius: 0.75rem;
  width: 3rem;
  height: 3rem;
  position: absolute;
  top:1.5rem;
  right:1.5rem;
  z-index:1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.overlay-toggle .circle {
  border-radius: 100%;
  width: 0.5rem;
  height: 0.5rem;
  border: 1px solid #000;
}

.overlay-toggle:hover .circle, .overlay-toggle.active .circle {
  background-color: #000;
}

.overlay {
  width: 100%;
  height: 100%;
  padding-top: 0rem;
  background: #fff;
  position: fixed;
  left:0;
  top:0;
  bottom:0;
  right:0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index:0;
  display: none;
}
.overlay.active {
  display:flex;
}

/*** ARTISTSS ***/
body.artists main div {
  padding: 1.5rem;
  background: #fff;
  border: 1px solid #000;
  display: inline-block;
  font-size: 2rem;
  margin: 1rem;
  border-radius: 3rem;
}

@media screen and (min-width: 1024px) {
  main {
    font-size: 1.25rem;
  }
}

@media screen and (min-width: 1280px) {
  main {
    font-size: 1.5rem;
  }
}

</style>
