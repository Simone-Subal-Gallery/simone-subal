<template>
  <div :class="['container', logOpen?'log-open':'']">
    <header>
      <div class="main-nav-wrapper">
        <a href="/">
          <h1 v-text="site.title" />
        </a>
        <Nav />
      </div>
    </header>
    <div :class="['overlay-toggle', (overlayOpen==true)?'is-open':'']" @click="overlayToggleHandler">
      <div class="circle" v-if="!logOpen"></div>
      <div class="close-log" v-if="logOpen">←</div>
    </div>

    <Log @opened="logOpened" :open="logOpen"/>

    <Nuxt />

    <aside :class="['overlay', (overlayOpen==true)?'open':'']">
      <div class="grid">
        <div class="left-col">
          <div class="address">
            <p>131 Bowery, 2nd floor<br>New York, NY 10002</p>
            <p>917 409 0612</p>
            <p>info@simonesubal.com</p>
          </div>
          <div class="map">
          </div>
          <div class="signup">
            <input placeholder="Email address" />
          </div>
        </div>
        <div class="right-col">
          <div class="team">
            <p>Simone Subal, Founder/Owner<br>
            Kelly McGee, Director<br>
            Moira Sims, Gallery Manager</p>
          </div>
        </div>
      </div>
    </aside>
    <footer>
      <SanityContent :blocks="site.footer"/>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'

export default Vue.extend({
  data() {
    return {
      overlayOpen: false,
      logOpen: false
    }
  },
  computed: {
    site() {
      return this.$store.state.site
    },
    bodyBg () {
      if (this.$store.state.site.bg_color != undefined) {
        return this.$store.state.site.bg_color }
      else { return '#eee' }
    }
  },
  watch: {
    '$route' () {
      this.overlayOpen = false
    }
  },
  methods: {
    overlayToggleHandler() {
      if (this.logOpen == true) {
        this.logOpen = false
      } else {
        this.overlayOpen = !this.overlayOpen
      }
    },
    openLog(bool) {
      this.logOpen = bool
    },
    logOpened() {
      this.logOpen = true
    }
  },
  created () {
    this.$nuxt.$on('toggleOverlay', () => {
      this.overlayToggleHandler()
    })
  },
  mounted () {
    document.body.style.backgroundColor = this.bodyBg
  }
})
</script>

<style lang="scss">
.container {
  min-height: calc(100vh - 3rem);
  display: flex;
  flex-direction: column;
}

header, footer {
  flex-shrink: 0;
}

main {
  flex-grow: 1;
}

header {
  border: 1px solid #000;
  background-color: #fff;
  z-index:2;
  position:fixed;
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
  margin: 0.5rem 1rem;
  font-size: 1.5rem;
  line-height:1;
}

nav {
  display: inline-block;
  margin-right: 2rem;
}

main {
  margin-top: 4.5rem;
}

footer {
  margin-top: 2rem;
}

.overlay-toggle {
  border:1px solid black;
  border-radius: 0rem 0.75rem 0.75rem 0;
  width: 3rem;
  height: 3rem;
  position: fixed;
  top:1.5rem;
  right:1rem;
  z-index:1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: content-box;
}

.overlay-toggle .circle {
  border-radius: 100%;
  width: 0.75rem;
  height: 0.75rem;
  border: 1px solid #000;
}

.overlay-toggle:hover .circle, .overlay-toggle.is-open .circle {
  background-color: #000;
}

.overlay-toggle .close-log {
  font-size:1.5rem;
}

.overlay {
  width: 100%;
  height: 100%;
  padding-top: 0rem;
  background: #fff;
  position: fixed;
  left:0;
  top:0;
  right:0;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index:0;
  transform:translateY(-100%);
  transition: transform 250ms ease-in-out;
  pointer-events:none;
  display:flex;
  .grid {
    display: flex;
    width:50vw;
    height: 60vh;
    .left-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin: 2em;
    }
    .right-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin:2em;
      align-items: center;
    }
  }
}
.overlay.open {
  transform:translateY(0);
  pointer-events:auto;
}



/*** LOG ****/
.container {
  header, .overlay-toggle, main {
    transform: translateX(0);
    transition: transform 333ms ease-in-out;
  }
}
.container.log-open {
  header, .overlay-toggle, main {
    transform: translateX(calc(-100vw + 6rem));
  }
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
