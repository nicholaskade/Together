import { useContext, useReducer, createContext } from "react";

const LikedPostsContext = createContext(null);
const LikedPostsDispatchContext = createContext(null);

const initialLikedPosts = { likedPosts: null };

function useLikedPosts() {
    return useContext(LikedPostsContext);
};

function useLikedPostsDispatch() {
    return useContext(LikedPostsDispatchContext);
};

function likedPostsReducer(likedPosts, action) {
    switch (action.type) {
        case "mount": {
            return {
                ...likedPosts,
                likedPosts: action.likedPosts
            }
        };
        
        case "unmount": {
            return {
                ...likedPosts,
                likedPosts: null
            }
        };

        case "add": {
            return {
                ...likedPosts,
                likedPosts: [action.likedPost, ...likedPosts.likedPosts]
            }
        };

        case "delete": {
            return {
                ...likedPosts,
                likedPosts: likedPosts.likedPosts.filter((post) => post.id !== action.likedPost.id)
            }
        };
    };
};

function LikedPostsProvider({ children }) {
    const [likedPosts, dispatch] = useReducer(
        likedPostsReducer,
        initialLikedPosts
    )

    return (
        <LikedPostsContext.Provider value={likedPosts}>
            <LikedPostsDispatchContext.Provider value={dispatch}>
                {children}
            </LikedPostsDispatchContext.Provider>
        </LikedPostsContext.Provider>
    );
};

export { LikedPostsContext, LikedPostsProvider, useLikedPostsDispatch, useLikedPosts };