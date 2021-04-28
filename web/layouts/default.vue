<template>
  <div :class="['container', logOpen?'log-open':'']">
    <header>
      <div class="main-nav-wrapper">
        <nuxt-link to="/">
          <h1 v-text="site.title" />
        </nuxt-link>
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
      this.logOpen = false
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

/**** Simple Lightbox *****/
// You can customize Simplelightbox with the following variables:

$sl-font-family: 'Neuzeit Grotesk', 'Helvetica', sans-serif !default;
$sl-overlay-background: #fff !default;
$sl-overlay-opacity: 1 !default;
$sl-navigation-color: #000 !default;
$sl-caption-color: #000 !default;
$sl-caption-background: rgba(0, 0, 0, 0) !default;

$sl-counter-fontsize: 0.75rem !default;
$sl-caption-fontsize: 0.75rem !default;
$sl-close-fontsize: 3rem !default;

$sl-breakpoint-medium: 35.5em !default; // 568px, when 1em == 16px
$sl-breakpoint-large: 50em !default; // 800px, when 1em == 16px

$sl-arrow-fontsize-small: 2rem !default;
$sl-arrow-fontsize-medium: 3rem !default;
$sl-arrow-fontsize-large: 3rem !default;
$sl-img-border-small: 0 none !default;
$sl-img-border-medium: 0 none !default;
$sl-img-border-large: 0 none !default;
$sl-iframe-border-small: 0 none !default;
$sl-iframe-border-medium: 0 none !default;
$sl-iframe-border-large: 0 none !default;

$add-vendor-prefixes: true !default;

body.hidden-scroll {
    overflow: hidden;
}

.sl-overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: $sl-overlay-background;
    opacity: $sl-overlay-opacity;
    display: none;
    z-index: 1035;
}

.sl-wrapper {
    z-index: 1040;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: fixed;

    * {
        box-sizing: border-box;
    }
    button {
        border: 0 none;
        background: transparent;
        font-size: 28px;
        padding: 0;
        cursor: pointer;
        &:hover {
            opacity: 0.7;
        }
    }

    .sl-close {
        display: none;
        position: fixed;
        right: 30px;
        top: 30px;
        z-index: 10060;
        margin-top: -14px;
        margin-right: -14px;
        height: 44px;
        width: 44px;
        line-height: 44px;
        font-family: $sl-font-family;
        color: $sl-navigation-color;
        font-size: $sl-close-fontsize;

        &:focus {
            //outline: none;
        }
    }

    .sl-counter {
        display: none;
        position: fixed;
        top: 30px;
        left: 30px;
        z-index: 1060;
        color: $sl-navigation-color;
        font-size: $sl-counter-fontsize;
    }

    .sl-navigation {
        width: 100%;
        display: none;
        button {
            position: fixed;
            top: 50%;
            margin-top: -22px;
            height: 44px;
            width: 22px;
            line-height: 44px;
            text-align: center;
            display: block;
            z-index: 10060;
            font-family: $sl-font-family;
            color: $sl-navigation-color;
            &.sl-next {
                right: 5px;
                font-size: $sl-arrow-fontsize-small;
            }

            &.sl-prev {
                left: 5px;
                font-size: $sl-arrow-fontsize-small;
            }

            &:focus {
                //outline: none;
            }

            @media (min-width: $sl-breakpoint-medium) {
                width: 44px;

                &.sl-next {
                    right: 10px;
                    font-size: $sl-arrow-fontsize-medium;
                }

                &.sl-prev {
                    left: 10px;
                    font-size: $sl-arrow-fontsize-medium;
                }
            }
            @media (min-width: $sl-breakpoint-large) {
                width: 44px;

                &.sl-next {
                    right: 20px;
                    font-size: $sl-arrow-fontsize-large;
                }

                &.sl-prev {
                    left: 20px;
                    font-size: $sl-arrow-fontsize-large;
                }
            }
        }
    }

    &.sl-dir-rtl {
        .sl-navigation {
            direction: ltr;
        }
    }

    .sl-image {
        position: fixed;
        @if $add-vendor-prefixes {
            -ms-touch-action: none;
        }
        touch-action: none;
        z-index: 10000;
        img {
            margin: 0;
            padding: 0;
            display: block;
            border: $sl-img-border-small;
            width: 100%;
            height: auto;
            @media (min-width: $sl-breakpoint-medium) {
                border: $sl-img-border-medium;
            }
            @media (min-width: $sl-breakpoint-large) {
                border: $sl-img-border-large;
            }

        }
        iframe {
            background: #000;
            border: $sl-iframe-border-small;
            @media (min-width: $sl-breakpoint-medium) {
                border: $sl-iframe-border-medium;
            }
            @media (min-width: $sl-breakpoint-large) {
                border: $sl-iframe-border-large;
            }
        }
        .sl-caption {
            display: none;
            padding: 10px;
            color: $sl-caption-color;
            background: $sl-caption-background;
            font-size: $sl-caption-fontsize;
            // position: absolute;
            bottom: 0;
            left: 0;
            right: 0;

            &.pos-top {
                bottom: auto;
                top: 0;
            }

            &.pos-outside {
                bottom: auto;
            }
        }

        .sl-download {
            display: none;
            position: absolute;
            bottom: 5px;
            right: 5px;
            color: $sl-navigation-color;
            z-index: 1060;
        }
    }
}

.sl-spinner {
    display: none;
    border: 5px solid #333;
    border-radius: 40px;
    height: 40px;
    left: 50%;
    margin: -20px 0 0 -20px;
    opacity: 0;
    position: fixed;
    top: 50%;
    width: 40px;
    z-index: 1007;
    @if $add-vendor-prefixes {
        -webkit-animation: pulsate 1s ease-out infinite;
        -moz-animation: pulsate 1s ease-out infinite;
        -ms-animation: pulsate 1s ease-out infinite;
        -o-animation: pulsate 1s ease-out infinite;
    }
    animation: pulsate 1s ease-out infinite;
}

.sl-scrollbar-measure {
    position: absolute;
    top: -9999px;
    width: 50px;
    height: 50px;
    overflow: scroll;
}

.sl-transition {
    @if $add-vendor-prefixes {
        transition: -moz-transform ease 200ms;
        transition: -ms-transform ease 200ms;
        transition: -o-transform ease 200ms;
        transition: -webkit-transform ease 200ms;
    }
    transition: transform ease 200ms;
}

@-webkit-keyframes pulsate {
    0% {
        transform: scale(.1);
        opacity: 0.0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: scale(1.2);
        opacity: 0;
    }
}

@keyframes pulsate {
    0% {
        transform: scale(.1);
        opacity: 0.0;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: scale(1.2);
        opacity: 0;
    }
}

@if $add-vendor-prefixes {
    @-moz-keyframes pulsate {
        0% {
            transform: scale(.1);
            opacity: 0.0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: scale(1.2);
            opacity: 0;
        }
    }

    @-o-keyframes pulsate {
        0% {
            transform: scale(.1);
            opacity: 0.0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: scale(1.2);
            opacity: 0;
        }
    }

    @-ms-keyframes pulsate {
        0% {
            transform: scale(.1);
            opacity: 0.0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: scale(1.2);
            opacity: 0;
        }
    }
}

</style>
