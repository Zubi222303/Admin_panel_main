import React from "react";
import { Link, useNavigate,NavLink } from "react-router-dom";
import { LayoutGrid, Map, Barcode, CheckCircle, Users, Bell, FileText, LogOut, Eye } from "lucide-react";
import logo from "../src/Assets/Logowhite.png"; // Add your logo path
import { auth } from "./firebase"; 
import "./App.css";
import defaultimage from './Assets/ProfilePicture.jpg'
const DashboardHome = () => {

  const navigate = useNavigate(); // Hook for navigation
  const user = auth.currentUser;
  const emailed = user.email;
  const usernamefromemail = emailed.substring(0, emailed.indexOf("@"));
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out user
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block  text-white p-3 vh-100" style={{backgroundColor:'#044EB0'}}>
          <div className="text-center mb-3">
            <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "100px" }} />
          </div>
          <ul className="nav flex-column">
  <li className="nav-item mb-3">
    <NavLink 
      to="/dashboard" 
      className={({ isActive }) => `nav-link text-white p-2 rounded hover-bg ${isActive ? "active-nav" : ""}`}
    >
      <LayoutGrid className="me-2" size={20} /> Dashboard
    </NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink 
      to="/profile" 
      className={({ isActive }) => `nav-link text-white p-2 rounded hover-bg ${isActive ? "active-nav" : ""}`}
    >
      <Users className="me-2" size={20} /> User Profile
    </NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink 
      to="/form-submissions" 
      className={({ isActive }) => `nav-link text-white p-2 rounded hover-bg ${isActive ? "active-nav" : ""}`}
    >
      <FileText className="me-2" size={20} /> Form Submissions
    </NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink 
      to="/notifications" 
      className={({ isActive }) => `nav-link text-white p-2 rounded hover-bg ${isActive ? "active-nav" : ""}`}
    >
      <Bell className="me-2" size={20} /> Notifications
    </NavLink>
  </li>
  <li className="nav-item mb-3">
    <NavLink 
      to="/track-visitors" 
      className={({ isActive }) => `nav-link text-white p-2 rounded hover-bg ${isActive ? "active-nav" : ""}`}
    >
      <Eye className="me-2" size={20} /> Track Visitors
    </NavLink>
  </li>
</ul>
          <div className="mt-auto mb-2">
            <button className="btn btn-danger w-100" onClick={handleLogout}>
              <LogOut className="me-2" size={20} /> Logout
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 p-4 bg-light">
          {/* Header   */}
        <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm rounded">
  {/* Welcome Text */}
  <h1 className="h4 fw-bold text-dark">
    Welcome Back 
    <span style={{ color: "#044EB0", textTransform: "capitalize" }}> {usernamefromemail}</span>
  </h1>

  {/* User Profile Image */}
  <div className="d-flex align-items-center">
  <p className=" fw-regular text-dark"> {usernamefromemail}</p>
    <img 
      src={user.photoURL ? user.photoURL : defaultimage} 
      alt="User Profile" 
      className="rounded-circle border" 
      style={{ width: "40px", height: "40px", objectFit: "cover" }}
    />
  </div>
</header>


          {/* Dashboard Cards */}
          <div className="row mt-4">
            
            {/* Total Users */}
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <Users size={40} className="text-primary me-3" />
                    <h5 className="card-title mb-0">Total Users</h5>
                  </div>
                  <p className="card-text text-muted mt-2">Manage and track all registered users.</p>
                  <Link to="/users" className="btn btn-primary w-100">View Users</Link>
                </div>
              </div>
            </div>

            {/* New Map Requests */}
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <Map size={40} className="text-success me-3" />
                    <h5 className="card-title mb-0">New Map Requests</h5>
                  </div>
                  <p className="card-text text-muted mt-2">Review and approve new building map submissions.</p>
                  <Link to="/map-requests" className="btn btn-success w-100">Manage Requests</Link>
                </div>
              </div>
            </div>

            {/* Map & POI Management */}
            <div className="col-md-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <Map size={40} className="text-info me-3" />
                    <h5 className="card-title mb-0">Map & POI Management</h5>
                  </div>
                  <p className="card-text text-muted mt-2">Manage maps and verify points of interest.</p>
                  <Link to="/maps" className="btn btn-info w-100">Manage Maps</Link>
                </div>
              </div>
            </div>

            {/* Barcode Assignment */}
            <div className="col-md-4 mt-3">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <Barcode size={40} className="text-danger me-3" />
                    <h5 className="card-title mb-0">Barcode Assignment</h5>
                  </div>
                  <p className="card-text text-muted mt-2">Generate and assign barcodes to buildings.</p>
                  <Link to="/barcodes" className="btn btn-danger w-100">Manage Barcodes</Link>
                </div>
              </div>
            </div>

            {/* Verification Workflow */}
            <div className="col-md-4 mt-3">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <CheckCircle size={40} className="text-warning me-3" />
                    <h5 className="card-title mb-0">Verification Workflow</h5>
                  </div>
                  <p className="card-text text-muted mt-2">Approve or reject submitted maps.</p>
                  <Link to="/verification" className="btn btn-warning w-100">Verify Submissions</Link>
                </div>
              </div>
            </div>

            {/* Track Visitors */}
            <div className="col-md-4 mt-3">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <Eye size={40} className="text-dark me-3" />
                    <h5 className="card-title mb-0">Track Visitors</h5>
                  </div>
                  <p className="card-text text-muted mt-2">Monitor visitor activity in your app.</p>
                  <Link to="/track-visitors" className="btn btn-dark w-100">Track Now</Link>
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
