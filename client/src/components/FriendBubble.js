import { useEffect, useState } from "react";
import { useFriends, useFriendsDispatch } from "./context/FriendsContext";
import { useNavigate } from "react-router-dom";

import { useUser } from "./context/UserContext";

import { useMessages, useMessagesDispatch } from "./context/MessagesContext";

import Offcanvas from "react-bootstrap/Offcanvas";
import MessagesClient from "./MessagesClient";

function FriendBubble() {

    const friendsDispatch = useFriendsDispatch();
    const friendsState = useFriends();
    const friends = useFriends().friends;

    const messagesDispatch = useMessagesDispatch();

    const [errors, setErrors] = useState([]);

    const uid = useUser().user.id;

    const [showMessages, setShowMessages] = useState(false);

    const navigate = useNavigate();

    function handleShowMessages(e) {
        setShowMessages(true);
        console.log(e.target.getAttribute("friend_id"));
        localStorage.setItem("selectedUser", e.target.getAttribute("friend_id"));
    };

    function handleCloseMessages() {
        setShowMessages(false);
        localStorage.removeItem("selectedUser");
        localStorage.removeItem("chatId");
        messagesDispatch({
            type: "unmount"
        });
    };

    useEffect(() => {
        fetch(`users/friends/${uid}`)
        .then(response => {
            if (response.ok){
                response.json().then(friends => { friendsDispatch({
                    type: "mount",
                    friends: friends,
                })})
        }
        else {
            response.json().then(data => setErrors(data.errors))
        }});
    }, []);


    function handleProfileClick(e) {
        localStorage.setItem("userProfile", e.target.getAttribute("friend_id"));
        messagesDispatch({
            type: "unmount",
            messages: null
        });
        handleCloseMessages();
        navigate("/user-profile");
    };

    const renderBubbles = 
        friends 
            ?
        friends.map((friend) => {
            return (
                <>
                    <div className="friend-bubble-card" key={friend.id} friend_id={friend.id} onClick={(e) => handleShowMessages(e)}>
                        <img alt="" className="friend-button" src={friend.profile_picture} friend_id={friend.id}/>
                        <p friend_id={friend.id} className="friend-bubble-label">{friend.full_name}</p>
                    </div>

                    <Offcanvas placement={"end"} show={showMessages} onHide={handleCloseMessages}>
                    <Offcanvas.Header closeButton>
                        <div className="messages-client-header">
                            <img onClick={(e) => handleProfileClick(e)} src={friend.profile_picture} className="messages-header-avatar"friend_id={friend.id}/>
                            <h1>{friend.full_name}</h1>
                        </div>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <MessagesClient />
                    </Offcanvas.Body>
                    </Offcanvas>
                </>
            )
        }) : <h1> Add Friends Today! </h1>
    
    return (renderBubbles);
};

export default FriendBubble;