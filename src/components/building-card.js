import { FaTrash, FaSpinner, FaRegCalendarAlt } from "react-icons/fa";

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    height: "auto",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s",
    maxWidth: "300px",
  },
  cardHeader: {
    background: "linear-gradient(135deg, #044EB0 0%, #007BFF 100%)",
    padding: "8px 12px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buildingName: {
    fontWeight: "bold",
    fontSize: "14px",
    margin: 0,
    color: "white",
  },
  statusBadge: {
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "10px",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginLeft: "8px",
  },
  deleteButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
    marginLeft: "8px",
    padding: "2px",
  },
  statusPending: {
    backgroundColor: "#FFC107",
    color: "#000",
  },
  statusApproved: {
    backgroundColor: "#28A745",
    color: "#fff",
  },
  statusDeclined: {
    backgroundColor: "#DC3545",
    color: "#fff",
  },
  cardBody: {
    flex: 1,
    padding: 0,
    cursor: "pointer",
  },
  pdfPreview: {
    width: "100%",
    height: "100px",
    backgroundColor: "#f8f9fa",
    overflow: "hidden",
  },
  cardFooter: {
    background: "linear-gradient(135deg, #044EB0 0%, #007BFF 100%)",
    padding: "4px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerInfoRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  dateIcon: {
    color: "white",
    fontSize: "14px",
  },
  footerLeft: {
    display: "flex",
    alignItems: "center",
  },
  footerInfo: {
    display: "flex",
    flexDirection: "column",
  },
  infoText: {
    color: "white",
    fontSize: "10px",
  },
};

const BuildingCard = ({ building, onClick, onDelete, loading }) => {
  return (
    <div className="card" style={styles.card}>
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <h5 style={styles.buildingName}>{building.buildingName}</h5>
        <div>
          <span
            style={{
              ...styles.statusBadge,
              ...(building.status === "approved"
                ? styles.statusApproved
                : building.status === "declined"
                ? styles.statusDeclined
                : styles.statusPending),
            }}
          >
            {building.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={styles.cardBody} onClick={() => onClick(building)}>
        {building.floorPlans && building.floorPlans.length > 0 && (
          <div style={styles.pdfPreview}>
            <iframe
              src={building.floorPlans[0]}
              width="100%"
              height="100"
              title="Building Floor Plan"
              style={{
                border: "none",
                overflow: "hidden",
              }}
            ></iframe>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div style={styles.cardFooter} onClick={() => onClick(building)}>
        <div style={styles.footerInfoRow}>
          <FaRegCalendarAlt style={styles.dateIcon} />
          <small style={styles.infoText}>{building.createdAt}</small>
        </div>
        <div style={styles.footerLeft}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(building);
            }}
            style={styles.deleteButton}
            title="Delete Request"
            disabled={loading}
          >
            {loading ? <FaSpinner className="spinner" /> : <FaTrash />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildingCard;
