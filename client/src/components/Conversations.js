import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useConversations } from './contexts/ConversationsProvider';

 function Conversations() {

  const {conversations, selectConversationIndex} = useConversations();  


  return (
    <ListGroup variant="flush">
    {conversations.map((conversation, index) => (
      <ListGroup.Item 
      key={index}
      action
      onClick={()=> selectConversationIndex(index)}
      active={conversation.selected} 
      >
        {conversation.recipients.map((recipient)=>{
          console.log('recipient', recipient);
          return recipient.name
        }).join(', ')}
      </ListGroup.Item>
      ))}
  </ListGroup>
  )
}

export default Conversations;
