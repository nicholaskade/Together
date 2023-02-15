import { useEffect, useState } from "react"; 
import Modal from "react-bootstrap/Modal";


function EditDateModal({
    showEditModal,
    targetPost,
    handleCancel,

}) {

    const [dateName, setDateName] = useState("");
    const [dateAddress, setDateAddress] = useState("");
    const [dateDate, setDateDate] = useState(null);
    const [dateNotes, setDateNotes] = useState("");
    
    return(
        <>
            <Modal show={showEditModal} onHide={handleCancel}>
                <Modal.Header closeButton></Modal.Header>
                
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
                    <button onClick={() => console.log("Confirmed")}>Confirm</button>
                </Modal.Footer>
            </Modal>
        </>
    )
};

export default EditDateModal;