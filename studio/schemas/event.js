import { MdFormatListBulleted } from 'react-icons/md'
import React from 'react'

export default {
  name: 'event',
  title: 'Log event',
  type: 'document',
  icon: MdFormatListBulleted,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
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
      title: 'Event type',
      type: 'string',
      options: {
        list: [
          {title: 'Acquisitions', value: 'acquisitions'},
          {title: 'Awards/Honors', value: 'awards'},
          {title: 'Artists', value: 'artists'},
          {title: 'Exhibitions', value: 'exhibitions'},
          {title: 'Fairs', value: 'fairs'},
          {title: 'Press', value: 'press'},
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
      title: 'Publication',
      name: 'publication',
      type: 'string'
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
      date: 'date',
      category: 'category',
      ref0: 'references.0.title',
      ref1: 'references.1.title',
      ref2: 'references.2.title',
      ref3: 'references.3.title',
      ref4: 'references.4.title',
      ref5: 'references.5.title',
      ref6: 'references.6.title',
      ref7: 'references.7.title',
      ref8: 'references.8.title'
    },
    prepare(selection) {
      const {title, date, category, ref0, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8} = selection

      let refs = [ref0, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8].filter(Boolean)
      const refsString = refs.join(', ')

      const logIcon = () => (
        <img src={`/static/log/${category}.svg`} style={{width: '1.5rem', height: '1.5rem'}}/>
      )

      let subtitles = [date, category, refsString]
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
