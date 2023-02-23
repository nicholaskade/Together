import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMessagesDispatch } from "./context/MessagesContext";
import {
  useSelectedUser,
  useSelectedUserDispatch,
} from "./context/SelectedUserContext";
import { useProfileDispatch } from "./context/ProfileContext";
import { useFriendsWithChats } from "./context/FriendsWithChatsContext";

import Offcanvas from "react-bootstrap/Offcanvas";
import MessagesClient from "./MessagesClient";

function FriendBubble() {
  const friendsWithChats = useFriendsWithChats().friendsWithChats;

  const selectedUserDispatch = useSelectedUserDispatch();
  const selectedUser = useSelectedUser().selectedUser;

  const messagesDispatch = useMessagesDispatch();

  const [showMessages, setShowMessages] = useState(false);

  const navigate = useNavigate();

  const [friendName, setFriendName] = useState("");
  const [friendPic, setFriendPic] = useState("");

  const profileDispatch = useProfileDispatch();

  function handleShowMessages(pic, name, id) {
    setShowMessages(true);
    selectedUserDispatch({
      type: "mount",
      selectedUser: id,
    });
    setFriendPic(pic);
    setFriendName(name);
  }

  function handleCloseMessages() {
    setShowMessages(false);

    messagesDispatch({
      type: "unmount",
    });

    selectedUserDispatch({
      type: "unmount",
    });
  }

  function handleProfileClick() {
    messagesDispatch({
      type: "unmount",
      messages: null,
    });

    selectedUserDispatch({
      type: "unmount",
    });

    profileDispatch({
      type: "mount",
      profile: selectedUser,
    });

    handleCloseMessages();

    navigate("/user-profile");
  }

  const renderBubbles = friendsWithChats ? (
    friendsWithChats.map((friend) => {
      return (
        <>
          <div
            className="friend-bubble-card"
            key={friend.friend.id}
            friend_id={friend.friend.id}
            onClick={(e) =>
              handleShowMessages(
                friend.friend.profile_picture,
                friend.friend.full_name,
                friend.friend.id
              )
            }
          >
            <img
              alt=""
              className="friend-button"
              src={friend.friend.profile_picture}
              friend_id={friend.friend.id}
            />
            <p friend_id={friend.friend.id} className="friend-bubble-label">
              {friend.friend.full_name}
            </p>
          </div>

          <Offcanvas
            placement={"end"}
            show={showMessages}
            onHide={handleCloseMessages}
          >
            <Offcanvas.Header closeButton>
              <div className="messages-client-header">
                <img
                  onClick={(e) => handleProfileClick(e)}
                  src={friendPic}
                  className="messages-header-avatar"
                  friend_id={selectedUser}
                />
                <h1>{friendName}</h1>
              </div>
            </Offcanvas.Header>
            <Offcanvas.Body id="messages-window">
              <MessagesClient />
            </Offcanvas.Body>
          </Offcanvas>
        </>
      );
    })
  ) : (
    <h1> Add Friends Today! </h1>
  );

  return renderBubbles;
}

export default FriendBubble;
