const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, "/public")));

function initializeSocket(socket) {
  socket.on("sender-join", (data) => {
    socket.join(data.uid);
  });

  socket.on("receiver-join", (data) => {
    socket.join(data.uid);
    socket.in(data.sender_uid).emit("init", data.uid);
  });

  socket.on("file-meta", (data) => {
    socket.in(data.uid).emit("fs-meta", data.metadata);
  });

  socket.on("fs-start", (data) => {
    socket.in(data.uid).emit("fs-share", {});
  });

  socket.on("file-raw", (data) => {
    socket.in(data.uid).emit("fs-share", data.buffer);
  });
}

io.on("connection", (socket) => {
  initializeSocket(socket);
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
