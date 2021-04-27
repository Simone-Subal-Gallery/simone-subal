import { groq } from '@nuxtjs/sanity'

const query = groq`{
  "site": *[_type == "site"][0] {
    ...,
 		featured[]->{
      ...,
      'artists': artists[]{
        _type == 'artist_additional' => {
          ...
        },
        _type == 'reference' => {
          'title': ^->title,
          'slug': ^->slug,
          'sortName': ^->sortName,
          '_id': ^->_id
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
  console.log('site', site)
}
