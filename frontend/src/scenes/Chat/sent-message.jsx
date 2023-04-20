import React, { useState } from "react";
import "./style.css";

const SendMessage = ({socket,userName,room}) => {
  const [message, setMessage] = useState("");
  const sendMessage = () => {
    if (message !== "") {
      const _createTime_ = Date.now();
      socket.emit("send_message", { userName, room, message, _createTime_ });
      setMessage("");
    }
  };
  return (
    <div className="sendMessageContainer">
      <input
        className="messageInput"
        placeholder="Message...."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
      />
      <button className="btn btn-primary" onClick={sendMessage}>Send Message</button>
    </div>
  );
};

export default SendMessage;
