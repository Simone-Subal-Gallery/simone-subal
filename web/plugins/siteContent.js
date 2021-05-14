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
    },
  },
  "contact": *[_id == "singleton-contact"][0] {
    ...,
    secondary_nav[]->
  },
  "events": *[_type == "event"]{
    ...,
    exhibition->,
    artist->,
    fair->,
    work->
  },
  "artistLog": *[_type=="artist"]{
 	  _id,
    slug,
 		press[]{
      ...,
      'pdf': pdf.asset->url
    },
    log[]{
      ...
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
  return $sanity.fetch(query).then(({ site, contact, events, artistLog }) => {

    artistLog.forEach((item, index, array) => {
      if (item.press!=undefined) {
        item.press.forEach((o) => {
          o.artist = {}
          o.artist._ref = item._id
          o.artist.slug = item.slug.current
          o.artist._type = 'reference'
          o.category = 'press'
        })
      }
      if (item.log!=undefined) {
        item.log.forEach((o) => {
          o.artist = {}
          o.artist._ref = item._id
          o.artist.slug = item.slug.current
          o.artist._type = 'reference'
        })
      }
      if (item.press!=undefined && item.log!=undefined) {
        item.log = item.press.concat(item.log)
      } else if (item.press!=undefined && item.log==undefined) {
        item.log = item.press
      }
      array[index] = array[index].log
    })

    let log = artistLog.flat()
    log = events.concat(log).filter(Boolean)

    log.sort((a,b) => {
      let aDate = a.date!=undefined?a.date:a.date_time!=undefined?a.date_time:a._createdAt!=undefined?a._createdAt:'0'
      let bDate = b.date!=undefined?b.date:b.date_time!=undefined?b.date_time:b._createdAt!=undefined?b._createdAt:'0'
      return new Date(bDate) - new Date(aDate)
    })

    store.commit("site", site)
    store.commit("contact", contact)
    store.commit("log", log)
  })
}
