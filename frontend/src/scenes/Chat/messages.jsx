import { useState, useEffect } from "react";
import "./style.css";
const Messages = ({ socket }) => {
  const [messageReceived, setMessageReceived] = useState([]);

  useEffect(() => {
    socket.on("received_message", (data) => {
      console.log(data);
      setMessageReceived((state) => [
        ...state,
        {
          message: data.message,
          userName: data.useName,
          _createTime_: data._createTime_,
        },
      ]);
    });
    return () => socket.off('receive_message');
  }, [socket]);
  function formateDateFromTimeStamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
  return (
    <div className="messagesColumn">
      {messageReceived.map((msg, i) => (
        <div className="message" key={i}>
        <div style={{display:'flex' ,justifyContent:'space-between'}}>
          <span className="msgMeta">{msg.username}</span>
          <span className="msgMeta">
            {formateDateFromTimeStamp(msg._createTime_)}
          </span>
        </div>
        <p className="msgText">{msg.message}</p>
        <br/>
        </div>
      ))}
    </div>
  );
};

export default Messages;
