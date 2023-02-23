import { useState } from "react";
import Modal from "react-bootstrap/Modal";

import { useUserDispatch, useUser } from "./context/UserContext";
import { useDatesDispatch } from "./context/DatesContext";
import { useFriendsDispatch } from "./context/FriendsContext";
import { useSelectedUserDispatch } from "./context/SelectedUserContext";
import { usePostsDispatch } from "./context/PostsContext";
import { useProfileDispatch } from "./context/ProfileContext";
import { useMessagesDispatch } from "./context/MessagesContext";
import { useLikedPostsDispatch } from "./context/LikedPostsContext";
import { useFriendsWithChatsDispatch } from "./context/FriendsWithChatsContext";

import { useNavigate } from "react-router";

// import Alert from "react-bootstrap/Alert";

function SignIn({ cable }) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const dispatch = useUserDispatch();
  const userState = useUser();

  const [show, setShow] = useState(false);

  function handleClose() {
    setShow(false);
  }
  function handleShow() {
    setShow(true);
  }

  const dispatches = [
    useFriendsDispatch(),
    useSelectedUserDispatch(),
    usePostsDispatch(),
    useProfileDispatch(),
    useMessagesDispatch(),
    useLikedPostsDispatch(),
    useDatesDispatch(),
    useFriendsWithChatsDispatch(),
  ];
  const navigate = useNavigate();

  function handleSubmit(e) {
    handleClose();

    const formData = {
      email: email,
      password: password,
    };

    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((response) => {
      if (response.ok) {
        response.json().then((user) => {
          dispatch({
            type: "added",
            user: user,
          });
          navigate("/");
        });
      } else {
        response.json().then((data) => setErrors(data.errors));
      }
    });
  }

  const handleSignOut = () => {
    fetch("/signout", {
      method: "DELETE",
    });

    dispatch({
      type: "removed",
      user: null,
      id: null,
    });

    dispatches.map((dispatch) =>
      dispatch({
        type: "unmount",
      })
    );

    cable.disconnect();

    navigate("/");
  };

  const signInForm = userState.user ? (
    <p id="sign-in-link" onClick={handleSignOut}>
      Sign Out
    </p>
  ) : (
    <>
      <p id="sign-in-link" onClick={() => handleShow()}>
        Sign In
      </p>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <label>Email</label>
            <input
              type="text"
              placeholder="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button className="together-button" onClick={handleClose}>Cancel</button>
          <button className="together-button" onClick={() => handleSubmit()}>Sign In</button>
        </Modal.Footer>
      </Modal>
    </>
  );

  return (
    <>
      {signInForm}
      {/* {
                errors.length > 0 &&
                    <Alert variant="danger" onClose={() => setErrors([])} dismissible>
                        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                        <p>
                            {errors}
                        </p>
                    </Alert>
            } */}
    </>
  );
}

export default SignIn;
