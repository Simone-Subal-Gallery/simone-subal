export default {
  name: 'workBlock',
  title: 'Work(s)',
  type: 'object',
  fields: [
    {
      title: 'Label',
      name: 'label',
      type: 'string'
    },
    {
      title: 'Work(s)',
      name: 'works',
      type: 'array',
      of: [{type: 'work'}]
    },
  ],

  preview: {
    select: {
      label: 'label',
      works: 'works'
    },
    prepare({label, works}) {
      return {
        title: label,
        subtitle: 'Works (' + works.length + '): ' + works.map(o => o.title).join(", "),
      }
    },
  },
}
