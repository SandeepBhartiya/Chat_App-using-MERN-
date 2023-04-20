import "./style.css";
import Messages from "./messages.jsx";
import SendMessage from "./sent-message";
import RoomAndUsers from "./room-and-users";
const Chat=({userName,room,socket})=>{
    return(
        <div className="chatContainer">
            <RoomAndUsers socket={socket} userName={userName} room={room}/>
            <div>
                <Messages socket={socket}/>
                <SendMessage socket={socket} userName={userName} room={room}/>
            </div>
        </div>
    )
}

export default Chat;