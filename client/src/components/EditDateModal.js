import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useDatesDispatch } from "./context/DatesContext";

function EditDateModal({ showEditModal, targetPost, handleCancel }) {
  useEffect(() => {
    if (targetPost) {
      fetch(`/outings/${targetPost}`).then((res) => {
        if (res.ok) {
          res.json().then((outing) => {
            setDateName(outing.name);
            setDateDate(outing.date);
            setDateNotes(outing.notes);
          });
        } else {
          res.json().then((errors) => setErrors(errors));
        }
      });
    }
  }, [targetPost]);

  function handleSubmitEdits() {
    const updatedDate = {
      name: dateName,
      date: dateDate,
      notes: dateNotes,
    };

    const patchRequest = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDate),
    };

    fetch(`/outings/${targetPost}`, patchRequest).then((res) => {
      if (res.ok) {
        res.json().then((outing) =>
          datesDispatch({
            type: "update",
            date: outing,
          })
        );
      } else {
        res.json().then((errors) => setErrors(errors));
      }
    });
    handleCancelEdit();
  }

  function handleCancelEdit() {
    setDateDate(null);
    setDateName("");
    setDateNotes("");
    handleCancel();
  }

  const [dateName, setDateName] = useState("");
  const [dateDate, setDateDate] = useState(new Date());
  const [dateNotes, setDateNotes] = useState("");
  const datesDispatch = useDatesDispatch();

  const [errors, setErrors] = useState([]);

  return (
    <>
      <Modal show={showEditModal} onHide={handleCancel}>
        <Modal.Header closeButton></Modal.Header>

        <Modal.Body>
          <form>
            <label>Date Label:</label>
            <input
              type="text"
              value={dateName}
              onChange={(e) => setDateName(e.target.value)}
            />

            <label>Date:</label>
            <input
              type="date"
              value={dateDate}
              onChange={(e) => setDateDate(e.target.value)}
            />

            <label>Notes:</label>
            <textarea
              cols="10"
              maxLength="500"
              onChange={(e) => setDateNotes(e.target.value)}
              value={dateNotes}
            />
            <p>Max input: 500 chars</p>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <button className="together-button" onClick={() => handleCancelEdit()}>Cancel</button>
          <button className="together-button" onClick={() => handleSubmitEdits()}>Confirm</button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditDateModal;
