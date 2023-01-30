export default {
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'text',
      title: 'Text',
      type: 'text',
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
    },
    {
      title: 'Open in new tab?',
      name: 'blank',
      type: 'boolean'
    }
  ],

  preview: {
    select: {
      label: 'label'
    },
    prepare({label}) {
      return {
        title: label,
        subtitle: 'Call to action',
      }
    },
  },
}
