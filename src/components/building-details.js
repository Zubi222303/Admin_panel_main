import { Modal, Button } from "react-bootstrap";
import { FaSpinner } from "react-icons/fa";

const styles = {
  modalHeader: {
    background: "linear-gradient(135deg, #044EB0 0%, #007BFF 100%)",
    color: "white",
  },
  modalFooter: {
    background: "#f8f9fa",
    justifyContent: "space-between",
  },
};

const BuildingDetailsModal = ({
  show,
  onHide,
  building,
  onAccept,
  onDecline,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton style={styles.modalHeader}>
        <Modal.Title style={{ color: "white" }}>Building Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {building && (
          <>
            <div className="row mb-4">
              <div className="col-md-6">
                <p>
                  <strong>Building Name:</strong> {building.buildingName}
                </p>
                <p>
                  <strong>City:</strong> {building.city}
                </p>
                <p>
                  <strong>Street Address:</strong> {building.streetAddress}
                </p>
                <p>
                  <strong>Number of Floors:</strong> {building.numFloors}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Owner Name:</strong> {building.ownerName}
                </p>
                <p>
                  <strong>Owner Email:</strong> {building.ownerEmail}
                </p>
                <p>
                  <strong>Contact Number:</strong> {building.contactNumber}
                </p>
                <p>
                  <strong>Created At:</strong> {building.createdAt}
                </p>
              </div>
            </div>

            <p className="mt-3">
              <strong>Floor Plans:</strong>
            </p>
            {building.floorPlans.length > 0 ? (
              building.floorPlans.map((floorPlan, index) => (
                <div key={index} className="pdf-container mb-3">
                  <iframe
                    src={floorPlan}
                    width="100%"
                    height="400"
                    title={`Floor Plan ${index + 1}`}
                    className="pdf-iframe"
                    scrolling="no"
                  ></iframe>
                </div>
              ))
            ) : (
              <p>No floor plans available</p>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer style={styles.modalFooter}>
        {building?.status === "pending" && (
          <>
            <Button
              variant="danger"
              onClick={() => onDecline(building)}
              disabled={loading}
            >
              {loading ? <FaSpinner className="spinner" /> : "Decline"}
            </Button>
            <Button
              variant="success"
              onClick={() => onAccept(building)}
              disabled={loading}
            >
              {loading ? <FaSpinner className="spinner" /> : "Accept"}
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BuildingDetailsModal;