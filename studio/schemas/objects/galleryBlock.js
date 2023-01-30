// import beautifulDnD from '../../plugins/beautifulDnD'
export default {
  name: 'galleryBlock',
  title: 'Gallery',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
    },
    {
      name: 'numbered',
      title: 'Numbered works?',
      type: 'boolean',
    },
    {
      name: 'display',
      title: 'Display',
      type: 'string',
      options: {
        list: [
          {title: '2 Columns (sticky)', value: 'sticky_col'},
          {title: 'Artist/Install toggle', value: 'toggle_col'},
          {title: 'Single column', value: 'single_col'},
        ], // <-- predefined values
        layout: 'radio' // <-- defaults to 'dropdown'
      }
    },
    {
      name: 'work',
      title: 'Work',
      type: 'array',
      of: [{type: 'figure'}],
      // inputComponent: beautifulDnD
    },
    {
      name: 'install',
      title: 'Installation',
      type: 'array',
      of: [{type: 'figure'}],
      // inputComponent: beautifulDnD
    },
  ],

  preview: {
    select: {
      label: 'label',
      work: 'work',
      install: 'install'
    },
    prepare(selection) {
      const {label, work, install} = selection
      let workCount = 0
      let installCount = 0
      if (work!=undefined) { workCount = work.length }
      if (install!=undefined) { installCount = install.length }
      return {
        title: label,
        subtitle: 'Gallery: ' + workCount + ' work(s), ' + installCount + ' install',
      }
    },
  },
}
