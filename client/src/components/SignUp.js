import { useState, useContext } from 'react';
import { useUserDispatch, useUser } from "./context/UserContext";
import Modal from "react-bootstrap/Modal";

import { useNavigate } from "react-router";

function SignUp() {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  
  const [errors, setErrors] = useState([]);

  const dispatch = useUserDispatch();

  function handleClose() { setShow(false) };
  function handleShow() { setShow(true) };

  const [show, setShow] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    const user = { 
      "user": {
        "full_name": name,
        "email": email, 
        "date_of_birth": dateOfBirth, 
        "gender": gender,
        "password": password,
        "password_confirmation": null, 
        "profile_picture": profilePicture,
        "relationship_status": relationshipStatus,
        "username": username
      }
    };

    const postRequest = {
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    };

    fetch("/users", postRequest)
    .then(response => {
      if (response.ok) {
        response.json().then(user => {
          dispatch({
            type: "added",
            user: user,
          });
          navigate("/");
        });
      } else {
        response.json().then(errors => console.log(errors.error))
      }
    })
  };

  function handleFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setProfilePicture(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  const renderProfilePicture = 
    profilePicture !== "" ?
      <>
        <img src={profilePicture} className="account-center-image"/>
      </>
        :
      <>
        <p>Upload a profile picture to preview it here!</p>
      </>

  return (
    <>
      <p id="sign-in-link" onClick={() => handleShow()}>Sign Up</p>

      <Modal show={show} onHide={handleClose}>

        <Modal.Header closeButton>
            <Modal.Title>Create an Account</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={onSubmit}>

            <label>
              Full Name
            </label>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />

            <label>
              Email
            </label>
            <input placeholder='mylove@together.io' type='text' value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>
              Username
            </label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label>
              Password
            </label> 
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

            <label>
              Date of Birth
            </label>
            <input type='date' value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />

            <label>
              Gender
            </label>
            <input placeholder='Gender' type='text' value={gender} onChange={(e) => setGender(e.target.value)} />

            <label>
              Profile Picture
            </label>
            <input accept=".jpg, .png, .jpeg" type='file' onChange={(e) => handleFile(e)} />
          
            {renderProfilePicture}

            <label>
              Relationship Status
            </label>
            <input type='text' value={relationshipStatus} onChange={(e) => setRelationshipStatus(e.target.value)} />

          </form>

        </Modal.Body>

        <Modal.Footer>
            <button onClick={handleClose}>
              Cancel
            </button>
            <button onClick={(e) => onSubmit(e)}>
              Sign Up
            </button>
        </Modal.Footer>

        </Modal>
      </>
  )
};

export default SignUp;
