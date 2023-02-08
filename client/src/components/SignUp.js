import { useState, useContext } from 'react';
import { useUserDispatch, useUser } from "./context/UserContext";
import Modal from "react-bootstrap/Modal";

function SignUp({
  apiKey,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [password, setPassword] = useState("");
  
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
      }
    };


    fetch("/users", {
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user)
    })
    .then(res => {
      if (res.ok) {
        res.json().then(user => {
          dispatch({
            type: "added",
            user: { "user": user },
          });
          localStorage.setItem("currentUser", user.id);
        });
      } else {
        res.json().then(
          errors => console.log(errors.error)
          )
      }
    })

  };

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
            Name
          </label>
          <input type='text' value={name} onChange={(e) => setName(e.target.value)} />

          <label>
            Email
          </label>
          <input placeholder='mylove@together.io' type='text' value={email} onChange={(e) => setEmail(e.target.value)} />

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
          <input type='file' value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />

          <label>
            Relationship Status
          </label>
          <input type='text' value={relationshipStatus} onChange={(e) => setRelationshipStatus(e.target.value)} />

          <input type= 'submit' value ='Sign Up!' />

        </form>
      </Modal.Body>
      <Modal.Footer>
          <button onClick={handleClose}>
          Cancel
          </button>
          <button onClick={() => onSubmit()}>
          Sign In
          </button>
      </Modal.Footer>
      </Modal>
      </>
  )
}

export default SignUp;
