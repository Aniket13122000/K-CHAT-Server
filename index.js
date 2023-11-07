const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { getDb, connectToDb } = require("./db");

app.use(cors());
let db;

connectToDb((err) => {
  if (!err) {
    db = getDb();
  }
});

//getting the old messages
app.get("/getoldmessages", async(req, res) => {
    
    const group = req.query.group; 

    var oldMessages
   await db.collection('Messages')
    .findOne({ Value: group })
    .then((doc) => {
  oldMessages=doc
    })
    res.json(oldMessages);
  });
  
app.use(cors());

const server = http.createServer(app);


// used Socket.io for real time chat
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    
  

    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    db.collection('Messages').updateOne(
        { Value: data.room },
        { $push: { Message: data} }
      );
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
