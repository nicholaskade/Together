import { useState, useContext, useReducer, createContext } from "react";

const UserContext = createContext(null);
const UserDispatchContext = createContext(null);

const initialUser = { user: null, id: null };

function useUser() {
    return useContext(UserContext);
};

function useUserDispatch() {
    return useContext(UserDispatchContext)
};

function userReducer(user, action) {
    switch (action.type) {
        case "added": {
            return {
                ...user,
                user: action.user, id: action.user.id
            } 
        };
        case "removed": {
            return {
                ...user,
                user: action.user
            }
        };
    };
};

function UserProvider({ children }) {
    const [user, dispatch] = useReducer(
        userReducer,
        initialUser
    )

    return (
        <UserContext.Provider value={user}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider, useUserDispatch, useUser };