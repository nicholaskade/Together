import { useEffect, useState } from "react";
import { useUser } from "./context/UserContext";
import { useSelectedUser } from "./context/SelectedUserContext";
import Modal from "react-bootstrap/Modal";
import EditDateModal from "./EditDateModal";
import { useDates, useDatesDispatch } from "./context/DatesContext";

function Marker({
    map
}) {
    
    const uid = useUser().id;
    const so_uid = useSelectedUser().selectedUser;
    const [errors, setErrors] = useState([]);
    const dates = useDates().dates;
    const datesDispatch = useDatesDispatch();

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
        })
    }, []);

    const editButton = document.getElementById('edit-date-button');
    const deleteButton = document.getElementById('delete-date-button');

    const [targetPost, setTargetPost] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    function handleCancel() {
        setTargetPost(null);
        setShowDeleteModal(false);
        setShowEditModal(false); 
    };


    const renderMarkers = 
        dates ?
            dates.map((date) => {
                const content = 
                    `
                    <div class="info-window">
                        <h6>${date.name}</h6>
                        <p>${date.date}</p>
                        <p>Notes: ${date.notes}<p>
                        <button value=${date.id} id="edit-date-button">edit</button>
                        <button value=${date.id} id="delete-date-button">delete</button>
                    </div>
                    `

                const marker = new window.google.maps.Marker({
                    position: JSON.parse(date.location),
                    map: map
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: content,
                    ariaLabel: `${date.name}`
                });

                marker.addListener("click", () => {
                    infoWindow.open({
                        anchor: marker,
                        map,
                    });
                });
            })
                :
                    <></>

        const renderDeleteEventListeners = 
            deleteButton ?
                deleteButton.addEventListener("click", (e) => {
                    setShowDeleteModal(true);
                    setTargetPost(e.target.value);
                    console.log("Hello from delete!")
                }) : <></>
        
        const renderEditEventListeners =
                editButton ?
                    editButton.addEventListener("click", (e) => {
                        setShowEditModal(true);
                        setTargetPost(e.target.value);
                        console.log("Hello from edit!")
                    }) : <></>
    return (
        <>
            
            {renderMarkers}
            {renderDeleteEventListeners}
            {renderEditEventListeners}

            <Modal show={showDeleteModal} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Confirm Delete
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this post?</p>
                </Modal.Body>
            
                <Modal.Footer>
                    <button onClick={() => handleCancel()}>Cancel</button>
                    <button onClick={() => console.log("Confirmed")}>Confirm</button>
                </Modal.Footer>
            </Modal>

            <EditDateModal
                showEditModal={showEditModal}
                targetPost={targetPost}
                handleCancel={handleCancel}

            />

        </>
    );

};

export default Marker;