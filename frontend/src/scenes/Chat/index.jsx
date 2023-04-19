import "./style.css";
import Messages from "./messages.jsx";

const Chat=({socket})=>{
    return(
        <div className="chatContainer">
            <div>
                <Messages socket={socket}/>
            </div>
        </div>
    )
}

export default Chat;