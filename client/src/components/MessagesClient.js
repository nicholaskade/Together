import Messages from "./Messages";

import { ReactComponent as SendButton } from "../send-button.svg";

import { useEffect, useState } from "react";
import { useMessages, useMessagesDispatch } from "./context/MessagesContext";
import { useUser } from "./context/UserContext";
import { useSelectedUser } from "./context/SelectedUserContext";

function MessagesClient(){
    const chatId = useMessages().id;
    const uid = useUser().id;
    const selectedUser = useSelectedUser().selectedUser;

    const dispatch = useMessagesDispatch();

    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");

    const sentMessage = {
        sender_id: uid,
        chat_id: chatId,
        body: message 
    };

    function handleSubmit(e) {
        e.preventDefault();
        const postRequest = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sentMessage)
        };

        fetch("messages", postRequest)
        .then(response => {
            if (response.ok) {
                response.json().then(message => dispatch({
                    type: "add",
                    messages: message
                }))
            } else {
                response.json().then(errors => setErrors(errors))
            }
        });
        setMessage("");
    };

    console.log(message);

    return (
        <>
            <Messages />
            <div className="message-input">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}/>
                </form>
                <SendButton className="send-button" onClick={(e) => handleSubmit(e)}/>
            </div>
        </>
    )
};

export default MessagesClient;