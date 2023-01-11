import React, { useState } from "react";
import { Tab, Nav, Button, Modal } from "react-bootstrap";
import Conversations from "./Conversations";
import Contacts from "./Contacts";
import NewContactModal from "./NewContactModal";
import NewConversationModal from "./NewConversationModal";

// using keys to avoid hardcoding these in nav eventkey
// so we can use these variables in other functionality
const CONVERSATIONS_KEY = "conversations";
const CONTACTS_KEY = "contacts";

function Sidebar({ id }) {
  // state which tracks which nav eventKey is active
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY);

  // state to manage wether modal is open or closed
  const [modalOpen, setModalOpen] = useState(false);

  // this variable will be true if the conversations tab is active
  // (else: the contacts tab is active and this will be false)
  // this is used to conditionally render Button contents and
  // selecting correct contents for the modal
  const conversationsOpen = activeKey === CONVERSATIONS_KEY;

  // this function simply sets setModalOpen to false
  // thereby closing the modal
  function closeModal() {
    setModalOpen(false);
  }

  console.log("render", activeKey);

  return (
    <div style={{ width: "250px" }} className="d-flex flex-column">
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Nav variant="tabs" className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey={CONVERSATIONS_KEY}>Conversations</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="border-end overflow-auto flex-grow-1">
          <Tab.Pane eventKey={CONVERSATIONS_KEY}>
            <Conversations />
          </Tab.Pane>
          <Tab.Pane eventKey={CONTACTS_KEY}>
            <Contacts />
          </Tab.Pane>
        </Tab.Content>
        <div className="p-2 border-top border-end small">
          Your Id: <span className="text-muted">{id}</span>
        </div>
        <Button onClick={() => setModalOpen(true)} className="rounded-0">
          New {conversationsOpen ? "Conversation" : "Contact"}
        </Button>
      </Tab.Container>

      <Modal show={modalOpen} onHide={closeModal}>
        {conversationsOpen ? (
          <NewConversationModal closeModal={closeModal} />
        ) : (
          <NewContactModal closeModal={closeModal} />
        )}
      </Modal>
    </div>
  );
}
export default Sidebar;
