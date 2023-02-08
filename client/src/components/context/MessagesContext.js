import { useContext, useReducer, createContext } from "react";

const MessagesContext = createContext(null);
const MessagesDispatchContext = createContext(null);

const initialMessages = { messages: null };

function useMessages() {
    return useContext(MessagesContext);
};

function useMessagesDispatch() {
    return useContext(MessagesDispatchContext);
};

function messagesReducer(messages, action) {
    switch (action.type) {
        case "mount": {
            return {
                ...messages,
                messages: action.messages
            }
        };
        case "unmount": {
            return {
                ...messages,
                messages: action.messages
            }
        };
        case "add": {
            return {
                ...messages,
                messages: [...messages.messages, action.messages]
            }
        }
    };
};

function MessagesProvider({ children }) {
    const [messages, dispatch] = useReducer(
        messagesReducer,
        initialMessages
    )

    return (
        <MessagesContext.Provider value={messages}>
            <MessagesDispatchContext.Provider value={dispatch}>
                {children}
            </MessagesDispatchContext.Provider>
        </MessagesContext.Provider>
    );
};

export { MessagesContext, MessagesProvider, useMessagesDispatch, useMessages };