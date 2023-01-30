import React from 'react'

export default {
  name: 'logItem',
  title: 'Log item',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'date',
      title: 'Date of item',
      type: 'date',
    },
    {
      name: "date_time",
      title: "Date Created (log date/time)",
      type: "datetime",
      validation: Rule => Rule.required(),
    },
    {
      name: 'category',
      title: 'Log type',
      type: 'string',
      validation: Rule => Rule.required(),
      options: {
        list: [
          {title: 'Acquisitions', value: 'acquisitions'},
          {title: 'Awards/Honors', value: 'awards'},
          {title: 'Publications', value: 'publications'},
          {title: 'Events', value: 'events'},
          {title: 'Gallery shows', value: 'gallery_shows'},
          {title: 'Museum shows', value: 'museum_shows'},
          {title: 'Fundraisers', value: 'fundraisers'},
          {title: 'Residency', value: 'residency'}
        ], // <-- predefined values
        layout: 'radio' // <-- defaults to 'dropdown'
      }
    },
    {
      name: 'references',
      title: 'Related item(s)?',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'artist'}, {type: 'exhibition'}, {type: 'fair'}, {type: 'post'}, {type: 'page'}]
        }
      ]
    },
    {
      name: 'external_link',
      title: 'External link?',
      type: 'url',
    },
    {
      title: 'PDF?',
      name: 'pdf',
      type: 'file'
    }
  ],

  preview: {
    select: {
      title: 'title',
      date: 'date',
      category: 'category'
    },
    prepare(selection) {
      const {title, date, category} = selection

      const logIcon = () => (
        <img src={`/static/log/${category}.svg`} style={{width: '1.5rem', height: '1.5rem'}}/>
      )

      let subtitles = [date, category]
      const subtitleString = subtitles.join(' - ')
      const titleString = title
      return {
        title: titleString,
        subtitle: subtitleString,
        media: logIcon
      }
    }
  },
}
