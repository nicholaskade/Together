import { useState, useContext, useReducer, createContext } from "react";

const SelectedUserContext = createContext(null);
const SelectedUserDispatchContext = createContext(null);

const initialSelectedUser = { selectedUser: null };

function useSelectedUser() {
    return useContext(SelectedUserContext);
};

function useSelectedUserDispatch() {
    return useContext(SelectedUserDispatchContext)
};

function selectedUserReducer(selectedUser, action) {
    switch (action.type) {
        case "mount": {
            return {
                ...selectedUser,
                selectedUser: action.selectedUser
            } 
        };
        case "unmount": {
            return {
                ...selectedUser,
                selectedUser: null
            }
        };
    };
};

function SelectedUserProvider({ children }) {
    const [selectedUser, dispatch] = useReducer(
        selectedUserReducer,
        initialSelectedUser
    )

    return (
        <SelectedUserContext.Provider value={selectedUser}>
            <SelectedUserDispatchContext.Provider value={dispatch}>
                {children}
            </SelectedUserDispatchContext.Provider>
        </SelectedUserContext.Provider>
    );
};

export { SelectedUserContext, SelectedUserProvider, useSelectedUserDispatch, useSelectedUser };