import ConditionalField from '../plugins/conditionalField.js'
import { MdStore } from 'react-icons/md'

function slugify(string, date) {
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
    + '-' + date.slice(0,4)
}

export default {
  name: 'fair',
  title: 'Fair',
  type: 'document',
  icon: MdStore,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc, options) => slugify(doc.title, doc.open_date),
        maxLength: 256,
      },
    },
    {
      title: 'Link to fair',
      name: 'link',
      type: 'url'
    },
    {
      title: 'Does this fair have more content?',
      name: 'more_content',
      type: 'boolean'
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
      inputComponent: ConditionalField,
      options: {
        condition: (document, parent) => parent.more_content == true
      }
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
  orderings: [
    {
      title: 'Date, New',
      name: 'openDateDesc',
      by: [
        {field: 'open_date', direction: 'desc'}
      ]
    },
    {
      title: 'Date, Old',
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
      subtitle: 'open_date',
      media: 'thumbnail'
    }
  },
}
