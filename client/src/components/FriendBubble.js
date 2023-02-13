import { useEffect, useState } from "react";
import { useFriends, useFriendsDispatch } from "./context/FriendsContext";
import { useNavigate } from "react-router-dom";

import { useUser } from "./context/UserContext";

import { useMessages, useMessagesDispatch } from "./context/MessagesContext";
import { useSelectedUser, useSelectedUserDispatch } from "./context/SelectedUserContext";
import { useProfileDispatch } from "./context/ProfileContext";

import Offcanvas from "react-bootstrap/Offcanvas";
import MessagesClient from "./MessagesClient";

function FriendBubble() {

    const friendsDispatch = useFriendsDispatch();
    const friendsState = useFriends();
    const friends = useFriends().friends;

    const selectedUserDispatch = useSelectedUserDispatch();
    const selectedUser = useSelectedUser().selectedUser;

    const messagesDispatch = useMessagesDispatch();

    const [errors, setErrors] = useState([]);

    const uid = useUser().user.id;
    const user = useUser().user;

    const [showMessages, setShowMessages] = useState(false);

    const navigate = useNavigate();

    const [friendName, setFriendName] = useState("");
    const [friendPic, setFriendPic] = useState("");

    const profileDispatch = useProfileDispatch();

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

    function handleShowMessages(e, pic, name, id) {
        setShowMessages(true);
        selectedUserDispatch({
            type: "mount",
            selectedUser: id
        });
        setFriendPic(pic);
        setFriendName(name);
    };

    function handleCloseMessages() {
        setShowMessages(false);

        messagesDispatch({
            type: "unmount"
        });
        
        selectedUserDispatch({
            type: "unmount"
        });
    };

    function handleProfileClick(e) {
        messagesDispatch({
            type: "unmount",
            messages: null
        });

        selectedUserDispatch({
            type: "unmount"
        })

        profileDispatch({
            type: "mount",
            profile: selectedUser 
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
                    <div className="friend-bubble-card" key={friend.id} friend_id={friend.id} onClick={(e) => handleShowMessages(e, friend.profile_picture, friend.full_name, friend.id)}>
                        <img alt="" className="friend-button" src={friend.profile_picture} friend_id={friend.id}/>
                        <p friend_id={friend.id} className="friend-bubble-label">{friend.full_name}</p>
                    </div>

                    <Offcanvas placement={"end"} show={showMessages} onHide={handleCloseMessages}>
                    <Offcanvas.Header closeButton>
                        <div className="messages-client-header">
                            <img onClick={(e) => handleProfileClick(e)} src={friendPic} className="messages-header-avatar" friend_id={selectedUser}/>
                            <h1>{friendName}</h1>
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