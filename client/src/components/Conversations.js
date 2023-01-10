import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useConversations } from './contexts/ConversationsProvider';

 function Conversations() {

  const conversations = useConversations();  


  return (
    <ListGroup variant="flush">
    {conversations.map((conversation, index) => (
      <ListGroup.Item key={index}>
        {conversation.recipient.map((recipient)=>{
          return recipient.name.join(', ');
        })}
      </ListGroup.Item>
      ))}
  </ListGroup>
  )
}

export default Conversations;
