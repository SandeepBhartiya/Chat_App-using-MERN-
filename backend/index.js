import  express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import dotenv from "dotenv";
import {Server} from "socket.io";

const app=express();
dotenv.config();

//security middelware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
//
app.use(cors());
app.use(express.json());
app.use(morgan("common"));

const CHAT_BOT='ChatBot';
const chatRoom='';
const allUsers=[];
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST'],
    }
});

io.on("connection",(socket)=>{
    console.log(`User Connected ${socket.id}`)

    socket.on("Join_Room",(data)=>{
        const {userName,room}=data;
        socket.join(room);
    
        chatRoom=room;
        allUsers.push({id:socket.id,userName,room});
        chatRoomUsers=allUsers.filter((user)=>user.room==room);
        socket.to(room).emit('chatroom_user',chatRoomUsers);
        socket.emit('chatRoom_users',chatRoomUsers);
    
        let _createTime_=Date.now();
        socket.to(room).emit('receive message',{
            message:`${userName} has Joined the Chat Room`,
            userName:CHAT_BOT,
            _createTime_
        });
        socket.emit('receive_message',{
            message:`Welcome ${userName}`,
            userName:CHAT_BOT,
            _createTime_
        });
    });
})
const PORT=process.env.PORT||9000;
app.get("/",(req,res)=>{
    res.send('Hello World!');
})

server.listen(PORT,()=>{
    console.log(`localhost connected At ${PORT}`)
});

