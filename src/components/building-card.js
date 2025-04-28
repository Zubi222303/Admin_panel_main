import { FaTrash, FaSpinner, FaRegCalendarAlt } from "react-icons/fa";

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s",
    ":hover": {
      transform: "translateY(-5px)",
    },
  },
  cardHeader: {
    background: "linear-gradient(135deg, #044EB0 0%, #007BFF 100%)",
    padding: "15px 16px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buildingName: {
    fontWeight: "bold",
    fontSize: "16px",
    margin: 0,
    color: "white",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginLeft: "8px",
  },
  deleteButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
    marginLeft: "8px",
    padding: "4px",
    ":hover": {
      color: "#ffcccc",
    },
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
    height: "150px",
    backgroundColor: "#f8f9fa",
    overflow: "hidden",
  },
  cardFooter: {
    // background: "linear-gradient(#020024,#090979,#00D4FF 100%)",
    background: "linear-gradient(135deg, #044EB0 0%, #007BFF 100%)",

    padding: "4px 16px",
    borderTop: "1px solid #eee",
    cursor: "pointer",
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
    fontSize: "18px",
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
    fontSize: "12px",
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
              width="110%"
              height="210"
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
