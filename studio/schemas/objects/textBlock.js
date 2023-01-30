export default {
  type: 'object',
  name: 'textBlock',
  title: 'Text',
  fields: [
    {
      name: 'label',
      type: 'string',
      title: 'Label',
    },
    {
      name: 'boxed',
      type: 'boolean',
      title: 'Boxed?',
    },
    {
      name: 'text',
      type: 'blockContent',
      title: 'Text',
    },
  ],
  preview: {
    select: {
      label: 'label',
    },
    prepare({ label }) {
      return {
        title: `${label}`,
        subtitle: 'Text',
      };
    },
  },
}
