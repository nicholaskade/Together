import Modal from "react-bootstrap/Modal";
import { useEffect, useRef } from "react";

function ConfirmationModal({
  showConfirmationModal,
  setShowConfirmationModal,
  dateCoords,
  setMap,
  handleSubmitDate,
  setShowDateModal,
}) {
  useEffect(() => {
    if (ref.current && dateCoords !== undefined) {
      setMap(
        new window.google.maps.Map(ref.current, {
          zoom: 16,
          center: dateCoords,
        })
      );
    }
  }, [dateCoords]);

  const ref = useRef(null);

  function handleConfirmationCancel() {
    setShowConfirmationModal(false);
    setShowDateModal(true);
  }

  return (
    <Modal show={showConfirmationModal} onHide={handleConfirmationCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Is this the correct location for your date?</p>
        <div id="google-map" className="confirmation-map" ref={ref} />
      </Modal.Body>
      <Modal.Footer>
        <button className="together-button" onClick={() => handleConfirmationCancel()}>Go Back</button>
        <button className="together-button" onClick={() => handleSubmitDate()}>Confirm</button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
