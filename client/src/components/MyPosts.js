import { useState, useEffect } from "react";
import { useUser } from "./context/UserContext";
import { ReactComponent as CommentButton } from "../comment-button.svg";
import { ReactComponent as UnlikedButton } from "../unliked-button.svg";
import { ReactComponent as LikedButton } from "../liked-button.svg";
import { ReactComponent as EditButton } from "../edit-post-button.svg";
import { ReactComponent as DeleteButton } from "../delete-post-button.svg";
import {
  useLikedPosts,
  useLikedPostsDispatch,
} from "./context/LikedPostsContext";
import ReactTimeAgo from "react-time-ago";
import Modal from "react-bootstrap/Modal";
import PostCommentsModal from "./PostCommentsModal";
import EditModal from "./EditModal";

function MyPosts() {
  const [errors, setErrors] = useState([]);
  const [posts, setPosts] = useState([]);

  const uid = useUser().user.id;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editText, setEditText] = useState("");

  const likedPostsDispatch = useLikedPostsDispatch();
  const likedPosts = useLikedPosts().likedPosts;

  const [targetPost, setTargetPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    fetch(`/user/${uid}/posts`).then((response) => {
      if (response.ok) {
        response.json().then((posts) => setPosts(posts));
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });
  }, [uid]);

  function handleEditClick(postId, postText) {
    setTargetPost(postId);
    setShowEditModal(true);
    setEditText(postText);
  }

  function updatePost() {
    const postUpdate = {
      text: editText,
    };

    const patchRequest = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postUpdate),
    };

    fetch(`/posts/${targetPost}`, patchRequest).then((response) => {
      if (response.ok) {
        response.json().then((updatedPost) => {
          const filteredPosts = posts.filter(
            (post) => post.id !== updatedPost.id
          );
          setPosts(...filteredPosts, [updatedPost, filteredPosts]);
        });
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });

    handleCancel();
  }

  function handleCommentClick(postId) {
    setTargetPost(postId);
    setShowComments(true);
  }

  function handleDeleteClick(postId) {
    setTargetPost(postId);
    setShowDeleteModal(true);
  }

  function handleCancel() {
    setTargetPost(null);
    setShowDeleteModal(false);
    setShowEditModal(false);
  }

  function handleDelete(postId) {
    const deleteRequest = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    fetch(`/posts/${postId}`, deleteRequest).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((post) =>
            setPosts(
              posts.filter((originalPost) => originalPost.id == !post.id)
            )
          );
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });
  }

  function handleDeleteClick(postId) {
    setTargetPost(postId);
    setShowDeleteModal(true);
  }

  function handleCancel() {
    setTargetPost(null);
    setShowDeleteModal(false);
    setShowEditModal(false);
  }

  function handleLike(postId) {
    const like = {
      post_id: postId,
      user_id: uid,
    };

    const postRequest = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(like),
    };

    fetch(`/likes`, postRequest).then((response) => {
      if (response.ok) {
        response.json().then((likedPost) => {
          likedPostsDispatch({
            type: "add",
            likedPost: likedPost.post_id,
          });
        });
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });
  }

  function handleUnlike(postId) {
    const deleteRequest = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    fetch(`/user/${uid}/like/${postId}`, deleteRequest).then((response) => {
      if (response.ok) {
        response.json().then((likedPost) => {
          likedPostsDispatch({
            type: "delete",
            likedPost: likedPost,
          });
        });
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });
  }

  const renderPosts =
    posts.length > 0 ? (
      posts.map((post) => {
        if (post.type_of === "text") {
          return (
            <>
              <div className="post-container">
                <div className="post">
                  <div className="post-header-container">
                    <div className="post-header">
                      <img
                        alt=""
                        className="friend-button"
                        src={post.user.profile_picture}
                      />
                      <h1>
                        {post.user.full_name} • {post.user.username}
                      </h1>
                      <ReactTimeAgo
                        date={post.created_at}
                        locale="en-US"
                        timeStyle="round"
                        className="post-time"
                      />
                    </div>
                    <div className="post-button-container">
                      <EditButton
                        className="post-button"
                        onClick={() => handleEditClick(post.id, post.text)}
                      />
                      <DeleteButton
                        className="post-button"
                        onClick={() => handleDeleteClick(post.id)}
                      />
                    </div>
                  </div>
                  <div className="post-text">
                    <p>{post.text}</p>
                  </div>
                  <div className="post-footer">
                    <p className="post-metrics-text">
                      {post.number_of_comments}
                    </p>
                    <CommentButton
                      className="post-footer-button"
                      onClick={() => handleCommentClick(post.id)}
                    />
                    <p className="post-metrics-text">{post.number_of_likes}</p>
                    {likedPosts ? (
                      likedPosts.includes(post.id) ? (
                        <LikedButton
                          onClick={(e) => {
                            handleUnlike(post.id);
                            post.number_of_likes--;
                          }}
                          className="post-footer-button"
                        />
                      ) : (
                        <UnlikedButton
                          onClick={(e) => {
                            handleLike(post.id);
                            post.number_of_likes++;
                          }}
                          className="post-footer-button"
                        />
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </>
          );
        } else if (post.type_of === "image") {
          return (
            <div className="post-container">
              <div className="post">
                <div className="post-header-container">
                  <div className="post-header">
                    <img
                      alt=""
                      className="friend-button"
                      src={post.user.profile_picture}
                    />
                    <h1>
                      {post.user.full_name} • {post.user.username}
                    </h1>
                    <ReactTimeAgo
                      date={post.created_at}
                      locale="en-US"
                      timeStyle="round"
                      className="post-time"
                    />
                  </div>
                  <div className="post-button-container">
                    <EditButton
                      className="post-button"
                      onClick={() => handleEditClick(post.id, post.text)}
                    />
                    <DeleteButton
                      className="post-button"
                      onClick={() => handleDeleteClick(post.id)}
                    />
                  </div>
                </div>
                <div className="post-image-container">
                  <img alt="" className="post-image" src={post.image} />
                </div>
                <div className="post-text">
                  <p>{post.text}</p>
                </div>
                <div className="post-footer">
                  <p className="post-metrics-text">{post.number_of_comments}</p>
                  <CommentButton
                    className="post-footer-button"
                    onClick={() => handleCommentClick(post.id)}
                  />
                  <p className="post-metrics-text">{post.number_of_likes}</p>
                  {likedPosts ? (
                    likedPosts.includes(post.id) ? (
                      <LikedButton
                        onClick={(e) => {
                          handleUnlike(post.id);
                          post.number_of_likes--;
                        }}
                        className="post-footer-button"
                      />
                    ) : (
                      <UnlikedButton
                        onClick={(e) => {
                          handleLike(post.id);
                          post.number_of_likes++;
                        }}
                        className="post-footer-button"
                      />
                    )
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
          );
        }
      })
    ) : (
      <></>
    );

  return (
    <>
      {renderPosts}

      <Modal show={showDeleteModal} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Post</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete this post?</p>
        </Modal.Body>

        <Modal.Footer>
          <button className="together-button" onClick={() => handleCancel()}>Cancel</button>
          <button className="together-button" onClick={() => handleDelete(targetPost)}>Confirm</button>
        </Modal.Footer>
      </Modal>

      <PostCommentsModal
        targetPost={targetPost}
        setTargetPost={setTargetPost}
        showComments={showComments}
        setShowComments={setShowComments}
      />

      <EditModal
        showEditModal={showEditModal}
        targetPost={targetPost}
        handleCancel={handleCancel}
        setEditText={setEditText}
        updatePost={updatePost}
        editText={editText}
      />
    </>
  );
}

export default MyPosts;
