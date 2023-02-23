import Messages from "./Messages";

import { ReactComponent as SendButton } from "../send-button.svg";

import { useState, useRef } from "react";
import { useMessages } from "./context/MessagesContext";
import { useUser } from "./context/UserContext";

function MessagesClient() {

  const chatId = useMessages().id;
  const uid = useUser().id;

  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState("");

  const sentMessage = {
    sender_id: uid,
    chat_id: chatId,
    body: message,
  };

  function handleSubmit(e) {
    e.preventDefault();

    const postRequest = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sentMessage),
    };

    fetch("/messages", postRequest).then((response) => {
      if (response.ok) {
        response.json();
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });

    setMessage("");
  };

  return (
    <>
      <Messages />
      <div className="message-input">
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
        <SendButton className="send-button" onClick={(e) => handleSubmit(e)} />
      </div>
    </>
  );
};

export default MessagesClient;
