export { default as SanityContent } from '../../node_modules/@nuxtjs/sanity/dist/components/sanity-content.js'
export { default as SanityImage } from '../../node_modules/@nuxtjs/sanity/dist/components/sanity-image.js'
export { default as Logo } from '../../components/Logo.vue'

export const LazySanityContent = import('../../node_modules/@nuxtjs/sanity/dist/components/sanity-content.js' /* webpackChunkName: "components/sanity-content" */).then(c => c.default || c)
export const LazySanityImage = import('../../node_modules/@nuxtjs/sanity/dist/components/sanity-image.js' /* webpackChunkName: "components/sanity-image" */).then(c => c.default || c)
export const LazyLogo = import('../../components/Logo.vue' /* webpackChunkName: "components/logo" */).then(c => c.default || c)
