import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendApprovalEmail, sendDeclineEmail } from "./emailservice";
import Sidebar from "./components/slidebar";
import BuildingCard from "./components/building-card";
import BuildingDetailsModal from "./components/building-details";
import "./App.css";

const ManageRequests = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // OneSignal notification function
  const sendOneSignalNotification = async (message, heading) => {
    const payload = {
      app_id: "bc188d2c-60cb-4bca-8e15-07a23c0e4bde",
      contents: { en: message },
      headings: { en: heading },
      included_segments: ["All"],
    };

    try {
      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization:
              "Basic os_v2_app_xqmi2ldaznf4vdqva6rdydsl32wpoxdkx2zuypfzh4enjmpeivo3ernm3kwnrpeuecrxu2n2kihddyocrw5s7qtzy5uie2tso4ufo3y",
          },
          body: JSON.stringify(payload),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  };

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, "requestforanmap"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const buildingData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            buildingName: data.buildingInfo?.buildingName || "N/A",
            city: data.buildingInfo?.city || "N/A",
            numFloors: data.buildingInfo?.numFloors || "N/A",
            streetAddress: data.buildingInfo?.streetAddress || "N/A",
            ownerName: data.ownerInfo?.ownerName || "N/A",
            ownerEmail: data.ownerInfo?.ownerEmail || "N/A",
            contactNumber: data.ownerInfo?.contactNumber || "N/A",
            userId: data.userId,
            status: data.status || "pending",
            createdAt: data.createdAt
              ? new Date(data.createdAt.seconds * 1000).toLocaleString()
              : "N/A",
            floorPlans: data.floorPlans || [],
          };
        });
        setBuildings(buildingData);
        setError(null);
      } catch (err) {
        setError("Failed to load building data");
        console.error("Error processing building data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
      setError("Logout failed. Please try again.");
    }
  };

  const handleBuildingClick = useCallback((building) => {
    setModalData(building);
  }, []);

  const closeModal = useCallback(() => {
    setModalData(null);
  }, []);

  const filteredBuildings = buildings.filter((building) =>
    [
      building.buildingName,
      building.city,
      building.ownerName,
      building.ownerEmail,
      building.streetAddress,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAcceptRequest = async (building) => {
    try {
      setLoading(true);
      const buildingRef = doc(db, "requestforanmap", building.id);
      await updateDoc(buildingRef, { status: "approved" });

      const userRef = doc(db, "users", building.userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User document not found");
      }

      const userData = userSnap.data();
      const userEmail = userData.email;
      const userName = userData.username;

      if (userEmail) {
        await sendApprovalEmail(userEmail, userName);
      }

      // Send broadcast notification
      await sendOneSignalNotification(
        `Building "${building.buildingName}" has been approved`,
        "New Building Approved"
      );

      setSuccessMessage("Request approved successfully!");
      closeModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error approving request:", error);
      setError(error.message || "Error approving request");
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRequest = async (building) => {
    try {
      setLoading(true);
      const buildingRef = doc(db, "requestforanmap", building.id);
      await updateDoc(buildingRef, { status: "declined" });

      const userRef = doc(db, "users", building.userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User document not found");
      }

      const userData = userSnap.data();
      const userEmail = userData.email;

      if (userEmail) {
        await sendDeclineEmail(userEmail, building.buildingName);
      }

      // Send broadcast notification
      await sendOneSignalNotification(
        `Building "${building.buildingName}" request has been declined`,
        "Building Request Declined"
      );

      setSuccessMessage("Request declined successfully!");
      closeModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error declining request:", error);
      setError(error.message || "Error declining request");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (building) => {
    try {
      if (
        window.confirm(
          "Are you sure you want to delete this request? This action cannot be undone."
        )
      ) {
        setLoading(true);
        await deleteDoc(doc(db, "requestforanmap", building.id));
        setSuccessMessage("Request deleted successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      setError("Error deleting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <Sidebar handleLogout={handleLogout} />
      <div className="container mt-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3 shadow p-3 bg-white rounded">
          <h2 className="mb-0 d-flex align-items-center manage-heading">
            <FileText
              style={{ color: "#044EB0" }}
              className="me-3 fw-bold manage-heading"
              size={30}
            />
            Building Requests
          </h2>
          <div className="d-flex align-items-center">
            <span
              className="input-group-text cursor-pointer"
              onClick={() => setSearchVisible(!searchVisible)}
            >
              <FaSearch />
            </span>
            {searchVisible && (
              <input
                type="text"
                className="form-control"
                placeholder="Search buildings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search buildings"
              />
            )}
          </div>
        </div>

        <div className="row">
          {loading && buildings.length === 0 ? (
            <div className="col-12 text-center">
              <FaSpinner className="spinner" size={24} />
              <p>Loading buildings...</p>
            </div>
          ) : filteredBuildings.length > 0 ? (
            filteredBuildings.map((building) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={building.id}>
                <BuildingCard
                  building={building}
                  onClick={handleBuildingClick}
                  onDelete={handleDeleteRequest}
                  loading={loading}
                />
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-center">No buildings found</p>
            </div>
          )}
        </div>
      </div>

      <BuildingDetailsModal
        show={!!modalData}
        onHide={closeModal}
        building={modalData}
        onAccept={handleAcceptRequest}
        onDecline={handleDeclineRequest}
        loading={loading}
      />
    </div>
  );
};

export default ManageRequests;
