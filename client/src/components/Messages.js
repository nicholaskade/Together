import { useMessages, useMessagesDispatch } from "./context/MessagesContext";
import { useState, useEffect } from "react";

function Messages() {

    const dispatch = useMessagesDispatch();
    const messagesState = useMessages();
    const messages = useMessages().messages;

    const selectedUser = localStorage.getItem("selectedUser");
    const currentUser = localStorage.getItem("currentUser");

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetch(`/users/${currentUser}/dm/${selectedUser}`)
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

    console.log(messagesState);

    // console.log(selectedUser);
    // console.log(currentUser);
    // console.log(messagesState);
    // console.log(messages);

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
            

    // const renderMessageCards = messages.map((message, i) => {
    //     return (
    //         <MessageCard
    //             key={i} 
    //             image={message.profile_picture}
    //             name={message.name}
    //             message={message.body}
    //             newness={message["is_new?"]}
    //         />
    //     );
    // });

       return(renderMessages)
};

export default Messages; 