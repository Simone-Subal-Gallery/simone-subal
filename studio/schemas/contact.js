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
  name: 'contact',
  title: 'Contact/Info',
  type: 'document',
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
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
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    },
    {
      name: 'secondary_nav',
      title: 'Secondary Navigation (pages)',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'page'}]
      }]
    },
    {
      name: 'socials',
      title: 'Socials',
      type: 'array',
      of: [{
        type: 'social'
      }]
    },
    {
      name: 'staff',
      title: 'Staff',
      type: 'array',
      of: [{
        type: 'staff'
      }]
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
      name: 'bg_color',
      title: 'Custom BG Color?',
      type: 'colorPicker',
    },
  ],

  preview: {
    select: {
      title: 'title'
    }
  },
}
