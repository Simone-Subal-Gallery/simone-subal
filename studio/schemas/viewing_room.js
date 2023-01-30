import ConditionalField from '../plugins/conditionalField.js'
import { BiHappyHeartEyes } from 'react-icons/bi'

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
  name: 'viewing_room',
  title: 'Viewing Room',
  type: 'document',
  icon: BiHappyHeartEyes,
  initialValue: () => ({
    open_date: new Date().toISOString()
  }),
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
      name: 'references',
      title: 'Refers to?',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'exhibition'}, {type: 'fair'}]
      }]
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc, options) => slugify(doc.title),
        maxLength: 256,
      }
    },
    {
      name: 'privacy',
      title: 'Privacy?',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Password-protected', value: 'password'},
          {title: 'Email login', value: 'email'}
        ]
      },
      validation: Rule => Rule.length(1)
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
      inputComponent: ConditionalField,
      options: {
        condition: (document, parent) => parent.privacy == "password"
      }
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
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true
      },
    },
    {
      title: 'Gallery',
      name: 'gallery',
      type: 'array',
      of: [{type: 'image'}, {type: 'work'}]
    },
    {
      name: 'description',
      title: 'Description',
      type: 'blockContent',
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
