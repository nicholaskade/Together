import { useEffect, useState } from "react";
import UserPosts from "./UserPosts";
import { useProfile } from "./context/ProfileContext";
import { useFriends, useFriendsDispatch }  from "./context/FriendsContext";
import { useUser } from "./context/UserContext";
import RelationshipTimeline from "./RelationshipTimeline";

function UserProfile(){

    const [user, setUser] = useState(null);

    const [errors, setErrors] = useState([]);

    const profileUser = useProfile().profile;

    const friendsDispatch = useFriendsDispatch();

    useEffect(() => {
        fetch(`/users/${profileUser}`)
        .then(response => {
            if (response.ok) {
                response.json().then(user => setUser(user));
            } else {
                response.json().then(errors => setErrors(errors));
            }
        });
    }, [profileUser]);

    const friends = useFriends().friends;
    const friendIdArray = [];
    const userId = useUser().id;

    console.log(profileUser);
    
    const friendIds = friends ? friends.map((friend) => {
        return (
            friendIdArray.push(friend.id)
        );
    })
        :
    [];

    console.log(friendIdArray);

    function handleFriend() {

        const friendRequest = {
            "sender_id": userId,
            "recipient_id": profileUser,
            "confirmed": true, 
            "is_significant_other": false
        };

        const postRequest = {
            method: "POST",
            headers: { "Content-Type" : "application/json"},
            body: JSON.stringify(friendRequest)
        };

        fetch("/friendships", postRequest)
        .then(response => {
            if (response.ok) {
                response.json().then( friend => { friendsDispatch({
                    type: "add",
                    friend: friend
                })})
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })
    };

    function handleUnfriend() {
        const deleteRequest = {
            "method": "DELETE",
            "headers": { "Content-Type": "application/json" }
        };

        fetch(`/user/${userId}/unfriend/${profileUser}`, deleteRequest)
        .then(response => {
            if (response.ok) {
                response.json().then(friend => {
                    friendsDispatch({
                        type: "delete",
                        friend_id: profileUser
                    })
                })
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })

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
            </div>
            {
                friends && profileUser !== userId ?
                    friendIdArray.includes(profileUser)
                        ?
                        <button onClick={() => handleUnfriend()}>Unfriend</button>
                            :
                        <button onClick={() => handleFriend()}>Add Friend</button>
                        :
                    <></>
                    
            }
        </div>
            :
        errors.length > 0 ?
            <h1>{errors}</h1>
                :
            <h1>It looks like there's been an error...</h1>
    
    return (
        <div id="profile-container">
            {renderProfile}
            <RelationshipTimeline />
            <div id="posts-container">
                <UserPosts />
            </div>
        </div>
    );
};

export default UserProfile;