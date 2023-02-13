import { useEffect, useState } from "react";

import { useSelectedUser } from "./context/SelectedUserContext";
import { useNavigate } from "react-router";
import { useUser } from "./context/UserContext";
import { ReactComponent as LikedIcon } from "../opinion-liked-icon.svg";
import { ReactComponent as DislikedIcon} from "../opinion-disliked-icon.svg";
import { ReactComponent as DeleteButton } from "../opinion-delete-button.svg";
import { ReactComponent as AddButton } from "../opinion-add-button.svg";

import Modal from "react-bootstrap/Modal";
import Opinions from "./Opinions";

function RelationshipBoard() {

    const so_uid = useSelectedUser().selectedUser;
    const [so, setSo] = useState(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        fetch(`/users/${so_uid}`)
        .then(response => {
            if (response.ok) {
                response.json().then(user => setSo(user))
            } else {
                response.json().then(errors => setErrors(errors))
            };
        });
    }, []);

    return (
        <>
            <div id="relationship-board-container">
                {
                    so 
                        ?
                    <div id="relationship-board-header">
                        <img src={so.profile_picture} className="account-center-image"/>
                        <h1 id="relationship-board-title">Your Relationship with {so.full_name}</h1>
                    </div>
                        :
                    <></>
                }
                <Opinions />
            </div>
        </>
    )
};

export default RelationshipBoard;