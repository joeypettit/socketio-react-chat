import React, {useRef} from 'react'
import { Modal, Form, Button } from 'react-bootstrap';
import { useContacts } from './contexts/ContactsProvider';

function NewContactModal({closeModal}) {
    // useRef allows us to grab the values from the form inputs
    // without causing rerenders of every keystroke.
    const idRef = useRef();
    const nameRef = useRef();

    // get createContact function from ContactsProvider
    const { createContact } = useContacts();

    // handle submission of form
    function handleSubmit(e){
        e.preventDefault();

        createContact(idRef.current.value, nameRef.current.value)
        closeModal();
    }

  return (
    <>
        <Modal.Header closeButton>Create Contact</Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Id</Form.Label>
                    <Form.Control type="text" ref={idRef} required/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" ref={nameRef} required/>
                </Form.Group>
                <Button className="mt-3" type="submit">Create Contact</Button>
            </Form>
        </Modal.Body>
    </>
  )
}

export default NewContactModal;