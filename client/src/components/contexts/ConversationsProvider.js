import React, {useContext, useState} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';

const ConversationsContext = React.createContext();

export function useConversations(){
    return useContext(ConversationsContext)
}

export function ConversationsProvider({id, children}) {
    const {contacts} = useContacts();

    // this is all of our conversations stored in local state. It stores an array of
    // conversations objects which includes and array of recipients, and an array of message objects
    // each message objects contains the id of the sender and the text of the message
    const [conversations, setConversations] = useLocalStorage('conversations', []);

    // this state stores the index of the currently selected conversation
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0);

    // this function creates a new conversation. It takes an array of recipients as an argument.
    // It then addes the new conversation to the conversations array in local state
    function createConversation(recipients) {
        setConversations(prevConversations => {
            return [...prevConversations, { recipients, messages:[] }]
        })
    }

    // this function addes a new message to a conversation. it takes an object with
    // an array of recipient ids, a string of text, and a sender id (string) as a argument
    // it is designed to be able to add messages to the conversations array in local storage
    // whether the message was sent by the user or recieved from another user. it will also
    // create a new conversation if there is not currently one between the message's recipients.
    function addMessageToConversation({recipients, text, sender}){
        // set conversations array in local state with new conversation
        setConversations( prevConversations => {
            // madeChange becomes true if the recipients array from the local state conversation
            // and from new message contain the same recipients
            let madeChange = false;
            const newMessage = {sender, text}

            // find conversation we are making a change to by matching recipient arrays of
            // local state conversation with recipient array of new message
            // store all conversations in newConversations, now updated with new message
            const newConversations = prevConversations.map((conversation)=>{
                if(arrayEquality(conversation.recipients, recipients)){
                    madeChange = true;
                    // if recipients match, return the conversation object from local state,
                    // with the new message appended to the messages array
                    return { 
                        ...conversation, 
                        messages: [...conversation.messages, newMessage] }
                } else{
                    // if recipients don't match, return the conversation
                    return conversation;
                }
            })

            if(madeChange){
            // if a change was made to an exisiting conversation, return newConversations create above

                return newConversations;
            } else {
            // if the added message does not yet have an existing conversation (the first message was
            // sent by someone else), then create a new conversation object with the new message and
            // the recipients array
                return [ 
                    ...prevConversations, 
                    { recipients, messages:[newMessage]}
                ]
            }
        })
    }

    // this function is called when user sends new message, it calles add message to conversation
    // and passes in the array of recipients ids, the text content of the message, and the id of the
    // user 
    function sendMessage(recipients, text){
        addMessageToConversation({recipients, text, sender: id})
    }

    // loop through conversations and take the recipients (which  is only their ids)
    // and match it with their name using data from the contacts provider.
    // return an array of recipient objects which contains the conversation and
    // an array of recipients objects => {id, name}
    const formattedConversations = conversations.map((conversation, index)=>{
        // return new array of recipients that includes their id AND their name 
        // (recipient is currently just their id). Search contacts (from contactProvider),
        // find each recipient, and add their name to a returned object. 
        const recipients = conversation.recipients.map((recipient)=>{
            const contact = contacts.find((contact)=>{
                return contact.id === recipient
            })
            //If the recipient is
            // not in list of contacts, then simply return their id
            const name = (contact && contact.name) || recipient;
            return {id: recipient, name};
        })

        // check each message in this conversation to see if it matches 
        const messages = conversation.messages.map((message)=>{
            // find the contact who sent the message, store in contact
            const contact = contacts.find((contact)=>{
                return contact.id === message.sender
            })
            //If the sender is
            // not in list of contacts, then simply return their id
            const name = (contact && contact.name) || message.sender;
            // check to see if the message was sent from me
            const fromMe = id === message.sender;
            return { ...message, senderName: name, fromMe};
        })

        // true if this conversation is selected
        const selected = index === selectedConversationIndex;
        // return object with the oridignal conversation object,
        // formatted messages with included sender name and the fromMe boolean,
        // formatted recipients which includes recipient id and name,
        // and the selected boolean which is true if conversation is currently selected
        return { ...conversation, messages, recipients, selected}; 
    })



    // this is the object that will be passed to the provider
    const value = {
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex],
        sendMessage,
        selectConversationIndex: setSelectedConversationIndex,
        createConversation
    }

  return (
    <ConversationsContext.Provider value={value}>
        {children}
    </ConversationsContext.Provider>
  )
}

function arrayEquality(a, b){
    if(a.length !== b.length) return false;

    a.sort();
    b.sort();

    return a.every((element, index) => {
        return element === b[index];
    })

}