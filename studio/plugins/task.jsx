import React from 'react'
import {Card, Text} from '@sanity/ui'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
`

export default class Task extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Card
            border={ '1px solid lightgrey' }
            padding={4}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            shadow={snapshot.isDragging?2:0}
          >
            <Text>{this.props.task.content}</Text>
          </Card>
        )}
      </Draggable>
    )
  }
}
