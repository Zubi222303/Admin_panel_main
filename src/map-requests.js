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
  addDoc,
  serverTimestamp,
  where,
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

  const sendOneSignalNotification = async (message, heading, options = {}) => {
    const payload = {
      app_id: "dcf7bc92-264d-445e-878e-c8ca383de55f",
      contents: { en: message },
      headings: { en: heading },
      included_segments: ["All"],
      data: {
        type: options.type || "info",
        timestamp: new Date().toISOString(),
        ...(options.url && { url: options.url }),
      },
      ...(options.url && { url: options.url }),
      ...(options.imageUrl && {
        big_picture: options.imageUrl,
        ios_attachments: { id: options.imageUrl },
      }),
      ...(options.actionButton &&
        options.actionUrl && {
          buttons: [
            {
              id: "action_button",
              text: options.actionButton,
              url: options.actionUrl,
            },
          ],
        }),
    };

    try {
      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization:
              "Basic os_v2_app_3t33zergjvcf5b4ozdfdqppfl6yo632qwdie7emcna5rctehk5cxi3f6p34n4mhb44cxjurpzbr3ebn27ooennublkbhnxergd7uzpy",
          },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.errors?.[0] || "Failed to send notification");
      return result;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  };

  const saveNotificationToDatabase = async (
    userId,
    message,
    heading,
    type = "info"
  ) => {
    try {
      const notificationData = {
        userId: userId,
        message: message,
        heading: heading,
        type: type,
        read: false,
        createdAt: serverTimestamp(),
        timestamp: new Date().toISOString(),
      };

      await addDoc(collection(db, "notifications"), notificationData);
      console.log("Notification saved to database successfully");
    } catch (error) {
      console.error("Error saving notification to database:", error);
      throw error;
    }
  };

  const sendTargetedNotification = async (
    userId,
    message,
    heading,
    options = {}
  ) => {
    try {
      // Query users collection to find document where uniqueid equals userId
      const usersQuery = query(
        collection(db, "users"),
        where("uniqueid", "==", userId)
      );
      const userSnapshot = await getDocs(usersQuery);

      if (userSnapshot.empty) {
        throw new Error("User not found");
      }

      // Get the first (and should be only) matching document
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();

      // Save notification to database first
      await saveNotificationToDatabase(userId, message, heading, options.type);

      // Send OneSignal notification - you can target by external_user_id if you have it set up
      const payload = {
        app_id: "dcf7bc92-264d-445e-878e-c8ca383de55f",
        contents: { en: message },
        headings: { en: heading },
        // Target specific user by external_user_id (if you have this set up in OneSignal)
        include_external_user_ids: [userId],
        // Fallback to all users if external_user_id is not set up
        ...(userData.oneSignalPlayerId
          ? { include_player_ids: [userData.oneSignalPlayerId] }
          : { included_segments: ["All"] }),
        data: {
          type: options.type || "info",
          timestamp: new Date().toISOString(),
          userId: userId,
          ...(options.url && { url: options.url }),
        },
        ...(options.url && { url: options.url }),
        ...(options.imageUrl && {
          big_picture: options.imageUrl,
          ios_attachments: { id: options.imageUrl },
        }),
        ...(options.actionButton &&
          options.actionUrl && {
            buttons: [
              {
                id: "action_button",
                text: options.actionButton,
                url: options.actionUrl,
              },
            ],
          }),
      };

      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization:
              "Basic os_v2_app_3t33zergjvcf5b4ozdfdqppfl6yo632qwdie7emcna5rctehk5cxi3f6p34n4mhb44cxjurpzbr3ebn27ooennublkbhnxergd7uzpy",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.errors?.[0] || "Failed to send notification");

      console.log("Targeted notification sent successfully:", result);
      return result;
    } catch (error) {
      console.error("Error sending targeted notification:", error);
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

      // Change status to "accepted" instead of "approved"
      await updateDoc(buildingRef, { status: "accepted" });

      // Query users collection to find document where uniqueid equals building.userId
      const usersQuery = query(
        collection(db, "users"),
        where("uniqueid", "==", building.userId)
      );
      const userSnapshot = await getDocs(usersQuery);

      if (userSnapshot.empty) {
        throw new Error("User document not found");
      }

      // Get the first (and should be only) matching document
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      const userEmail = userData.email;
      const userName = userData.username;

      // Send email notification
      if (userEmail) await sendApprovalEmail(userEmail, userName);

      // Send targeted notification to specific user
      await sendTargetedNotification(
        building.userId,
        `Your building request "${building.buildingName}" has been accepted! our team will connect with you via email.`,
        "Building Request Accepted",
        {
          type: "approval",
          url: `https://yourdomain.com/buildings/${building.id}`,
          imageUrl: "https://yourdomain.com/images/approved-banner.jpg",
          actionButton: "View Details",
          actionUrl: `https://yourdomain.com/buildings/${building.id}`,
        }
      );

      setSuccessMessage("Request accepted successfully and notification sent!");
      closeModal();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error accepting request:", error);
      setError(error.message || "Error accepting request");
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineRequest = async (building) => {
    try {
      setLoading(true);
      const buildingRef = doc(db, "requestforanmap", building.id);
      await updateDoc(buildingRef, { status: "declined" });

      // Query users collection to find document where uniqueid equals building.userId
      const usersQuery = query(
        collection(db, "users"),
        where("uniqueid", "==", building.userId)
      );
      const userSnapshot = await getDocs(usersQuery);

      if (userSnapshot.empty) {
        throw new Error("User document not found");
      }

      // Get the first (and should be only) matching document
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      const userEmail = userData.email;

      // Send email notification
      if (userEmail) await sendDeclineEmail(userEmail, building.buildingName);

      // Send targeted notification to specific user
      await sendTargetedNotification(
        building.userId,
        `Your building request "${building.buildingName}" has been declined. Please review the requirements and submit a new request if needed.`,
        "Building Request Declined",
        {
          type: "decline",
        }
      );

      setSuccessMessage("Request declined successfully and notification sent!");
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
