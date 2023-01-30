import {Box, Heading, Stack} from '@sanity/ui'
import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import Task from './task'

const Container = styled.div`
  margin: 8px;
  padding: 8px;
  border: 1px solid lightgrey;
  width: 220px;
  display: flex;
  flex-direction: column;
  margin: 4px 2px;
`

const List = styled(Stack)`
  background-color: ${props => (props.isDraggingOver ? 'lightblue' : 'white')};
  min-height:200px;
  flex-grow:1;
`

export default class Column extends React.Component {
  render() {
    return (
      <Container width={3}>
        <Box padding={2}>
        <Heading>{this.props.column.title}</Heading>
        </Box>
        <Droppable droppableId={this.props.column.id}>
          {(provided, snapshot) => (
            <List ref={provided.innerRef} {...provided.droppableProps}
            space={2}
            isDraggingOver={snapshot.isDraggingOver}
            >
              {this.props.tasks.map((task, index) => <Task key={task.id} task={task} index={index} />)}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </Container>
    )
  }
}
