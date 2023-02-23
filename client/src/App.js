import "./App.css";

import { Route, Routes } from "react-router";
import { useUser, useUserDispatch } from "./components/context/UserContext";

import { useEffect, useState } from "react";

import Home from "./components/Home";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import UserProfile from "./components/UserProfile";
import MyProfile from "./components/MyProfile";
import RelationshipBoard from "./components/RelationshipBoard";
import DatePage from "./components/DatePage";

import actionCable from "actioncable";

import {
  useFriendsWithChatsDispatch,
  useFriendsWithChats,
} from "./components/context/FriendsWithChatsContext";
import { useFriends } from "./components/context/FriendsContext";
import {
  useMessagesDispatch,
  useMessages,
} from "./components/context/MessagesContext";

function App() {
  let openChat = useMessages().id;
  const userDispatch = useUserDispatch();
  const friendsWithChatsDispatch = useFriendsWithChatsDispatch();
  const friendsWithoutChats = useFriends().friends;
  const friendsWithChats = useFriendsWithChats().friendsWithChats;
  const messagesDispatch = useMessagesDispatch();
  const [channels, setChannels] = useState({});
  const [errors, setErrors] = useState([]);
  const uid = useUser().id;

  const CableApp = {};
  CableApp.cable = actionCable.createConsumer("ws://localhost:3000/cable");

  useEffect(() => {
    CableApp.cable.disconnect();

    const loadFriends = async () => {
      let response = await fetch(
        `http://localhost:3000/user/${uid}/friends_with_chats`
      );
      if (response.ok) {
        response.json().then((friendsWithChats) => {
          friendsWithChatsDispatch({
            type: "mount",
            friendsWithChats: friendsWithChats,
          });
        });
      } else {
        response.json().then((data) => setErrors(data.errors));
      }
    };
    loadFriends();
  }, [friendsWithoutChats, uid]);

  function updateMessages(message) {
    messagesDispatch({
      type: "add",
      messages: message,
    });
  }

  useEffect(() => {
    let friendChannels = channels;

    for (const chatId in friendChannels) {
      friendChannels[chatId].unsubscribe();
      setChannels({});
    }

    if (openChat !== null && friendsWithChats && uid) {
      friendChannels[openChat] = CableApp.cable.subscriptions.create(
        {
          channel: "MessagesChannel",
          chat_id: openChat,
        },
        {
          received: (message) => {
            updateMessages(message);
          },
        }
      );
      setChannels(friendChannels);
    }
  }, [friendsWithChats, uid, openChat]);

  useEffect(() => {
    const loadSession = async () => {
      let response = await fetch (
        "http://localhost:3000/check_sign_in"
      );
      if (response.ok) {
        response.json().then(user => userDispatch({
          type: "mount",
          user: user,
          id: user.id
        }))
      }
    };
    loadSession();
  }, [uid]);

  if (useUser().user) {
    return (
      <>
        <Header cable={CableApp.cable} />

        <div id="app-body">
          <Sidebar />

          <Routes>
            <Route path="/my-profile" element={<MyProfile />} />

            <Route path="/user-profile" element={<UserProfile />} />

            <Route path="/relationship-board" element={<RelationshipBoard />} />

            <Route path="/dates" element={<DatePage />} />

            <Route exact path="/" element={<Home />} />
          </Routes>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Header cable={CableApp.cable} />

        <div id="app-body">
          <Routes>
            <Route exact path="/" element={<Home />} />
          </Routes>
        </div>
      </>
    );
  }
}

export default App;
