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
import Map from "./Map";

import { Wrapper } from "@googlemaps/react-wrapper";

function RelationshipBoard() {

    const so_uid = useSelectedUser().selectedUser;
    const [so, setSo] = useState(null);

    const [errors, setErrors] = useState([]);

    const mapsApiKey = "AIzaSyBMkOLyU2LH7aEOFOv_cSka3UiPdKgHT5M";

    const [map, setMap] = useState(null);
    const [pos, setPos] = useState(undefined);


    const render = (status) => {
        return (
            <h1>Loading...</h1>
        );
    };

    useEffect(() => {
        fetch(`/users/${so_uid}`)
        .then(response => {
            if (response.ok) {
                response.json().then(user => setSo(user))
            } else {
                response.json().then(errors => setErrors(errors))
            };
        });

        navigator.geolocation.getCurrentPosition((position) => {
            setPos({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
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
                <Wrapper
                    render={render}
                    apiKey={mapsApiKey}
                >
                    <Map 
                        pos={pos}
                        setMap={setMap}
                        map={map}
                    />
                </Wrapper>
            </div>
        </>
    )
};

export default RelationshipBoard;