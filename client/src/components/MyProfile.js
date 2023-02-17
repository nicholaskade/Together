import { useEffect, useState } from "react";
import { useProfile } from "./context/ProfileContext";
import { useFriends, useFriendsDispatch }  from "./context/FriendsContext";
import { useUser } from "./context/UserContext";
import SignificantOtherSidebar, { significantOtherSidebar } from "./SignificantOtherSidebar";
import RelationshipTimeline from "./RelationshipTimeline";

import Modal from "react-bootstrap/Modal";

import MyPosts from "./MyPosts";

function MyProfile() {

    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState([]);
    const currentUser = useUser().user;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [profileBlurb, setProfileBlurb] = useState("");
    const [relationshipStatus, setRelationshipStatus] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        fetch(`/users/${currentUser.id}`)
        .then(response => {
            if (response.ok) {
                response.json().then(user => setUser(user));
            } else {
                response.json().then(errors => setErrors(errors));
            }
        });
    }, [currentUser]);

    function clickEdit() {
        setShowEditModal(true);
        setEmail(user.email);
        setGender(user.gender);
        setProfileBlurb(user.profile_blurb);
        setRelationshipStatus(user.relationship_status);
        setDateOfBirth(user.date_of_birth);
        setFullName(user.full_name);
    };

    function handleConfirm() {
        setShowEditModal(false);
        setShowPasswordModal(true);
    };

    function handleCancel() {
        setShowEditModal(true);
        setShowPasswordModal(false);
        setPassword("");
    };

    function handleFinish() {
        setShowEditModal(false);
        setShowPasswordModal(false);
        setPassword("");
    }

    function handleSubmitEdits() {
        const userUpdates = { 
            "user": {
                "email": email,
                "gender": gender,
                "profile_blurb": profileBlurb,
                "relationship_status": relationshipStatus,
                "date_of_birth": dateOfBirth,
                "full_name": fullName,
                "password": password
            }
        };

        const patchRequest = {
            "method": "PATCH",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(userUpdates)
        };

        fetch(`/users/${currentUser.id}`, patchRequest)
        .then(res => {
            if (res.ok) {
                res.json().then(user => setUser(user));
            } else {
                res.json().then(errors => setErrors(errors));
            }
        });

        handleFinish();
    };

    const renderProfile = 
        user ? 
            <div id="profile-header">
                <img className="account-center-image"src={user.profile_picture}/>
                <div id="profile-identifiers">
                    <div id="profile-names">
                        <h1>{user.full_name} •</h1>
                        <h1>{user.username}</h1>
                    </div>
                    <p>{user.profile_blurb}</p>
                    <p>{user.gender} • {user.relationship_status}</p>
                </div>
                <button className="together-button" onClick={() => clickEdit()}>edit profile</button>
            </div>
                    :
                        errors.length > 0 ? <h1>{errors}</h1> : <></>
    
    return (
        <>
            <div id="profile-container">
                {renderProfile}
                <RelationshipTimeline/>
                <div id="posts-container">
                    <MyPosts />
                </div>
            </div>
            <SignificantOtherSidebar/>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit your profile</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form className="edit-profile-form">
                        <label>Full Name:</label>
                        <input type="text" onChange={(e) => setFullName(e.target.value)} value={fullName} />
                        <br></br>
                        <label>Email address:</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="text" value={email}/>
                        <br></br>
                        <label>Gender:</label>
                        <input onChange={(e) => setGender(e.target.value)} type="text" value={gender}/>
                        <br></br>
                        <label>Profile Blurb:</label>
                        <textarea onChange={(e) => setProfileBlurb(e.target.value)} maxLength="280" value={profileBlurb}/>
                        <p>280 char. limit</p>
                        <br></br>
                        <label>Relationship Status:</label>
                        <input onChange={(e) => setRelationshipStatus(e.target.value)} type="text" value={relationshipStatus}/>
                        <br></br>
                        <label>Date of Birth:</label>
                        <input onChange={(e) => setDateOfBirth(e.target.value)} type="date" value={dateOfBirth}/>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={() => setShowEditModal(false)}>Cancel</button>
                    <button onClick={() => handleConfirm()}>Confirm</button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPasswordModal} onHide={handleCancel}>
                <Modal.Header>
                    <Modal.Title>Enter your password</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </Modal.Body>

                <Modal.Footer>
                    <button onClick={() => handleCancel()}>Cancel</button>
                    <button onClick={() => handleSubmitEdits()}>Confirm</button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MyProfile; 