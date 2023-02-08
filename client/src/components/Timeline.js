import { useEffect, useState } from "react";
import { usePosts, usePostsDispatch } from "./context/PostsContext";
import { useUser } from "./context/UserContext";

function Timeline() {
    
    const dispatch = usePostsDispatch();
    const postsState = usePosts();
    const posts = usePosts().posts;

    const [errors, setErrors] = useState([]);

    const uid = useUser().user.id;

    useEffect(() => {
        fetch('/posts')
        .then(response => {
            if (response.ok) {
                response.json().then(posts => { dispatch({
                    type: "mount",
                    posts: posts
                })})
        }
        else {
            response.json().then(data => setErrors(data.errors))
        }});
    }, []);
    

    const renderPosts = 
        posts 
            ?
        posts.map((post) => 
             { if (post.type_of === "text") {
                return (
                    <div className="post-container">
                        <div className="post">
                            <div className="post-header">
                                <img alt="" className="friend-button" src={post.user.profile_picture}/>
                                <h1>{post.user.full_name} • {post.user.username}</h1>
                            </div>
                            <div className="post-text">
                                <p>{post.text}</p>
                            </div>
                        </div>
                    </div>
                )
            } else if (post.type_of === "image") {
                return (
                    <div className="post-container">
                        <div className="post">
                            <div className="post-header">
                                <img alt="" className="friend-button" src={post.user.profile_picture}/>
                                <h1>{post.user.full_name} • {post.user.username}</h1>
                            </div>
                            <div className="post-image-container">
                                <img alt="" className="post-image" src={post.image}/>
                            </div>
                            <div className="post-text">
                                <p>{post.text}</p>
                            </div>
                        </div>
                    </div>
                )
            }
        }) 
            :
                <></>

    return (
        <div id="posts-container">
            {renderPosts}
        </div>
    );
};

export default Timeline;
