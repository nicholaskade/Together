import { useEffect, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { useLikedPosts, useLikedPostsDispatch } from "./context/LikedPostsContext";
import { useUser } from "./context/UserContext";
import Modal from "react-bootstrap/Modal";
import { ReactComponent as UnlikedButton } from "../unliked-button.svg";
import { ReactComponent as CommentButton } from "../comment-button.svg";
import { ReactComponent as LikedButton } from "../liked-button.svg";
import { ReactComponent as SendButton } from "../send-button.svg";
import { ReactComponent as DeleteButton } from "../delete-post-button.svg";

function PostCommentsModal({
    targetPost,
    setTargetPost,
    showComments,
    setShowComments
}) {

    const [comments, setComments] = useState([]);
    const [errors, setErrors] = useState([]);
    const [post, setPost] = useState(null);

    const likedPostsDispatch = useLikedPostsDispatch();
    const likedPosts = useLikedPosts().likedPosts;

    const [commentText, setCommentText] = useState("");

    const uid = useUser().user.id;

    useEffect(() => {
        if (targetPost) {
            fetch(`/post/${targetPost}/comments`)
            .then(res => {
                if (res.ok) {
                    res.json().then(comments => setComments(comments));
                } else {
                    res.json().then(errors => setErrors(errors));    
                }
            });
        };

        if (targetPost) {
            fetch(`/posts/${targetPost}`)
            .then(res => {
                if (res.ok) {
                    res.json().then(post => setPost(post));
                } else {
                    res.json().then(errors => setErrors(errors));    
                }
            });
        };
    }, [targetPost]);

    function handleClose() {
        setTargetPost(null);
        setShowComments(false);
        setCommentText("");
    };

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

    function handleCommentDelete(comment_id) {
        const deleteRequest = {
            "method": "DELETE",
            "headers": { "Content-Type": "application/json" }
        };

        fetch(`/comments/${comment_id}`, deleteRequest)
        .then(res => {
            if (res.ok) {
                res.json().then(deletedComment => setComments(
                    comments.filter(comment => comment.id !== deletedComment.id)
                ));
            } else {
                res.json().then(errors => setErrors(errors));
            };
        });
    };

    function handleSubmitComment(e) {
        e.preventDefault();

        const comment = {
            "user_id": uid,
            "post_id": targetPost,
            "text": commentText,
        }

        const postRequest = {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(comment)
        };

        fetch("/comments", postRequest)
        .then(res => {
            if (res.ok) {
                res.json().then(comment => setComments(
                    [...comments, comment]
                ))
            } else {
                res.json().then(errors => setErrors(errors));
            };
        });

        setCommentText("");
    };

    const renderPost = 
        post ?
            <div className="post">
                <div className="post-header-container">
                    <div className="post-header">
                        <img src={post.user.profile_picture} className="friend-button"/>
                        <h1>{post.user.full_name}</h1>
                        <ReactTimeAgo date={post.created_at} locale="en-US" timeStyle="twitter"/>
                    </div>
                </div>
                <div className="post-text">
                    <p>{post.text}</p>
                </div>
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
                    :
                        <></>

    const renderComments = 
        comments.length > 0 ?
            comments.map((comment) => {
                return (
                    <div className="comment-container">
                        <div className="comment-header">
                            <img src={comment.user.profile_picture} className="friend-button"/>
                            <p className="comment-names">{comment.user.full_name}</p>
                            <ReactTimeAgo date={comment.created_at} locale="en-US" timeStyle="twitter"/>
                            {
                                comment.user.id === uid &&
                                    <div className="delete-comment-button-container">
                                        <DeleteButton className="delete-comment-button" onClick={() => handleCommentDelete(comment.id)}/>
                                    </div>
                            }
                        </div>
                        <div className="comment-text">
                            <p>{comment.text}</p>
                        </div>
                        <div className="comment-footer">
                        </div>
                    </div>
                )
            })
                :
                    <></>

    return (
        <>
            <Modal show={showComments} onHide={handleClose}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    {renderPost}
                    {renderComments}
                </Modal.Body>
                <Modal.Footer>
                    <div className="comment-input-area">
                        <form className="comment-input" onSubmit={(e) => handleSubmitComment(e)}>
                            <input className="comment-input" type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}/>
                        </form>
                        <SendButton className="comment-send-button" onClick={(e) => handleSubmitComment(e)}/>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default PostCommentsModal;