import { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";
import { ReactComponent as CommentButton } from "../comment-button.svg";
import { ReactComponent as UnlikedButton } from "../unliked-button.svg";

function MyPosts() {

    const [errors, setErrors] = useState([]);
    const [posts, setPosts] = useState([]);

    const uid = useUser().user.id;

    useEffect(() => {
        fetch(`/user/${uid}/posts`)
        .then(response => {
            if (response.ok) {
                response.json().then(posts => setPosts(posts))
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })
    }, [uid]);

    function handleDelete(postId) {
        const deleteRequest = {
            "method": "DELETE",
            "headers": { "Content-Type": "application/json" }
        };
        
        fetch(`/posts/${postId}`, deleteRequest)
        .then(response => {
            if (response.ok) {
                response.json().then( post => setPosts((posts).filter(originalPost => originalPost.id ==! post.id)))
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })
    };

    const renderPosts = 
        posts.length > 0
            ?
        posts.map((post) => { 
            if (post.type_of === "text") {
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
                            <button>edit</button>
                            <button>delete</button>

                            <div className="post-footer">
                                <CommentButton className="post-footer-button"/>
                                {
                                    <UnlikedButton className="post-footer-button"/>
                                }
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
                            <button>edit</button>
                            <button onClick={() => handleDelete(post.id)}>delete</button>

                            <div className="post-footer">
                                <CommentButton className="post-footer-button"/>
                                {
                                    <UnlikedButton className="post-footer-button"/>
                                }
                            </div>
                    </div>
                )
            }
        }) 
            :
                <></>
    
    return (
        renderPosts
    );
};

export default MyPosts;