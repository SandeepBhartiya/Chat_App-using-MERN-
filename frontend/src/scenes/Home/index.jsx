import React from "react";
import "./style.css";
import { useNavigate } from "react-router-dom";
const Home = ({userName,setUserName,room,setRoom,socket}) => {
//   const [selectedRoom, newSelectedRoom] = useState("Javascript");
const navigate=useNavigate();
const joinRoom=()=>{
    if(room!==" " && userName!==" ")
    {
        socket.emit('Join_Room',{userName,room});
    }
    navigate('/chat',{replace:true});
}

return (
    <>
      <div className="outerContainer">
        <div className="innerContainer">
          <h1>Chat Rooms</h1>
          <input className="input" placeholder="Username" value={userName} onChange={(e)=>setUserName(e.target.value)} />
          <select
            className="selector"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            <option value="javascript">Javascript</option>
            <option value="Java">Java</option>
            <option value="python">Python</option>
          </select>
          <button className="btnSecondary" onClick={joinRoom}>Join Room</button>
        </div>
      </div>
    </>
  );
};

export default Home;
