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
//import { sendNotification } from "../backend/notification";

const ManageRequests = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalData, setModalData] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      // Update the building request status to "approved" in Firestore
      const buildingRef = doc(db, "requestforanmap", building.id);
      await updateDoc(buildingRef, { status: "approved" });

      // Get user document by ID to retrieve their FCM token and other details
      const userRef = doc(db, "users", building.userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User document not found");
      }

      const userData = userSnap.data();
      const userEmail = userData.email;
      const userName = userData.username;

      // Check if fcmToken exists
      if (!userData.fcmToken) {
        throw new Error("No FCM token found for user");
      }

      const fcmToken = userData.fcmToken;

      // Send Push Notification to the user

      // Send an email to the user about the approval
      if (userEmail) {
        await sendApprovalEmail(userEmail, userName);
      }

      // Optionally log that the request was approved successfully
      console.log("Request approved and notifications sent");
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
        const emailSent = await sendDeclineEmail(
          userEmail,
          building.buildingName
        );
        if (!emailSent) {
          throw new Error("Email failed to send");
        }
      } else {
        throw new Error("User email not found");
      }
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
