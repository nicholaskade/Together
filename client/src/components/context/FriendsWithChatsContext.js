import { useContext, useReducer, createContext } from "react";

const FriendsWithChatsContext = createContext(null);
const FriendsWithChatsDispatchContext = createContext(null);

const initialFriendsWithChats = { friendsWithChats: null };

function useFriendsWithChats() {
  return useContext(FriendsWithChatsContext);
}

function useFriendsWithChatsDispatch() {
  return useContext(FriendsWithChatsDispatchContext);
}

function friendsWithChatsReducer(friendsWithChats, action) {
  switch (action.type) {
    case "mount": {
      return {
        ...friendsWithChats,
        friendsWithChats: action.friendsWithChats,
      };
    }

    case "unmount": {
      return {
        ...friendsWithChats,
        friendsWithChats: null,
      };
    }

    case "add": {
      return {
        ...friendsWithChats,
        friendsWithChats: [
          action.friendWithChat,
          ...friendsWithChats.friendsWithChats,
        ],
      };
    }

    case "delete": {
      return {
        ...friendsWithChats,
        friendsWithChats: friendsWithChats.friendsWithChats.filter(
          (friendWithChat) =>
            friendWithChat.friend.id !== action.friendWithChat.friend.id
        ),
      };
    }
  }
}

function FriendsWithChatsProvider({ children }) {
  const [friends, dispatch] = useReducer(
    friendsWithChatsReducer,
    initialFriendsWithChats
  );

  return (
    <FriendsWithChatsContext.Provider value={friends}>
      <FriendsWithChatsDispatchContext.Provider value={dispatch}>
        {children}
      </FriendsWithChatsDispatchContext.Provider>
    </FriendsWithChatsContext.Provider>
  );
}

export {
  FriendsWithChatsContext,
  FriendsWithChatsProvider,
  useFriendsWithChatsDispatch,
  useFriendsWithChats,
};
