import { useEffect, useState } from "react";
import { useDates, useDatesDispatch } from "./context/DatesContext";
import { useUser } from "./context/UserContext";
import { useSelectedUser } from "./context/SelectedUserContext";
import { ReactComponent as EditButton } from "../edit-post-button.svg";
import { ReactComponent as DeleteButton } from "../opinion-delete-button.svg";
import { ReactComponent as GoBackButton } from "../go-back-button.svg";
import { useNavigate } from "react-router";
import ReactTimeAgo from "react-time-ago";

import Modal from "react-bootstrap/Modal";
import EditDateModal from "./EditDateModal";

function DatePage() {
    const uid = useUser().id;
    const so_uid = useSelectedUser().selectedUser;
    const [errors, setErrors] = useState([]);
    const dates = useDates().dates;
    const datesDispatch = useDatesDispatch();
    const [so, setSo] = useState(null);
    const navigate = useNavigate();

    const [targetPost, setTargetPost] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    function handleEditClick(dateId) {
        setTargetPost(dateId);
        setShowEditModal(true);
    };

    function handleDeleteClick(dateId) {
        setTargetPost(dateId);
        setShowDeleteModal(true);
    };

    function handleCancel() {
        setTargetPost(null);
        setShowDeleteModal(false);
        setShowEditModal(false); 
    };

    function handleDelete() {
        const deleteRequest = {
            "method": "DELETE",
            "headers": { "Content-Type": "application/json" }
        }

        fetch(`/outings/${targetPost}`, deleteRequest)
        .then(res => {
            if (res.ok) {
                res.json().then(outing => datesDispatch({
                    type: "delete",
                    date: outing
                }));
            } else {
                res.json().then(errors => setErrors(errors));
            };
        });
        handleCancel();
    };

    useEffect(() => {
        fetch(`/user/${uid}/dates/${so_uid}`)
        .then(response => {
            if (response.ok) {
                response.json().then(dates => datesDispatch({
                    type: "mount",
                    dates: dates 
                }))
            } else {
                response.json().then(errors => setErrors(errors))
            }
        });

        fetch(`/users/${so_uid}`)
        .then(res => {
            if (res.ok) {
                res.json().then(user => setSo(user));
            } else {
                res.json().then(errors => setErrors(errors));
            }
        })
    }, []);

    const renderDates =
        dates ?
            dates.map((date) => {
                return (
                    <div className="date-card">
                        <p className="date-card-text">{date.name}</p>
                        {/* <p className="date-card-text">{date.date}</p> */}
                        <ReactTimeAgo timeStyle="twitter" date={date.date} className="date-card-text"/>
                        <p className="date-card-text">Notes: {date.notes}</p>
                        
                        <div className="date-card-buttons-container">
                            <EditButton onClick={() => handleEditClick(date.id)} className="date-card-button"/>
                            <DeleteButton onClick={() => handleDeleteClick(date.id)}className="date-card-button"/>
                        </div>
                    </div>
                )
            }) : <></>
    
    return(
        <>
            <div id="date-cards-container">
                { so ?
                    <h1 id="your-dates-with">Your Dates with {so.full_name}</h1> : <></>
                }
                {renderDates}
            </div>

            <Modal show={showDeleteModal} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Confirm Delete
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this date?</p>
                </Modal.Body>
            
                <Modal.Footer>
                    <button onClick={() => handleCancel()}>Cancel</button>
                    <button onClick={() => handleDelete()}>Confirm</button>
                </Modal.Footer>
            </Modal>

            <EditDateModal
                showEditModal={showEditModal}
                targetPost={targetPost}
                handleCancel={handleCancel}
            />

            <div onClick={() => navigate("/relationship-board")} id="go-back-from-dates">
                <GoBackButton onClick={() => navigate("/relationship-board")}/>
                <h1 onClick={() => navigate("/relationship-board")}>Go Back</h1>
            </div>
        </>
    );
};

export default DatePage;