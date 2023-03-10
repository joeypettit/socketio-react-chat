// const express = require("express");
// const app = express();

// app.get("/api/hello/", (req, res) => {
//   res.send("hello");
// });

// app.listen(5000, () => console.log("Example app listening on port 5000!"));

const io = require("socket.io")(5000);
// const io = require("socket.io")(5000, {
//   cors: {
//     origin: ["http://localhost:3000"],
//   },
// });

// on connect with client do the following
io.on("connection", (socket) => {
  console.log("connected");
  // grab clients unique id (which persists on their local host)
  const id = socket.handshake.query.id;
  // put client in the room with their unique id
  socket.join(id);

  socket.on("send-message", ({ recipients, text }) => {
    console.log("got sent message", text);
    // recipients does not include the sender so... For each recipient,
    // this function will remove that specific recipient from recipients and
    // add the sender of the message to recipients so that each recipient
    // recieves an array of the OTHER recipients in the conversation, but does not
    // include themselves. So, when they recieve the message, it will contain to proper
    // list of recipients from their perspective.
    recipients.forEach((recipient) => {
      // filter out the recipient this is going to
      const newRecipients = recipients.filter((r) => {
        return recipient !== r;
      });
      // add in the sender to the recipients array
      newRecipients.push(id);
      // broadcast to the room of that specific recipient the
      // list of recipients, the sender, and the text.
      socket.broadcast.to(recipient).emit("recieve-message", {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});
