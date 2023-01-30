export default {
  name: 'work',
  title: 'Work',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'artist',
      title: 'Artist',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'artist'}]
      }, {type: 'artist_additional'}]
    },
    {
      name: 'exhibition',
      title: 'Exhibition',
      type: 'reference',
      to: [{type: 'exhibition'}]
    },
    {
      name: 'year',
      title: 'Year',
      type: 'date',
      options: {
        dateFormat: 'yyyy'
      },
    },
    {
      name: 'edition',
      title: 'Edition',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'available',
      title: 'Available?',
      type: 'boolean',
    },
    {
      title: 'Images',
      name: 'images',
      type: 'array',
      of: [{type: 'figure'}]
    },
    {
      name: 'dimensions',
      title: 'Dimensions',
      type: 'string',
    },
    {
      name: 'medium',
      title: 'Medium',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'more_info',
      title: 'More info',
      type: 'text',
    }
  ],

  preview: {
    select: {
      title: 'title',
      media: 'thumbnail'
    }
  },
}
