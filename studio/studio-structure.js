import S from "@sanity/desk-tool/structure-builder"

import { RiFolderSettingsLine } from 'react-icons/ri'
import { MdSettings } from 'react-icons/md'
import { MdInfo } from 'react-icons/md'

const hiddenDocTypes = listItem => ![
    "site",
    "contact",
    "media.tag"
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title('Settings')
        .icon(RiFolderSettingsLine)
        .child(
          S.list()
            // Sets a title for our new list
            .title('Settings')
            // Add items to the array
            // Each will pull one of our new singletons
            .items([
              S.listItem()
                  .title("Site")
                  .icon(MdSettings)
                  .child(
                      S.editor()
                          .id('site')
                          .schemaType("site")
                          .documentId("singleton-info")
                  ),
              S.listItem()
                  .title("Contact/Info")
                  .icon(MdInfo)
                  .child(
                      S.editor()
                          .schemaType("contact")
                          .documentId("singleton-contact")
                  )
            ])
        ),
        ...S.documentTypeListItems()
            .filter(hiddenDocTypes)
    ])
