import { MdWbIridescent } from 'react-icons/md'

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export default {
  name: 'exhibition',
  title: 'Exhibition',
  type: 'document',
  icon: MdWbIridescent,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'artists',
      title: 'Artist(s)',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'artist'}]
      }, {type: 'artist_additional'}]
    },
    {
      name: 'hide_title',
      title: 'Title = artist name(s) only?',
      type: 'boolean',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc, options) => slugify(doc.title),
        maxLength: 256,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'open_date',
      title: 'Open date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'close_date',
      title: 'Close date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'opening',
      title: 'Opening info',
      type: 'string',
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'figure',
      options: {
        hotspot: true
      },
    },
    {
      name: 'cover',
      title: 'Cover Image (featured section on home)',
      type: 'image',
      options: {
        hotspot: true
      },
    },
    {
      name: 'content',
      type: 'array',
      title: 'Blocks',
      of: [
        { type: 'banner' },
        { type: 'textBlock' },
        { type: 'galleryBlock' },
        { type: 'workBlock' },
        { type: 'cta' },
        { type: 'codeBlock' }
      ],
    },
    {
      name: 'description',
      title: 'Description (SEO)',
      type: 'text',
    },
    {
      name: 'bg_color',
      title: 'Custom BG Color?',
      type: 'colorPicker',
    },
  ],
  orderings: [
    {
      title: 'Open Date, New',
      name: 'openDateDesc',
      by: [
        {field: 'open_date', direction: 'desc'}
      ]
    },
    {
      title: 'Open Date, Old',
      name: 'openDateAsc',
      by: [
        {field: 'open_date', direction: 'asc'}
      ]
    },
    {
      title: 'Title',
      name: 'title',
      by: [
        {field: 'title', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      artist0: 'artists.0.title',
      artist1: 'artists.1.title',
      artist2: 'artists.2.title',
      artist3: 'artists.3.title',
      artist4: 'artists.4.title',
      artist5: 'artists.5.title',
      artist6: 'artists_additional.0',
      artist7: 'artists_additional.1',
      artist8: 'artists_additional.2',
      artist9: 'artists_additional.3',
      artist10: 'artists_additional.4',
      artist11: 'artists_additional.5',
      open: 'open_date',
      close: 'close_date',
      media: 'thumbnail'
    },
    prepare(selection) {
      const {title, artist0, artist1, artist2, artist3, artist4, artist5, artist6, artist7, artist8, artist9, artist10, artist11, open, close, media} = selection
      let artists = [artist0, artist1, artist2, artist3, artist4, artist5, artist6, artist7, artist8, artist9, artist10, artist11].filter(Boolean)
      const artistsString = artists.join(', ')
      const titleString = title + ' - ' + artistsString
      const dateString = open + ' to ' + close
      return {
        title: titleString,
        subtitle: dateString,
        media: media
      }
    }
  },
}
