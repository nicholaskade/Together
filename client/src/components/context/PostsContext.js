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
                posts: null
            }
        };

        case "add": {
            return {
                ...posts,
                posts: [action.post, ...posts.posts]
            }
        };

        case "delete": {
            return {
                ...posts,
                posts: posts.posts.filter((post) => post.id !== action.post.id)
            }
        };

        case "update": {
            const filteredPosts = posts.posts.filter((post) => post.id !== action.post.id);
            
            return {
                ...posts,
                posts: [action.post, ...filteredPosts]
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