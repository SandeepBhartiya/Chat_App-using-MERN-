import { useState, useEffect, useRef } from "react";
import "./style.css";
const Messages = ({ socket }) => {
  const [messageReceived, setMessageReceived] = useState([]);
  const messageColumnRef = useRef(null);
  console.log(messageReceived);
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageReceived((state) => [
        ...state,
        {
          message: data.message,
          userName: data.userName,
          _createTime_: data._createTime_,
        },
      ]);
    });
    return () => socket.off("receive_message");
  }, [socket]);

  useEffect(() => {
    socket.on("last_100_message", (last100message) => {
      last100message = JSON.stringify(last100message);
      setMessageReceived((state) => [...last100message, ...state]);
    });
    return () => socket.off("last_100_message");
  }, [socket]);

  useEffect(()=>{
    messageColumnRef.current.scrollTop=messageColumnRef.current.scrollHeight;
  },[messageReceived])

  function formateDateFromTimeStamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
  return (
    <div className="messagesColumn" ref={messageColumnRef}>
      {messageReceived.map((msg, i) => (
        <div className="message" key={i}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className="msgMeta">{msg.userName}</span>
            <span className="msgMeta">
              {formateDateFromTimeStamp(msg._createTime_)}
            </span>
          </div>
          <p className="msgText">{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;
