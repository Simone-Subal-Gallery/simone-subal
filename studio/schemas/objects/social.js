export default {
  name: 'social',
  title: 'Social channel',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
    }
  ],
  preview: {
    select: {
      title: 'title'
    }
  }
}
