import { useContext, useReducer, createContext } from "react";

const PostsContext = createContext(null);
const PostsDispatchContext = createContext(null);

const initialPosts = { posts: null };

function usePosts() {
    return useContext(PostsContext);
};

function usePostsDispatch() {
    return useContext(PostsDispatchContext);
};

function postsReducer(posts, action) {
    switch (action.type) {
        case "mount": {
            return {
                ...posts,
                posts: action.posts
            }
        };
        case "unmount": {
            return {
                ...posts,
                posts: action.posts
            }
        };
    };
};

function PostsProvider({ children }) {
    const [posts, dispatch] = useReducer(
        postsReducer,
        initialPosts
    )

    return (
        <PostsContext.Provider value={posts}>
            <PostsDispatchContext.Provider value={dispatch}>
                {children}
            </PostsDispatchContext.Provider>
        </PostsContext.Provider>
    );
};

export { PostsContext, PostsProvider, usePostsDispatch, usePosts };