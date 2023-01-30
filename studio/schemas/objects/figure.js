export default {
  title: 'Figure',
  name: 'figure',
  type: 'image',
  options: {
    hotspot: true
  },
  fields: [
    // {
    //   name:'work',
    //   type:'boolean',
    //   title:'Work? (if imported from WP)',
    //   options: {
    //     isHighlighted: true
    //   }
    // },
    {
      name: 'caption',
      type: 'array',
      title: 'Caption',
      of: [{ type: 'block' }],
      options: {
        isHighlighted: true
      }
    },
    {
      name: 'altText',
      type: 'string',
      title: 'Alt text (overrides asset alt text)',
    }
  ],
  preview: {
    select: {
      caption: 'caption',
      asset: 'asset'
    },
    prepare(value) {
      const block = (value.caption || []).find(block => block._type === 'block')
      return {
        title: block
          ? block.children
            .filter(child => child._type === 'span')
            .map(span => span.text)
            .join('')
          : 'Missing caption',
        media: value.asset
      }
    }
  }
}
