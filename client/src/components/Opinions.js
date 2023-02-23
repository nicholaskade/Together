import { useSelectedUser } from "./context/SelectedUserContext";
import { useUser } from "./context/UserContext";
import { ReactComponent as LikedIcon } from "../opinion-liked-icon.svg";
import { ReactComponent as DislikedIcon } from "../opinion-disliked-icon.svg";
import { ReactComponent as DeleteButton } from "../opinion-delete-button.svg";
import { ReactComponent as AddButton } from "../opinion-add-button.svg";
import Modal from "react-bootstrap/Modal";

import { useEffect, useState } from "react";

function Opinions() {
  const so_uid = useSelectedUser().selectedUser;
  const [opinions, setOpinions] = useState([]);
  const [errors, setErrors] = useState([]);
  const uid = useUser().id;
  const [so, setSo] = useState(null);
  const [showAllLikes, setShowAllLikes] = useState(false);
  const [showAllDislikes, setShowAllDislikes] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOpinion, setSelectedOpinion] = useState(null);

  const [opinionSentiment, setOpinionSentiment] = useState(null);
  const [thing, setThing] = useState("");

  useEffect(() => {
    fetch(`/user/${uid}/opinions/${so_uid}`).then((response) => {
      if (response.ok) {
        response.json().then((opinions) => setOpinions(opinions));
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });

    fetch(`/users/${so_uid}`).then((response) => {
      if (response.ok) {
        response.json().then((user) => setSo(user));
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });
  }, []);

  function handleClose() {
    setSelectedOpinion(null);
    setShowDeleteModal(false);
    setOpinionSentiment(null);
    setShowAddModal(false);
    setThing("");
  };

  function handleDeleteClick(id) {
    setSelectedOpinion(id);
    setShowDeleteModal(true);
  };

  function deleteOpinion() {
    const deleteRequest = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    fetch(`/opinions/${selectedOpinion}`, deleteRequest).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((deletedOpinion) =>
            setOpinions(
              opinions.filter((opinion) => opinion.id !== selectedOpinion)
            )
          );
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });

    handleClose();
  };

  function handleAddLike() {
    setShowAddModal(true);
    setOpinionSentiment(true);
  };

  function handleAddDislike() {
    setShowAddModal(true);
    setOpinionSentiment(false);
  };

  function addOpinion(e) {
    e.preventDefault();
    const newOpinion = {
      liked: opinionSentiment,
      thing: thing,
      owner_id: so_uid,
      user_id: uid,
    };

    const postRequest = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOpinion),
    };

    fetch(`/opinions`, postRequest).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((addedOpinion) => setOpinions([...opinions, addedOpinion]));
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });

    handleClose();
  };

  const likes = opinions.filter((opinion) => opinion.liked === true);
  const dislikes = opinions.filter((opinion) => opinion.liked === false);

  const renderLikes =
    opinions.length > 0 ? (
      likes.slice(0, 4).map((opinion) => {
        if (opinion.liked == true) {
          return (
            <div className="like-card">
              <LikedIcon />
              <p>{opinion.thing}</p>
              <DeleteButton
                className="opinion-delete-button"
                onClick={() => handleDeleteClick(opinion.id)}
              />
            </div>
          );
        }
      })
    ) : (
      <></>
    );

  const renderAllLikes =
    opinions.length > 0 ? (
      likes.map((opinion) => {
        if (opinion.liked == true) {
          return (
            <div className="like-card">
              <LikedIcon />
              <p>{opinion.thing}</p>
              <DeleteButton
                className="opinion-delete-button"
                onClick={() => handleDeleteClick(opinion.id)}
              />
            </div>
          );
        }
      })
    ) : (
      <></>
    );

  const renderDislikes =
    opinions.length > 0 ? (
      dislikes.slice(0, 4).map((opinion) => {
        if (opinion.liked == false) {
          return (
            <div className="dislike-card">
              <DislikedIcon />
              <p>{opinion.thing}</p>
              <DeleteButton
                className="opinion-delete-button"
                onClick={() => handleDeleteClick(opinion.id)}
              />
            </div>
          );
        }
      })
    ) : (
      <></>
    );

  const renderAllDislikes =
    opinions.length > 0 ? (
      dislikes.map((opinion) => {
        if (opinion.liked == false) {
          return (
            <div className="dislike-card">
              <DislikedIcon />
              <p>{opinion.thing}</p>
              <DeleteButton
                className="opinion-delete-button"
                onClick={() => handleDeleteClick(opinion.id)}
              />
            </div>
          );
        }
      })
    ) : (
      <></>
    );

  return (
    <>
      <div id="likes-header">
        {so && (
          <>
            <h1>{so.full_name}'s Likes</h1>
            <AddButton
              className="opinion-add-button"
              onClick={() => handleAddLike()}
            />
          </>
        )}
      </div>

      <div className="opinions-container">
        {renderLikes}
        <p className="show-all-opinions" onClick={() => setShowAllLikes(true)}>
          Show more...
        </p>
      </div>

      <div id="dislikes-header">
        {so && (
          <>
            <h1>{so.full_name}'s Dislikes</h1>
            <AddButton
              className="opinion-add-button"
              onClick={() => handleAddDislike()}
            />
          </>
        )}
      </div>

      <div className="opinions-container">
        {renderDislikes}
        <p
          className="show-all-opinions"
          onClick={() => setShowAllDislikes(true)}
        >
          Show more...
        </p>
      </div>

      {/* DELETE OPINION MODAL */}

      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>Delete Opinion</Modal.Header>
        <Modal.Body>Are you sure you want to delete this opinion?</Modal.Body>
        <Modal.Footer>
          <button className="together-button" onClick={() => deleteOpinion()}>Confirm</button>
          <button className="together-button" onClick={() => handleClose()}>Cancel</button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={handleClose}>
        <Modal.Header closeButton>Delete Opinion</Modal.Header>
        <Modal.Body>Are you sure you want to delete this opinion?</Modal.Body>
        <Modal.Footer>
          <button className="together-button" onClick={() => deleteOpinion()}>Confirm</button>
          <button className="together-button" onClick={() => handleClose()}>Cancel</button>
        </Modal.Footer>
      </Modal>

      {/* ADD OPINION MODAL */}

      <Modal show={showAddModal} onHide={handleClose}>
        <Modal.Header closeButton>Add Opinion</Modal.Header>
        <Modal.Body>Are you sure you want to delete this opinion?</Modal.Body>
        <Modal.Footer>
          <button className="together-button" onClick={() => deleteOpinion()}>Confirm</button>
          <button className="together-button" onClick={() => handleClose()}>Cancel</button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={handleClose}>
        <Modal.Header closeButton>
          Add {opinionSentiment ? "Like" : "Dislike"}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => addOpinion(e)}>
            <input
              type="text"
              value={thing}
              onChange={(e) => setThing(e.target.value)}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="together-button" onClick={(e) => addOpinion(e)}>Confirm</button>
          <button className="together-button" onClick={() => handleClose()}>Cancel</button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAllDislikes} onHide={() => setShowAllDislikes(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dislikes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-opinions-container">{renderAllDislikes}</div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal show={showAllLikes} onHide={() => setShowAllLikes(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Likes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-opinions-container">{renderAllLikes}</div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export default Opinions;
