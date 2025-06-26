import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CheckCircle, XCircle, Download } from "lucide-react";
import Sidebar from "./components/slidebar";
import defaultimage from "./Assets/ProfilePicture.jpg";
import { auth, db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./App.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardHome = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState(defaultimage);
  const [totalUsers, setTotalUsers] = useState(0);
  const [orgUsers, setOrgUsers] = useState(0);
  const [declinedRequests, setDeclinedRequests] = useState(0);
  const [approvedRequests, setApprovedRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  // Cache duration - 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setDisplayName(
          currentUser.displayName || currentUser.email?.split("@")[0]
        );
        setPhotoURL(currentUser.photoURL || defaultimage);
      }
    });

    const now = Date.now();
    if (now - lastFetchTime > CACHE_DURATION) {
      fetchCounts();
      setLastFetchTime(now);
    }

    return () => unsubscribe();
  }, [lastFetchTime]);

  const fetchCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Execute all queries in parallel
      const [visitorSnap, orgSnap, declinedSnap, approvedSnap] =
        await Promise.all([
          getDocs(
            query(collection(db, "users"), where("role", "==", "visitor"))
          ),
          getDocs(
            query(collection(db, "users"), where("role", "==", "organizer"))
          ),
          getDocs(
            query(
              collection(db, "requestforanmap"),
              where("status", "==", "declined")
            )
          ),
          getDocs(
            query(
              collection(db, "requestforanmap"),
              where("status", "==", "accepted")
            )
          ),
        ]);

      const validVisitors = visitorSnap.docs.filter(
        (doc) => doc.data().username
      );

      setTotalUsers(validVisitors.length);
      setOrgUsers(orgSnap.size);
      setDeclinedRequests(declinedSnap.size);
      setApprovedRequests(approvedSnap.size);
    } catch (err) {
      console.error("Firestore error:", err);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  ///barchart Data to show the users
  const barChartData = {
    labels: ["Visitors", "Organizers", "Declined", "Approved"],
    datasets: [
      {
        label: "Count",
        data: [totalUsers, orgUsers, declinedRequests, approvedRequests],
        backgroundColor: ["#4fc3f7", "#1a237e", "#f44336", "#66bb6a"],
        borderRadius: 4,
        barThickness: 30,
      },
    ],
  };

  const pieChartData = {
    labels: ["Visitors", "Organizers"],
    datasets: [
      {
        data: [totalUsers, orgUsers],
        backgroundColor: ["#4fc3f7", "#1a237e"],
        borderWidth: 0,
      },
    ],
  };

  const handleExportCSV = () => {
    const headers = ["Metric", "Count"];
    const data = [
      ["Total Visitors", totalUsers],
      ["Organizers", orgUsers],
      ["Declined Requests", declinedRequests],
      ["Approved Requests", approvedRequests],
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    data.forEach((row) => {
      csvContent += row.map((item) => `"${item}"`).join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleRefresh = () => {
    fetchCounts();
    setLastFetchTime(Date.now());
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <Sidebar handleLogout={handleLogout} />

      <div className="flex-grow-1 p-4 bg-light">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center bg-white shadow-sm p-3 rounded mb-4">
          <div>
            <h4 className="fw-bold text-dark mb-0">Dashboard </h4>
            {error && (
              <div className="alert alert-danger py-1 mt-2 mb-0">
                {error}
                <button onClick={handleRefresh} className="btn ">
                  Retry
                </button>
              </div>
            )}
          </div>
          <div className="d-flex align-items-center">
            <span className="me-3 text-dark fw-medium">{displayName}</span>
            <img
              src={photoURL}
              alt="User"
              className="rounded-circle border border-white shadow-sm"
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />
          </div>
        </header>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="row g-3 mb-4">
              <StatCard
                title="Visitors"
                icon={<Users size={20} />}
                count={totalUsers}
                color="bg-info-subtle"
                textColor="text-info"
                borderColor="border-info"
              />
              <StatCard
                title="Organizers"
                icon={<Users size={20} />}
                count={orgUsers}
                color="bg-primary-subtle"
                textColor="text-primary"
                borderColor="border-primary"
              />
              <StatCard
                title="Declined Requests"
                icon={<XCircle size={20} />}
                count={declinedRequests}
                color="bg-danger-subtle"
                textColor="text-danger"
                borderColor="border-danger"
              />
              <StatCard
                title="Approved Requests"
                icon={<CheckCircle size={20} />}
                count={approvedRequests}
                color="bg-success-subtle"
                textColor="text-success"
                borderColor="border-success"
              />
            </div>

            {/* Analytics Section */}
            <div className="row g-4 mb-4">
              <div className="col-md-8">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-semibold text-secondary mb-0">
                        Activity Summary
                      </h6>
                      <button
                        onClick={handleRefresh}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Refresh Data
                      </button>
                    </div>
                    <div style={{ height: 250 }}>
                      <Bar
                        data={barChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                precision: 0,
                                stepSize: 1,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6 className="fw-semibold text-secondary mb-3">
                      User Distribution
                    </h6>
                    <div style={{ height: 250 }}>
                      <Pie
                        data={pieChartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="text-end">
              <button
                onClick={handleExportCSV}
                className="btn btn-outline-dark"
              >
                <Download size={16} className="me-2" /> Export as CSV
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, icon, count, color, textColor, borderColor }) => (
  <div className="col-6 col-md-3">
    <div
      className={`card ${color} border ${borderColor} rounded shadow-sm h-100`}
    >
      <div className="card-body d-flex flex-column justify-content-between">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className={`p-2 rounded ${textColor}`}>{icon}</div>
          <small className={textColor}>{title}</small>
        </div>
        <h3 className="fw-bold text-dark">{count}</h3>
      </div>
    </div>
  </div>
);

export default DashboardHome;
