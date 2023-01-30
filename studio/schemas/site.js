export default {
  name: 'site',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: [/*'create',*/ 'update', /*'delete',*/ 'publish'],
  fields: [
    {
      title: 'Site title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Site description (SEO)',
      name: 'seo_description',
      type: 'text',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'array',
      layout: 'grid',
      of: [{
        type: 'reference',
        to: [{type: 'exhibition'}, {type: 'artist'}, {type: 'fair'}]
      }]
    },
    {
      name: 'announcement',
      title: 'Announcement',
      type: 'blockContent',
    },
    {
      name: 'footer',
      title: 'Footer',
      type: 'blockContent',
    },
    {
      name: 'bg_color',
      title: 'Custom BG Color?',
      type: 'colorPicker',
    },
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
}
