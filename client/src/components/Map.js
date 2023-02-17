import { useRef, useEffect, useState } from "react";
import Marker from "./Marker";
import { ReactComponent as AddButton } from "../opinion-add-button.svg";
import Modal from "react-bootstrap/Modal";
import ConfirmationModal from "./ConfirmationModal";
import { useUser } from "./context/UserContext";
import { useSelectedUser } from "./context/SelectedUserContext";
import { useNavigate } from "react-router";
import { useDatesDispatch } from "./context/DatesContext";

function Map({
    pos,
    setMap,
    map
}) {

    const ref = useRef(null);
    const [showDateModal, setShowDateModal] = useState(false);
    const [dateNotes, setDateNotes] = useState("");
    const [dateAddress, setDateAddress] = useState("");
    const [dateName, setDateName] = useState("");
    const [dateDate, setDateDate] = useState(Date.now());
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDatesDispatch();

    const [dateCoords, setDateCoords] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        if (ref.current && pos !== undefined) {
            setMap(new window.google.maps.Map(ref.current, {
                zoom: 10,
                center: pos
            }));
        };
    }, [pos]);

    function handleCancel() {
        setShowDateModal(false);
        setDateNotes("");
        setDateAddress("");
        setDateName("");
        setShowConfirmationModal(false);
    };

    const uid = useUser().id;
    const so_uid = useSelectedUser().selectedUser;

    function fetchCoords() {
        const addressObj = {
            "address": dateAddress,
        };

        const postRequest = {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(addressObj)
        };

        fetch("/get_coords", postRequest)
        .then(response => {
            if (response.ok) {
                response.json().then(coords => setDateCoords(coords));
                setShowConfirmationModal(true);
                setShowDateModal(false);
            } else {
                response.json().then(errors => setErrors(errors));
            }
        })
    };

    function handleSubmitDate() {
        const dateObj = {
            "name": dateName,
            "location": JSON.stringify(dateCoords),
            "notes": dateNotes,
            "creator": uid,
            "so": so_uid,
            "date": dateDate
        };

        const postRequest = {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(dateObj)
        };

        fetch("/outings", postRequest)
        .then(response => {
            if (response.ok) {
                response.json().then(outing => dispatch({
                    type: "add",
                    date: outing 
                }));
                
                handleCancel();
            } else {
                response.json().then(errors => setErrors(errors));
            }
        });
    };

    return (
        <>
            <div id="dislikes-header">
                <h1 id="dates-title" onClick={() => navigate("/dates")}>Your Dates</h1>
                <AddButton className="opinion-add-button" onClick={() => setShowDateModal(true)}/>
            </div>
            <div id="google-map" className="main-map" ref={ref}/>
            <Marker 
                map={map}
            />

            <Modal show={showDateModal} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Add a Date
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <label>Date Label:</label>
                        <input type="text" value={dateName} onChange={(e) => setDateName(e.target.value)}/>

                        <label>Date Address:</label>
                        <input type="text" value={dateAddress} onChange={(e) => setDateAddress(e.target.value)}/>

                        <label>Date:</label>
                        <input type="date" value={dateDate} onChange={(e) => setDateDate(e.target.value)}/>

                        <label>Notes:</label>
                        <textarea cols="10" maxLength="500" onChange={(e) => setDateNotes(e.target.value)} value={dateNotes}/>
                        <p>Max input: 500 chars</p>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => handleCancel()}>Cancel</button>
                    <button onClick={() => fetchCoords()}>Confirm</button>
                </Modal.Footer>
            </Modal>

            <ConfirmationModal
                showConfirmationModal={showConfirmationModal}
                setShowConfirmationModal={setShowConfirmationModal}
                dateCoords={dateCoords}
                setMap={setMap}
                map={map}
                handleSubmitDate={handleSubmitDate}
                setShowDateModal={setShowDateModal}
            />
        </>
    );
};

export default Map;