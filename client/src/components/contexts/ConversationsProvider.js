import React, {useContext, useState} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';

const ConversationsContext = React.createContext();

export function useConversations(){
    return useContext(ConversationsContext)
}




export function ConversationsProvider({children}) {
    const {contacts} = useContacts();

    const [conversations, setConversations] = useLocalStorage('conversations', []);
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);

    function createConversation(recipients) {
        setConversations(prevConversations => {
            return [...prevConversations, { recipients, messages:[] }]
        })
    }

    // loop through conversations and take the recipients (which  is only their ids)
    // and match it with their name using data from the contacts provider.
    // return an array of recipient objects which contains the conversation
    // an array of recipients objects => {id, name}
    const formattedConversations = conversations.map((conversation, index)=>{
        const recipients = conversation.recipients.map((recipient)=>{
            const contact = contacts.find((contact)=>{
                return contact.id === recipient
            })
            const name = (contact && contact.name) || recipient;
            return {id: recipient, name};
        })
        // true if this conversation is selected
        const selected = index === selectedConversationIndex;
        return { ...conversation, recipients, selected};
    })

    const value = {
        conversations: formattedConversations,
        selectConversationIndex: setSelectedConversationIndex,
        createConversation
    }

  return (
    <ConversationsContext.Provider value={value}>
        {children}
    </ConversationsContext.Provider>
  )
}
