export default {
  type: 'object',
  name: 'codeBlock',
  title: 'Code',
  fields: [
    {
      name: 'label',
      type: 'string',
      title: 'Label',
    },
    {
      name: 'code',
      type: 'code',
      title: 'Code',
    },
  ],
  preview: {
    select: {
      label: 'label',
    },
    prepare({ label }) {
      return {
        title: `${label}`,
        subtitle: 'Code',
      };
    },
  },
}
