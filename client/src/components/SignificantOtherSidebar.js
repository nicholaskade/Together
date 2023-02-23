import { useUser } from "./context/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelectedUserDispatch } from "./context/SelectedUserContext";
import { ReactComponent as AddButton } from "../opinion-add-button.svg";
import Modal from "react-bootstrap/Modal";
import { useFriends } from "./context/FriendsContext";

function SignificantOtherSidebar() {
  const uid = useUser().id;
  const sos = useUser().user.significant_others;

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const selectedUserDispatch = useSelectedUserDispatch();

  const friends = useFriends().friends;

  const [significantOthers, setSignificantOthers] = useState([]);

  useEffect(() => {
    fetch(`/user/${uid}/significant_others`).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((significantOthers) => setSignificantOthers(significantOthers));
      } else {
        response.json().then((errors) => setErrors(errors));
      }
    });
  }, []);

  function handleClick(id) {
    selectedUserDispatch({
      type: "mount",
      selectedUser: id,
    });

    navigate("/relationship-board");
  }

  const renderSignificantOthers = significantOthers.map((so) => {
    return (
      <div className="friend-bubble-card" onClick={() => handleClick(so.id)}>
        <img
          src={so.profile_picture}
          className="avatar-button"
          onClick={() => handleClick(so.id)}
        />
      </div>
    );
  });

  const notSos = friends.filter((friend) => !sos.includes(friend.id));

  const renderFriends =
    friends && friends.length > 0 ? (
      notSos.map((friend) => {
        return (
          <div
            className="search-default-card"
            onClick={(e) => handleSoSelection(friend.id)}
          >
            <img
              src={friend.profile_picture}
              alt={friend.full_name}
              className="friend-button"
              onClick={(e) => handleSoSelection(friend.id)}
            />
            <div
              className="search-card-names"
              onClick={(e) => handleSoSelection(friend.id)}
            >
              <h6 onClick={(e) => handleSoSelection(friend.id)}>
                {friend.full_name}
              </h6>
              <h6 onClick={(e) => handleSoSelection(friend.id)}>
                {friend.username}
              </h6>
            </div>
          </div>
        );
      })
    ) : (
      <p>You must add friends before adding your significant other!</p>
    );

  const [selectedFriend, setSelectedFriend] = useState(null);

  const [showAddSoModal, setShowAddSoModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  function handleAddClick() {
    setShowAddSoModal(true);
  }

  function handleCloseSoModal() {
    setShowAddSoModal(false);
    setSelectedFriend(null);
  }

  function handleSoSelection(friendId) {
    setShowAddSoModal(false);

    fetch(`/users/${friendId}`).then((res) => {
      if (res.ok) {
        res.json().then((friend) => setSelectedFriend(friend));
      } else {
        res.json().then((errors) => setErrors(errors));
      }
    });

    setShowConfirmationModal(true);
  }

  function handleCloseConfirmationModal() {
    setShowConfirmationModal(false);
    setSelectedFriend(null);
  }

  function handleCreateSo() {
    fetch(`/user/${uid}/make_significant/${selectedFriend.id}`).then((res) => {
      if (res.ok) {
        res
          .json()
          .then((friend) =>
            setSignificantOthers([...significantOthers, friend])
          );
      } else {
        res.json().then((errors) => setErrors(errors));
      }
    });

    handleCloseConfirmationModal();
  }

  return (
    <>
      <div id="significant-other-sidebar-container">
        <div id="significant-other-sidebar-header">
          <h1 id="friends-header">Dashboard</h1>
          <AddButton
            className="sidebar-button"
            onClick={() => handleAddClick()}
          />
        </div>
        {renderSignificantOthers}
      </div>

      <Modal show={showAddSoModal} onHide={handleCloseSoModal}>
        <Modal.Header closeButton>Add Significant Other</Modal.Header>

        <Modal.Body>{renderFriends}</Modal.Body>

        <Modal.Footer>
          <button className="together-button" onClick={() => handleCloseSoModal()}>Cancel</button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton>Add Significant Other</Modal.Header>

        <Modal.Body>
          {selectedFriend ? (
            <p>
              Would you like to make {selectedFriend.full_name} a significant
              other?
            </p>
          ) : (
            <></>
          )}
        </Modal.Body>

        <Modal.Footer>
          <button className="together-button" onClick={() => handleCloseConfirmationModal()}>Cancel</button>
          <button className="together-button" onClick={() => handleCreateSo()}>Confirm</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SignificantOtherSidebar;
