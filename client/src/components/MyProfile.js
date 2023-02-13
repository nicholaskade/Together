import { useEffect, useState } from "react";
import { useProfile } from "./context/ProfileContext";
import { useFriends, useFriendsDispatch }  from "./context/FriendsContext";
import { useUser } from "./context/UserContext";
import SignificantOtherSidebar, { significantOtherSidebar } from "./SignificantOtherSidebar";

import MyPosts from "./MyPosts";

function MyProfile() {

    const [user, setUser] = useState(null);

    const [errors, setErrors] = useState([]);

    const friendsDispatch = useFriendsDispatch();

    const currentUser = useUser().user;

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
            </div>
        </div>
            :
        errors.length > 0 ?
            <h1>{errors}</h1>
                :
            <h1>It looks like there's been an error...</h1>
    
    return (
        <>
            <div id="profile-container">
                {renderProfile}
                <div id="posts-container">
                    <MyPosts />
                </div>
            </div>
            <SignificantOtherSidebar/>
        </>
    );
};

export default MyProfile;