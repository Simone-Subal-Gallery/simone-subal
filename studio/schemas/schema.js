import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

import site from './site'
import artist from './artist'
import exhibition from './exhibition'
import fair from './fair'
import work from './work'
import viewing_room from './viewing_room'
import event from './event'
import post from './post'
import page from './page'
import contact from './contact'

import blockContent from './blockContent'

import workBlock from './objects/workBlock'
import banner from './objects/banner'
import cta from './objects/cta'
import textBlock from './objects/textBlock'
import codeBlock from './objects/codeBlock'
import figure from './objects/figure'
import youtube from './objects/youtube'
import press from './objects/press'
import galleryBlock from './objects/galleryBlock'
import staff from './objects/staff'
import artist_additional from './objects/artist_additional'
import exhibition_offsite from './objects/exhibition_offsite'
import logItem from './objects/logItem'
import social from './objects/social'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    site,
    artist,
    exhibition,
    fair,
    work,
    viewing_room,
    event,
    post,
    page,
    contact,
    blockContent,
    workBlock,
    codeBlock,
    banner,
    cta,
    textBlock,
    figure,
    youtube,
    press,
    galleryBlock,
    staff,
    artist_additional,
    exhibition_offsite,
    logItem,
    social
  ]),
})
