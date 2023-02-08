import { useContext, useReducer, createContext } from "react";

const FriendsContext = createContext(null);
const FriendsDispatchContext = createContext(null);

const initialFriends = { friends: null };

function useFriends() {
    return useContext(FriendsContext);
};

function useFriendsDispatch() {
    return useContext(FriendsDispatchContext);
};

function friendsReducer(friends, action) {
    switch (action.type) {
        case "mount": {
            return {
                ...friends,
                friends: action.friends
            }
        };
        case "unmount": {
            return {
                ...friends,
                friends: null
            }
        };
    };
};

function FriendsProvider({ children }) {
    const [friends, dispatch] = useReducer(
        friendsReducer,
        initialFriends
    );

    return (
        <FriendsContext.Provider value={friends}>
            <FriendsDispatchContext.Provider value={dispatch}>
                {children}
            </FriendsDispatchContext.Provider>
        </FriendsContext.Provider>
    );
};

export { FriendsContext, FriendsProvider, useFriendsDispatch, useFriends };