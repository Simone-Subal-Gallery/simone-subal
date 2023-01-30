import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import {studioTheme, ThemeProvider} from '@sanity/ui'
import { DragDropContext } from 'react-beautiful-dnd'
import DefaultArrayFunctions from 'part:@sanity/form-builder/input/array/functions-default'
import updateKeys from './updateKeys'
import initialData from './initial-data'
import Column from './column'


export default function BeautifulDnDFunctions(props) {
  const {type, value, onAppendItem} = props;

  const handleDuplicateBtnClick = ({item}) => {
    const newItem = item.hasOwnProperty('_key')
      ? updateKeys(Object.assign({}, item), '_key')
      : item;
    onAppendItem(newItem);
  };

  const items = field => {
    if (Array.isArray(field)) {
      console.log(" You've passed an array in to the duplicate function! These aren't supported yet")
      return []
    }

    // If there is no canDuplicate value, or there are no array items, return empty array
    if (field === undefined || value === undefined) {
      return [];
    }

    return value
      // Filter out references
      .filter(item => item._type !== 'reference')
      // Map remaining items
      .reduce((array, item) => {
        // If canDuplicate passes a value which doesn't correspond to a field, try alternatives:
        if (item[field] === undefined) {
          // Test to see if item can be rendered as is
          if (typeof item === 'string' || typeof item === 'number') {
            array.push({
              title: item,
              item
            })
          }

          // Test for common fields instead
          if (item.name || item.title || item.text || item.header || item.id || item.current || item.description) {
            array.push({
              title: item.name || item.title || item.text || item.header || item.id || item.current || item.description,
              item
            });
          } else {
            // Otherwise push nothing
            console.log(
              'The array duplication function cannot find your field to render children. Please check your schema.'
            );
          }
          return array;
        }

        array.push({
          title: item[field],
          item
        });

        return array;
      }, []);
  };

  const itemArray = items(type?.options?.canDuplicate);
  return (
    <Box>
    <Heading>Array</Heading>
    </Box>
  );
}
