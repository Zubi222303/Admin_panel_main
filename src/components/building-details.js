// import { Modal, Button } from "react-bootstrap";
// import { FaSpinner } from "react-icons/fa";

// const styles = {
//   modalHeader: {
//     background: "linear-gradient(135deg, #044EB0 0%, #007BFF 100%)",
//     color: "white",
//   },
//   modalFooter: {
//     background: "#f8f9fa",
//     justifyContent: "space-between",
//   },
// };

// const BuildingDetailsModal = ({
//   show,
//   onHide,
//   building,
//   onAccept,
//   onDecline,
//   loading,
// }) => {
//   return (
//     <Modal show={show} onHide={onHide} size="lg" centered>
//       <Modal.Header closeButton style={styles.modalHeader}>
//         <Modal.Title style={{ color: "white" }}>Building Details</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {building && (
//           <>
//             <div className="row mb-4">
//               <div className="col-md-6">
//                 <p>
//                   <strong>Building Name:</strong> {building.buildingName}
//                 </p>
//                 <p>
//                   <strong>City:</strong> {building.city}
//                 </p>
//                 <p>
//                   <strong>Street Address:</strong> {building.streetAddress}
//                 </p>
//                 <p>
//                   <strong>Number of Floors:</strong> {building.numFloors}
//                 </p>
//               </div>
//               <div className="col-md-6">
//                 <p>
//                   <strong>Owner Name:</strong> {building.ownerName}
//                 </p>
//                 <p>
//                   <strong>Owner Email:</strong> {building.ownerEmail}
//                 </p>
//                 <p>
//                   <strong>Contact Number:</strong> {building.contactNumber}
//                 </p>
//                 <p>
//                   <strong>Created At:</strong> {building.createdAt}
//                 </p>
//               </div>
//             </div>

//             <p className="mt-3">
//               <strong>Floor Plans:</strong>
//             </p>
//             {building.floorPlans.length > 0 ? (
//               building.floorPlans.map((floorPlan, index) => (
//                 <div key={index} className="pdf-container mb-3">
//                   <iframe
//                     src={floorPlan}
//                     width="100%"
//                     height="400"
//                     title={`Floor Plan ${index + 1}`}
//                     className="pdf-iframe"
//                     scrolling="no"
//                   ></iframe>
//                 </div>
//               ))
//             ) : (
//               <p>No floor plans available</p>
//             )}
//           </>
//         )}
//       </Modal.Body>
//       <Modal.Footer style={styles.modalFooter}>
//         {building?.status === "pending" && (
//           <>
//             <Button
//               variant="danger"
//               onClick={() => onDecline(building)}
//               disabled={loading}
//             >
//               {loading ? <FaSpinner className="spinner" /> : "Decline"}
//             </Button>
//             <Button
//               variant="success"
//               onClick={() => onAccept(building)}
//               disabled={loading}
//             >
//               {loading ? <FaSpinner className="spinner" /> : "Accept"}
//             </Button>
//           </>
//         )}
//         <Button variant="secondary" onClick={onHide}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default BuildingDetailsModal;

import { Modal, Button } from "react-bootstrap";
import {
  FaSpinner,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";
import "./BuildingDetailsModal.css";

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
      <Modal.Header closeButton className="custom-modal-header">
        <Modal.Title>🏢 Building Details</Modal.Title>
      </Modal.Header>

      <Modal.Body className="custom-modal-body">
        {building ? (
          <>
            <div className="info-grid">
              <div className="info-section card-style">
                <h5 className="section-title">🏗 Building Info</h5>
                <Info label="Building Name" value={building.buildingName} />
                <Info
                  label="City"
                  value={building.city}
                  icon={<FaMapMarkerAlt />}
                />
                <Info label="Street Address" value={building.streetAddress} />
                <Info label="Number of Floors" value={building.numFloors} />
              </div>
              <div className="info-section card-style">
                <h5 className="section-title">👤 Owner Info</h5>
                <Info
                  label="Owner Name"
                  value={building.ownerName}
                  icon={<FaUser />}
                />
                <Info
                  label="Email"
                  value={building.ownerEmail}
                  icon={<FaEnvelope />}
                />
                <Info
                  label="Phone"
                  value={building.contactNumber}
                  icon={<FaPhone />}
                />
                <Info
                  label="Created At"
                  value={building.createdAt}
                  icon={<FaCalendarAlt />}
                />
              </div>
            </div>

            <div className="card-style mt-4">
              <h5 className="section-title">📄 Floor Plans</h5>
              {building.floorPlans?.length > 0 ? (
                building.floorPlans.map((url, index) => (
                  <div key={index} className="pdf-container mb-3">
                    <iframe
                      src={url}
                      title={`Floor Plan ${index + 1}`}
                      className="pdf-iframe"
                      width="100%"
                      height="400"
                    ></iframe>
                  </div>
                ))
              ) : (
                <p className="text-muted">No floor plans available.</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-muted">Loading building data...</p>
        )}
      </Modal.Body>

      <Modal.Footer className="custom-modal-footer">
        {building?.status === "pending" && (
          <>
            <Button
              variant="danger"
              onClick={() => onDecline(building)}
              disabled={loading}
              className="action-btn"
            >
              {loading ? <FaSpinner className="spinner-icon" /> : "Decline"}
            </Button>
            <Button
              variant="success"
              onClick={() => onAccept(building)}
              disabled={loading}
              className="action-btn"
            >
              {loading ? <FaSpinner className="spinner-icon" /> : "Accept"}
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

const Info = ({ label, value, icon }) => (
  <p className="info-line">
    {icon && <span className="info-icon">{icon}</span>}
    <strong>{label}:</strong> <span className="text-dark ms-1">{value}</span>
  </p>
);

export default BuildingDetailsModal;
