import { MdFeaturedPlayList } from 'react-icons/md'

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
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: MdFeaturedPlayList,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc, options) => slugify(doc.title),
        maxLength: 256,
      },
    },
    {
      name: 'date',
      title: 'Date published',
      type: 'date',
    },
    {
      name: 'content',
      title: 'Post content',
      type: 'blockContent',
    }
  ],

  preview: {
    select: {
      title: 'title',
      media: 'thumbnail'
    }
  },
}
