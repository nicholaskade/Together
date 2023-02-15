import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { useUser } from "./context/UserContext";

import ReactTimeAgo from "react-time-ago";

function EditModal({
    showEditModal,
    targetPost,
    handleCancel,
    setEditText,
    updatePost,
    editText
}) {

    const user = useUser().user;
    const [errors, setErrors] = useState([]);
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (targetPost !== null) {
            fetch(`posts/${targetPost}`)
            .then(response => {
                if (response.ok) {
                    response.json().then(post => setPost(post));
                } else {
                    response.json().then(errors => setErrors(errors));
                }
            })
        };
    }, [targetPost]);

    return (
        <>
            {
                user && post ?
                    <Modal show={showEditModal} onHide={handleCancel}>
                        <Modal.Header closeButton></Modal.Header>
                        <Modal.Body>
                                <div className="post">
                                    <div className="post-header-container">
                                        <div className="post-header">
                                            <img src={user.profile_picture} className="edit-modal-pfp"/>
                                            <h1>{user.full_name}</h1>
                                            <ReactTimeAgo date={post.created_at} locale="en-US" timeStyle="round" className="post-time"/>
                                        </div>
                                    </div>
                                    <textarea autofocus className="edit-modal-text" onChange={(e) => setEditText(e.target.value)} value={editText} maxLength="500"/>
                                </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={() => handleCancel()}>Cancel</button>
                            <button onClick={() => updatePost()}>Cofirm</button>
                        </Modal.Footer>
                    </Modal>
                            :
                                <></>
            }
        </>
    )
};

export default EditModal;