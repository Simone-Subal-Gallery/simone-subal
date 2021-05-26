<template>
  <div :class="['container', logOpen?'log-open':'', overlayOpen?'overlay-open':'']">
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

    <Log @opened="logOpened" :open="logOpen" :primary="true" id="log"/>

    <Nuxt />

    <aside :class="['overlay', (overlayOpen==true)?'open':'']"
    :style="'background-color:'+contact.bg_color"
    >
      <Nav class="mobile"/>

      <div class="grid">
        <div class="left-col">
          <SanityContent :blocks="contact.content" :serializers="serializers"/>
          <div class="signup">
            <h3>Mailing list:</h3>
            <mailchimp-subscribe
              url="https://simonesubal.us1.list-manage.com/subscribe/post-json"
              user-id="829a90f7ddaa926bcc5a953a1"
              list-id="8cc410c812"
              @error="onError"
              @success="onSuccess"
            >
              <template v-slot="{ subscribe, setEmail, error, success, loading }">
                <form @submit.prevent="subscribe">
                  <div class="mailing-list">
                    <input type="email" placeholder="Email" @input="setEmail($event.target.value)" />
                    <button type="submit" v-html="error?error:success?'Thanks!':loading?'Loading...':'Sign Up'" />
                  </div>
                  <!-- <div v-if="error">{{ error }}</div>
                  <div v-if="success">Thanks for signing up!</div>
                  <div>Loading…</div> -->
                </form>
              </template>
            </mailchimp-subscribe>
          </div>
        </div>
        <div class="right-col">
          <div class="team">
            <a v-for="member in contact.staff"
            :key="member._key"
            target="_blank"
            :href="'mailto:'+member.email">
              <span class="name">{{ member.title }}</span><br>
              {{ member.position }}
            </a>
          </div>
          <div class="socials">
            <a v-for="channel in contact.socials"
            :key="channel._key"
            class="social-channel"
            target="_blank"
            :href="channel.url"
            v-text="channel.title" />
          </div>
        </div>
      </div>
      <nav class="secondary">
        <NuxtLink v-for="item in contact.secondary_nav"
        :key="item._key"
        :to="'/pages/'+item.slug.current"
        v-text="item.title"
        />
      </nav>
    </aside>
    <footer v-show="!logOpen">
      <SanityContent :blocks="site.footer"/>
    </footer>
  </div>
</template>

<script>
import MailchimpSubscribe from 'vue-mailchimp-subscribe'
import Vue from 'vue'
import { groq } from '@nuxtjs/sanity'
import { mapState } from 'vuex'

const Link = {
  props: {
    href: {
      type: String
    }
  },
  render(createElement) {
    const props = {
      attrs: {
        href: this.href,
        target: '_blank'
      }
    }
    return createElement('a', props, this.$slots.default)
  }
}

export default Vue.extend({
  data() {
    return {
      overlayOpen: false,
      logOpen: false,
      success: false,
      serializers: {
        marks: {
          link: Link
        }
      }
    }
  },
  components: {
    MailchimpSubscribe,
  },
  computed: {
    ...mapState(['site', 'contact']),
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
    },
    overlayOpen () {
      let container = document.querySelector('.container')
      let main = document.querySelector('main')

      if (this.overlayOpen == true) {
        let top = window.scrollY - (1.5*16)
        main.style.position = 'fixed'
        main.style.top = `-${top}px`
        main.style.pointerEvents = 'none'
      } else {
        let scrollY = main.style.top
        main.style.position = ''
        main.style.top = ''
        main.style.pointerEvents = 'auto'
        let scrollPos = parseInt(scrollY || '0') - 24
        window.scrollTo(0, scrollPos * -1)
      }
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
    },
    onError() {
      // handle error
    },
    onSuccess() {
      // handle success
      this.success=true
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
  // overflow:hidden;
  &.overlay-open {
    overflow:hidden;
  }
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
  z-index:3;
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
  nav {
    display: inline-block;
    margin-right: 2rem;
    a.nuxt-link-active {
      text-decoration: underline;
    }
    @media screen and (max-width:768px) {
        display:none;
    }
  }
}

header h1 {
  margin: 0.5rem 1rem;
  font-size: 1.5rem;
  line-height:1;
}

main {
  margin-top: 4.5rem;
  left:1.5rem;
  right:4rem;
  @media screen and (max-width: 768px) {
    margin-top: 3.5rem;
  }
}

footer {
  margin-top: 2rem;
  @media screen and (max-width:768px) {
    font-size:0.75em;
  }
}

.overlay-toggle {
  border:1px solid black;
  border-radius: 0rem 0.75rem 0.75rem 0;
  width: 3rem;
  height: 3rem;
  position: fixed;
  top:1.5rem;
  right:1rem;
  z-index:2;
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

.overlay-toggle:hover .circle {
  @media screen and (max-width:768px) {
    background-color:transparent;
  }
}
.overlay-toggle.is-open .circle {
  @media screen and (max-width:768px) {
    background-color:#000;
  }
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
  z-index:1;
  transform:translateY(-100%);
  transition: transform 250ms ease-in-out;
  pointer-events:none;
  display:flex;
  overflow-y:scroll;
  font-size:1.5em;
  nav.mobile {
    display: none;
    justify-content: space-evenly;
    align-items: center;
    border: 1px solid #000;
    background: #fff;
    height: 3rem;
    position: absolute;
    width: 100%;
    left: 1.5rem;
    max-width: calc(100% - 5.5rem);
    top: 5rem;
    a.nuxt-link-active {
      text-decoration: underline;
    }
  }
  @media screen and (max-width:768px) {
    font-size: 1rem;
    nav.mobile {
      display: flex;
    }
  }
  .signup {
    width: 100%;
    white-space: normal;
    margin-top:1em;
    h3 {
      font-size: 1em;
      margin-bottom:0.5em;
    }
    form {
      margin: 0 auto;
      .mailing-list {
        display:flex;
        grid-gap:0.5em;
      }
      input {
        flex:1;
        background: transparent;
        border: 1px solid #000;
        padding:0.25em;
        &::placeholder {
         color: #000;
        }
      }
      button {
        background: transparent;
        padding: 0.25em 0.5em;
        cursor: pointer;
        border: 1px solid #000;
        &:hover, &:focus {
          color: #fff;
          border: 1px solid #fff;
          mix-blend-mode: difference;
        }
      }
    }
  }
  .grid {
    display: grid;
    width:100%;
    grid-gap: 20vw;
    padding: 1.5em;
    grid-template-columns: 2fr 1fr;
    height: 60vh;
    @media screen and (max-width:768px) {
      grid-template-columns: 1fr;
      margin-top:6rem;
      grid-gap:2em;
      height:auto;
    }
    .left-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      white-space: pre-wrap;
      a {
        color: #fff;
        mix-blend-mode:difference;
      }
    }
    .right-col {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-size: 0.75em;
      .team {
        display:flex;
        flex-direction:column;
        a {
          display:inline-block;
          margin-bottom: 1em;
          &:hover {
            .name {
              color:#fff;
              mix-blend-mode: difference;
            }
          }
        }
      }
      .socials {
        display:flex;
        flex-direction:column;
        .social-channel {
          margin-bottom:0.5em;
          &:last-of-type {
            margin-bottom:0px;
          }
          &:hover, &:focus {
            color: #fff;
            mix-blend-mode: difference;
          }
        }
      }
    }
  }
}
.overlay.open {
  transform:translateY(0);
  pointer-events:auto;
}

nav.secondary {
  position:absolute;
  bottom:1em;
  left:1.5rem;
  font-size:0.75em;
  a {
    margin: 0 1em;
    &:first-of-type {
      margin-left:0px;
    }
  }
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
