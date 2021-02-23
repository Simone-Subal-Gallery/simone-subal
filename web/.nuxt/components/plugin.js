import Vue from 'vue'

const components = {
  SanityContent: () => import('../../node_modules/@nuxtjs/sanity/dist/components/sanity-content.js' /* webpackChunkName: "components/sanity-content" */).then(c => c.default || c),
  SanityImage: () => import('../../node_modules/@nuxtjs/sanity/dist/components/sanity-image.js' /* webpackChunkName: "components/sanity-image" */).then(c => c.default || c),
  Logo: () => import('../../components/Logo.vue' /* webpackChunkName: "components/logo" */).then(c => c.default || c)
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
