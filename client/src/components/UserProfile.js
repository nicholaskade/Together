import { useEffect, useState } from "react";

function UserProfile(){
    const selectedUser = localStorage.getItem("selectedUser");
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetch(`/users/${selectedUser}`)
        .then(response => {
            if (response.ok) {
                response.json().then(user => console.log(user));
            } else {
                response.json().then(setErrors => setErrors(user));
            }
        })
    }, []);

    return(
        <div id="profile-container">
        </div>
    )
};

export default UserProfile;