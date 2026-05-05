const express = require("express"); const http = require("http"); const { Server } = require("socket.io"); const cors = require("cors");

const app = express(); app.use(cors());

const server = http.createServer(app); const io = new Server(server, { cors: { origin: "*", }, });

let users = {};

io.on("connection", (socket) => { console.log("User connected:", socket.id);

socket.on("join", (username) => { users[socket.id] = username; console.log(username + " joined");

io.emit("message", {
  user: "System",
  text: username + " joined the chat",
});

});

socket.on("sendMessage", (msg) => { io.emit("message", { user: users[socket.id], text: msg, }); });

socket.on("disconnect", () => { const username = users[socket.id]; delete users[socket.id];

if (username) {
  io.emit("message", {
    user: "System",
    text: username + " left the chat",
  });
}

console.log("User disconnected:", socket.id);

}); });

server.listen(3000, () => { console.log("Server running on http://localhost:3000"); });