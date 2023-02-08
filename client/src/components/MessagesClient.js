import Messages from "./Messages";

import { ReactComponent as SendButton } from "../send-button.svg";

import { useEffect, useState } from "react";
import { useMessagesDispatch } from "./context/MessagesContext";

function MessagesClient(){
    const selectedUser = localStorage.getItem("selectedUser");
    const currentUser = localStorage.getItem("currentUser");
    const chatId = localStorage.getItem("chatId");

    const dispatch = useMessagesDispatch();

    // const [chatUser, setChatUser] = useState({});

    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");

    // useEffect(() => {
    //     fetch(`/users/${selectedUser}`)
    //     .then(response => {
    //         if (response.ok) {
    //             response.json().then(user => setChatUser(user))
    //         } else {
    //             response.json().then(errors => setErrors(errors))
    //         }
    //     })
    // }, []);

    // console.log(chatUser);

    const sentMessage = {
        sender_id: currentUser,
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
                <SendButton className="send-button" onClick={() => handleSubmit()}/>
            </div>
        </>
    )
};

export default MessagesClient;