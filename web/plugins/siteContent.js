import { groq } from '@nuxtjs/sanity'

const query = groq`{
  "site": *[_type == "site"][0] {
    ...,
 		featured[]->{
      ...,
      artists[]{
        _type == 'artist' => {
          title,
          slug,
          sortName
        },
        _type == 'artist_additional' => {
          ...
        }
      }
    }
  }
}
`
/**
 * We do this to achieve server side rendering for
 * content displayed by layouts components
 * ( layouts does not have an asyncData() method )
 */
export default ({ store, $sanity }) => {
  return $sanity.fetch(query).then(({ site }) => {
    store.commit("site", site)
  })
}
