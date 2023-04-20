import "./App.css";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./scenes/Home";
import Chat from "./scenes/Chat";
import io from "socket.io-client";
import { useState } from "react";
const socket = io.connect("http://localhost:5000"); //add the server host address
function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("Javascript");

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              userName={userName}
              setUserName={setUserName}
              room={room}
              setRoom={setRoom}
              socket={socket}
            />
          }
        />
        <Route
          path="/chat"
          element={<Chat userName={userName} room={room} socket={socket} />}
        />
      </Routes>
    </Router>
 
  );
}

export default App;
