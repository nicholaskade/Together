import { usePosts, usePostsDispatch } from "./context/PostsContext";
import { useUser } from "./context/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useProfileDispatch } from "./context/ProfileContext";
import { ReactComponent as UnlikedButton } from "../unliked-button.svg";
import { ReactComponent as CommentButton } from "../comment-button.svg";
import { ReactComponent as LikedButton } from "../liked-button.svg";
import { useLikedPosts, useLikedPostsDispatch } from "./context/LikedPostsContext";

function Posts() {

    const postsDispatch = usePostsDispatch();
    const posts = usePosts().posts;

    const likedPostsDispatch = useLikedPostsDispatch();
    const likedPosts = useLikedPosts().likedPosts;

    const [errors, setErrors] = useState([]);

    const uid = useUser().user.id;
    const navigate = useNavigate();

    const profileDispatch = useProfileDispatch();

    function handleLike(postId) {
        const like = {
            post_id: postId,
            user_id: uid
        };

        const postRequest = {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(like)
        };

        fetch(`/likes`, postRequest)
        .then(response => {
            if (response.ok) {
                response.json().then( likedPost => { likedPostsDispatch({
                    type: "add",
                    likedPost: likedPost.post_id
                })})
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })
    };

    function handleUnlike(postId) {
        const deleteRequest = {
            "method": "DELETE",
            "headers": { "Content-Type": "application/json" }
        };
        
        fetch(`/user/${uid}/like/${postId}`, deleteRequest)
        .then(response => {
            if (response.ok) {
                response.json().then( likedPost => { likedPostsDispatch({
                    type: "delete",
                    likedPost: likedPost
                })})
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })
    };

    function handleDelete(postId) {
        const deleteRequest = {
            "method": "DELETE",
            "headers": { "Content-Type": "application/json" }
        };
        
        fetch(`/posts/${postId}`, deleteRequest)
        .then(response => {
            if (response.ok) {
                response.json().then( post => { postsDispatch({
                    type: "delete",
                    post: post
                })})
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })
    };

    function handleClick(e, id) {
        profileDispatch({
            type: "mount",
            profile: id
        })
        navigate("/user-profile");
    };

    const renderPosts = 
        posts 
            ?
        posts.map((post) => { 
            if (post.type_of === "text") {
                return (
                    <div className="post-container">
                        <div className="post">
                            <div className="post-header">
                                <img onClick={(e) => handleClick(e, post.user.id)} alt="" className="friend-button" src={post.user.profile_picture}/>
                                <h1>{post.user.full_name} • {post.user.username}</h1>
                            </div>
                            <div className="post-text">
                                <p>{post.text}</p>
                            </div>
                        </div>
                        {
                            post.user_id == uid &&
                                <> 
                                    <button>edit</button>
                                    <button onClick={() => handleDelete(post.id)}>delete</button>
                                </>
                        }

                            <div className="post-footer">
                                <CommentButton className="post-footer-button"/>
                                {
                                    likedPosts
                                        ?
                                    likedPosts.includes(post.id) 
                                        ?
                                    <LikedButton onClick={(e) => handleUnlike(post.id)} className="post-footer-button"/>   
                                            :
                                        <UnlikedButton onClick={(e) => handleLike(post.id)} className="post-footer-button"/>
                                    :
                                        <></>
                                }
                            </div>
                    </div>
                )
            } else if (post.type_of === "image") {
                return (
                    <div className="post-container">
                        <div className="post">
                            <div className="post-header">
                                <img onClick={(e) => handleClick(e, post.user.id)} alt="" className="friend-button" src={post.user.profile_picture}/>
                                <h1>{post.user.full_name} • {post.user.username}</h1>
                            </div>
                            <div className="post-image-container">
                                <img alt="" className="post-image" src={post.image}/>
                            </div>
                            <div className="post-text">
                                <p>{post.text}</p>
                            </div>
                        </div>
                        {
                            post.user_id == uid &&
                                <>
                                    <button>edit</button>
                                    <button onClick={() => handleDelete(post.id)}>delete</button>
                                </>
                        }

                            <div className="post-footer">
                                <CommentButton className="post-footer-button"/>
                                {
                                    likedPosts
                                        ?
                                        likedPosts.includes(post.id) 
                                            ?
                                        <LikedButton onClick={(e) => handleUnlike(post.id)} className="post-footer-button"/>   
                                                :
                                            <UnlikedButton onClick={(e) => handleLike(post.id)} className="post-footer-button"/>
                                        :
                                            <></>
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

export default Posts;