import React, { useState } from "react";
import io from "socket.io-client";
import   Chat from "./Chat";

const socket = io.connect("http://localhost:1000");

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const joinChat = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    }
  };
  return (
    <>
      <div className="join_room">
        <h1>Join Chat</h1>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter the Chat Room"
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinChat}>Join</button>
      </div>
    </>
  );
};

export default App;
