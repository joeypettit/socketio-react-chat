import React, {useState} from 'react'
import { Modal, Form, Button } from 'react-bootstrap';
// import Contacts context from ContactsProvider
import {useContacts} from './contexts/ContactsProvider';
import {useConversations} from './contexts/ConversationsProvider';


function NewConversationModal({closeModal}) {
    // list of contacts from the contacts provider
    const {contacts} = useContacts();
    // list of conversations from conversations provider
    const {createConversation} = useConversations();


    const [selectedContactIds, setSelectedContactIds] = useState([]);

    function handleCheckboxChange(contactId) {
        setSelectedContactIds(prevSelectedContactIds => {
            if(prevSelectedContactIds.includes(contactId)){
                return prevSelectedContactIds.filter(prevId => {
                    return contactId !== prevId;
                })
            } else {
                return [...prevSelectedContactIds, contactId];
            }
        })
    }

    function handleSubmit(e){
        e.preventDefault();
        createConversation(selectedContactIds);
        closeModal();
    }




  return (
    <>
    <Modal.Header closeButton>Create Conversation</Modal.Header>
    <Modal.Body>
        <Form onSubmit={handleSubmit}>
            {contacts.map(contact => (
                <Form.Group controlId={contact.id} key={contact.id}>
                    <Form.Check
                    type ="checkbox"
                    value={selectedContactIds.includes(contact.id)}
                    label={contact.name}
                    onChange={()=> handleCheckboxChange(contact.id)}
                    />
                </Form.Group>

            ))}
         
            <Button className="mt-3" type="submit">Create Conversation</Button>
        </Form>
    </Modal.Body>
</>
  )
}

export default NewConversationModal;
