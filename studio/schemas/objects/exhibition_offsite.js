export default {
  name: 'exhibition_offsite',
  title: 'Exhibition (elsewhere)',
  type: 'object',
  fields: [
    {
      title: 'Name',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Place',
      name: 'place',
      type: 'string'
    },
    {
      name: 'open_date',
      title: 'Open date',
      type: 'date',
    },
    {
      name: 'close_date',
      title: 'Close date',
      type: 'date',
    },
    {
      title: 'Link?',
      name: 'link',
      type: 'url'
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true
      },
    },
  ],

  preview: {
    select: {
      title: 'title',
      place: 'place',
      open: 'open_date',
      close: 'close_date',
      media: 'thumbnail'
    },
    prepare(selection) {
      const {title, place, open, close, media} = selection
      const titleString = title + ' - ' + place
      const dateString = open + ' to ' + close
      return {
        title: titleString,
        subtitle: dateString,
        media: media
      }
    }
  },
}
