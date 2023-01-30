import React from 'react'

export default {
  name: 'press',
  title: 'Press',
  type: 'object',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Publication',
      name: 'publication',
      type: 'string'
    },
    {
      title: 'Date of Publication',
      name: 'date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: "date_time",
      title: "Date Created (log date/time)",
      type: "datetime",
      validation: Rule => Rule.required(),
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
      title: 'URL?',
      name: 'url',
      type: 'url'
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
      subtitle: 'date'
    }
  },
  preview: {
    select: {
      title: 'title',
      publication: 'publication',
      date: 'date',
      url: 'url',
      pdf: 'pdf'
    },
    prepare(selection) {
      const {title, publication, date, url, pdf} = selection
      let subtitles = [date, publication].filter(Boolean)
      const subtitleString = subtitles.join(' - ')
      const titleString = title
      return {
        title: titleString,
        subtitle: subtitleString,
        media: <span style={{fontSize: '1.5rem'}}>{pdf ? '📃' : url ? '🔗' : '🚫'}</span>
      }
    }
  },
}
