import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import harperSaveMessage from "./Services/harper-save-message";
import harperGetMessage from "./Services/harper-get-message";
import leaveRoom from "./utils/leave-room";
const app = express();
dotenv.config();

//security middelware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
//
app.use(cors());
app.use(express.json());
app.use(morgan("common"));

let CHAT_BOT = "ChatBot";
let chatRoom = "";
const allUsers = [];
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    const { message, userName, room, _createTime_ } = data;
    io.in(room).emit("receive_message", data);
    harperSaveMessage(message, userName, room, _createTime_)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  });

  socket.on("Join_Room", (data) => {
    console.log("Data", data);
    harperGetMessage(room)
      .then((last100Message) => {
        socket.emit(`last_100_message`, last100Message);
      })
      .catch((err) => console.log(err));

    const { userName, room } = data;
    socket.join(room);

    chatRoom = room;
    allUsers.push({ id: socket.id, userName, room });
    let chatRoomUsers = allUsers.filter((user) => user.room == room);
    socket.to(room).emit("chatroom_user", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);

    let _createTime_ = Date.now();
    socket.to(room).emit("received_message", {
      message: `${userName} has Joined the Chat Room`,
      userName: CHAT_BOT,
      _createTime_,
    });
    socket.emit("receive_message", {
      message: `Welcome ${userName}`,
      userName: CHAT_BOT,
      _createTime_,
    });
  });
  socket.on("leave_room", (data) => {
    const { userName, room } = data;
    socket.leave(room);
    const _createTime_ = Date.now();
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("receive_message", {
      userName: CHAT_BOT,
      message: `${userName} has left the chat`,
      _createTime_,
    });
    console.log(`${userName} has left the chat`);
  });
  socket.on('disconnect',()=>{
    console.log('User disconnected from the chat');
    const user=allUsers.find((user)=>user.id==socket.id);
    if(user?.userName){
      allUsers=leaveRoom(socket.id,allUsers);
      socket.to(chatRoom).emit('chatroom_user',allUsers);
      socket.to(chatRoom).emit('receive_message',{
        message:`${user.userName} has disconnected from the chat`
      });
    }
  });
});
const PORT = process.env.PORT || 9000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, () => {
  console.log(`localhost connected At ${PORT}`);
});
