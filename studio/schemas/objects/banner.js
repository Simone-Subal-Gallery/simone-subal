import ConditionalField from '../../plugins/conditionalField.js'

export default {
  name: 'banner',
  title: 'Banner',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'type',
      title: 'Type',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
          {title: 'Text', value: 'text'}
        ]
      },
      validation: Rule => Rule.length(1)
    },
    {
      name: 'image',
      title: 'Image',
      type: 'figure',
      inputComponent: ConditionalField,
      options: {
        condition: (document, parent) => parent.type == "image"
      }
    },
    {
      title: "Video file",
      name: "video",
      type: "mux.video",
      inputComponent: ConditionalField,
      options: {
        condition: (document, parent) => parent.type == "video"
      }
    },
    {
      title: "Video caption",
      name: "video_caption",
      type: "array",
      of: [{ type: 'block' }],
      inputComponent: ConditionalField,
      options: {
        condition: (document, parent) => parent.type == "video"
      }
    },
    {
      name: 'text',
      type: 'array',
      title: 'Banner text',
      inputComponent: ConditionalField,
      of: [{ type: 'block' }],
      options: {
        condition: (document, parent) => parent.type == "text"
      }
    },
  ],

  preview: {
    select: {
      label: 'label',
      type: 'type'
    },
    prepare({label, type}) {
      return {
        title: label,
        subtitle: 'Banner ' + type,
      }
    },
  },
}
