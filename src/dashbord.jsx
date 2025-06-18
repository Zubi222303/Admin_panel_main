import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutGrid, Map, Users } from "lucide-react";
import Sidebar from "./components/slidebar";
import defaultimage from "./Assets/ProfilePicture.jpg";
import { auth } from "./firebase";
import "./App.css";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState(defaultimage);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(
          currentUser.displayName || currentUser.email?.split("@")[0]
        );
        setPhotoURL(currentUser.photoURL || defaultimage);
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
    }
  };

  async function sendOneSignalNotificationFromBrowser(
    appId,
    apiKey,
    message,
    heading,
    data,
    playerIds
  ) {
    const payload = {
      app_id: appId,
      contents: { en: message },
    };

    if (heading) payload.headings = { en: heading };
    if (data) payload.data = data;
    if (playerIds) payload.include_player_ids = playerIds;
    else payload.included_segments = ["All"];

    try {
      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Basic ${apiKey}`,
          },
          body: JSON.stringify(payload),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  return (
    <div className="container-fluid vh-100 bg-light">
      <div className="row h-100">
        <Sidebar handleLogout={handleLogout} />

        <main className="col-md-9 col-lg-10 p-4">
          <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow rounded mb-4">
            <div>
              <h4 className="fw-bold mb-1">Welcome Back,</h4>
              <span
                className="text-primary fw-semibold"
                style={{ textTransform: "capitalize" }}
              >
                {displayName}
              </span>
            </div>
            <div className="d-flex align-items-center">
              <span className="me-3">{displayName}</span>
              <img
                src={photoURL}
                alt="User"
                className="rounded-circle border"
                style={{ width: 45, height: 45, objectFit: "cover" }}
              />
            </div>
          </header>

          <div className="row g-4">
            {/* Total Users */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 hover-shadow">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <Users size={40} className="text-primary me-3" />
                    <h5 className="mb-0">Total Users</h5>
                  </div>
                  <p className="text-muted">
                    View and manage users with Student or Visitor .
                  </p>
                  <div className="d-flex gap-2">
                    <Link to="/users" className="btn btn-primary flex-grow-1">
                      View Users
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* New Map Requests */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <Map size={40} className="text-success me-3" />
                    <h5 className="mb-0">New Map Requests</h5>
                  </div>
                  <p className="text-muted">
                    Review and approve new building map submissions.
                  </p>
                  <Link to="/map-requests" className="btn btn-success w-100">
                    Manage Requests
                  </Link>
                </div>
              </div>
            </div>

            {/* Organizational Users */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <Users size={40} className="text-warning me-3" />
                    <h5 className="mb-0">Organizational Users</h5>
                  </div>
                  <p className="text-muted">
                    View and manage users with organizer roles.
                  </p>
                  <Link
                    to="/OrganizationalUser"
                    className="btn btn-warning w-100"
                  >
                    View Organizers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardHome;
