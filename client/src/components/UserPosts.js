import { useEffect, useState } from "react";
import { useProfile } from "./context/ProfileContext";
import ReactTimeAgo from "react-time-ago";
import { useLikedPosts, useLikedPostsDispatch } from "./context/LikedPostsContext";
import { useUser } from "./context/UserContext";
import { ReactComponent as CommentButton } from "../comment-button.svg";
import { ReactComponent as UnlikedButton } from "../unliked-button.svg";
import { ReactComponent as LikedButton } from "../liked-button.svg";
import PostCommentsModal from "./PostCommentsModal";

function UserPosts() {

    const likedPosts = useLikedPosts().likedPosts;
    const likedPostsDispatch = useLikedPostsDispatch();
    const uid = useUser().user.id;

    const [userPosts, setUserPosts] = useState([]);
    const [errors, setErrors] = useState([]);

    const [targetPost, setTargetPost] = useState(null);
    const [showComments, setShowComments] = useState(false);

    const selectedUser = useProfile().profile;

    useEffect(() => {
        fetch(`/user/${selectedUser}/posts`)
        .then(response => {
            if (response.ok) {
                response.json().then(userPosts => setUserPosts(userPosts));
            } else {
                response.json().then(errors => setErrors(errors));
            }
        })
    }, [selectedUser]);

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

    function handleCommentClick(postId) {
        setTargetPost(postId);
        setShowComments(true);
    };

    const renderPosts = 
        userPosts.length > 0
            ?
                userPosts.map((post) => { 
                    if (post.type_of === "text") {
                        return (
                            <div className="post-container">
                                <div className="post">
                                    <div className="post-header">
                                        <img alt="" className="friend-button" src={post.user.profile_picture}/>
                                        <h1>{post.user.full_name} • {post.user.username}</h1>
                                        <ReactTimeAgo date={post.created_at} locale="en-US" timeStyle="round" className="post-time"/>
                                    </div>
                                    <div className="post-text">
                                        <p>{post.text}</p>
                                    </div>
                                        <div className="post-footer">
                                            <CommentButton className="post-footer-button" onClick={() => handleCommentClick(post.id)}/>

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
                            </div>
                        )
                    } else if (post.type_of === "image") {
                        return (
                            <div className="post-container">
                                <div className="post">
                                    <div className="post-header">
                                        <img alt="" className="friend-button" src={post.user.profile_picture}/>
                                        <h1>{post.user.full_name} • {post.user.username}</h1>
                                        <ReactTimeAgo date={post.created_at} locale="en-US" timeStyle="round" className="post-time"/>
                                    </div>
                                    <div className="post-image-container">
                                        <img alt="" className="post-image" src={post.image}/>
                                    </div>
                                    <div className="post-text">
                                        <p>{post.text}</p>
                                    </div>
                                    <div className="post-footer">
                                        <CommentButton className="post-footer-button" onClick={() => handleCommentClick(post.id)}/>

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
                            </div>
                        )
                    }
                }) 
                    :
                        errors.length > 0 ?
                            <h1>{errors}</h1>
                                :
                            <h1>It looks like this user hasn't made any posts yet...</h1>
    
    return (
        <>
            {renderPosts}

            <PostCommentsModal
                targetPost={targetPost}
                setTargetPost={setTargetPost}
                showComments={showComments}
                setShowComments={setShowComments}
            />
        </>
    );
};

export default UserPosts;