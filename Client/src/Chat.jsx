import React, { useState, useEffect, useRef } from "react";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: Math.random(),
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours().toString().padStart(2, "0") +
          ":" +
          new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMsg = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMsg);
    return () => {
      socket.off("receive_message", handleReceiveMsg);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="chat_container">
      <div className="chat_header">
        <div>
          <h2>{room}</h2>
          <p>Welcome, {username}</p>
        </div>
      </div>

      <div className="chat_box">
        <div className="message_list">
          {messageList.map((data) => (
            <div
              key={data.id}
              className={`message_content ${data.author === username ? "you" : "other"}`}
            >
              <div className="message_card">
                <p className="message_text">{data.message}</p>
                <div className="message_detail">
                  <span>{data.author}</span>
                  <span>{data.time}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat_body">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button className="send_btn" onClick={sendMessage}>
            &#9658;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
