import { useMessages, useMessagesDispatch } from "./context/MessagesContext";
import { useState, useEffect } from "react";

import { useUser } from "./context/UserContext";
import { useSelectedUser } from "./context/SelectedUserContext";

function Messages() {

    const dispatch = useMessagesDispatch();
    const messagesState = useMessages();
    const messages = useMessages().messages;

    const selectedUser = useSelectedUser().selectedUser;
    const currentUser = useUser().id;

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetch(`/user/${currentUser}/dm/${selectedUser}`)
        .then(response => {
            if (response.ok) {
                response.json().then(messages => dispatch({
                    type: "mount",
                    messages: messages
                }))
            } else {
                response.json().then(errors => setErrors(errors));
            };
        });
    }, []);

    const renderMessages = 
        messages ?
            messages.map((message) => {
                if (localStorage.getItem("chatId")) {
                    if (message.sender_id == selectedUser) {
                        console.log("Accessing received messages...")
                        return (
                            <div className="received-message-container">
                                <div className="received-message-bubble">
                                    <p className="message-text">{message.body}</p>
                                </div>
                                <p className="message-timestamp">{message.created_at}</p>
                            </div>
                        )
                    } else {
                        console.log("Accessing sent messages...")
                        return (
                            <div className="sent-message-container">
                                <div className="sent-message-bubble">
                                    <p className="message-text">{message.body}</p>
                                </div>
                                <p className="message-timestamp">{message.created_at}</p>
                            </div>
                        )
                    }
                } else {
                    localStorage.setItem("chatId", message.chat_id);
                    if (message.sender_id == selectedUser) {
                        console.log("Accessing received messages...")
                        return (
                            <div className="received-message-container">
                                <div className="received-message-bubble">
                                    <p className="message-text">{message.body}</p>
                                </div>
                                <p className="message-timestamp">{message.created_at}</p>
                            </div>
                        )
                    } else {
                        console.log("Accessing sent messages...")
                        return (
                            <div className="sent-message-container">
                                <div className="sent-message-bubble">
                                    <p className="message-text">{message.body}</p>
                                </div>
                                <p className="message-timestamp">{message.created_at}</p>
                            </div>
                        )
                    }
                }
            })
                    :
                        <></>       

    return(renderMessages)
};

export default Messages; 