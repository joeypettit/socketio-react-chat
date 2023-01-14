import React, { useContext, useState, useEffect } from "react";
import io from "socket.io-client";

// create socket context
const SocketContext = React.createContext();

// this will be imported for functions to use the context
export function useSocket() {
  return useContext(SocketContext);
}

// this is the information we will pass to the provider
export function SocketProvider({ children, id }) {
  const [socket, setSocket] = useState();

  // useEffect runs on initial render AND if id changes
  // this will open a new socket
  useEffect(() => {
    // create new socket to server, attach id to socket
    const newSocket = io(window.location.origin, { query: { id } });
    // store socket to local state
    setSocket(newSocket);
    // this return will close the socket if user navigates away from app
    return () => newSocket.close();
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
