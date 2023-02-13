import { useUser } from "./context/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelectedUserDispatch } from "./context/SelectedUserContext";

function SignificantOtherSidebar() {

    const uid = useUser().id;
    const [significantOthers, setSignificantOthers] = useState([]);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const selectedUserDispatch = useSelectedUserDispatch();

    useEffect(() => {
        fetch(`/user/${uid}/significant_others`)
        .then(response => {
            if (response.ok) {
                response.json().then(significantOthers => setSignificantOthers(significantOthers))
            } else {
                response.json().then(errors => setErrors(errors))
            }
        })
    }, []);

    function handleClick(id) {
        selectedUserDispatch({
            type: "mount",
            selectedUser: id
        });

        navigate("/relationship-board");
    };

    const renderSignificantOthers = 
        significantOthers.map((so) => {
            return (
                <div className="friend-bubble-card" onClick={() => handleClick(so.id)}>
                    <img src={so.profile_picture} className="avatar-button" onClick={() => handleClick(so.id)}/>
                </div>
            )
        });
    
    return(
            <div id="significant-other-sidebar-container">
                <h1 id="friends-header">Dashboard</h1>
                {renderSignificantOthers}
            </div>
        );
    
};

export default SignificantOtherSidebar;