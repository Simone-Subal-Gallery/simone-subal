import { MdPerson } from 'react-icons/md'

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
  name: 'artist',
  title: 'Artist',
  type: 'document',
  icon: MdPerson,
  fields: [
    {
      name: 'title',
      title: 'Artist name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'sortName',
      title: 'Sort name',
      type: 'string',
      validation: Rule => Rule.required()
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
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'cover',
      title: 'Cover Image (featured banner section)',
      type: 'image',
      options: {
        hotspot: true
      },
    },
    {
      title: 'Gallery',
      name: 'gallery',
      type: 'array',
      of: [{ type: 'figure' }],
      editModal: 'popover'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    },
    {
      title: 'Selected Exhibitions',
      name: 'selected_exhibitions',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'exhibition'},
            {type: 'fair'}
          ],
        },
        { type: 'exhibition_offsite' }
      ]
    },
    {
      name: 'press',
      title: 'Press',
      type: 'array',
      of: [{ type: 'press' }]
    },
    {
      name: 'log',
      title: 'Additional events (log)',
      type: 'array',
      of: [{ type: 'logItem' }]
    },
  ],
  orderings: [
    {
      title: 'Name',
      name: 'name',
      by: [
        {field: 'sortName', direction: 'asc'}
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail'
    }
  },
}
