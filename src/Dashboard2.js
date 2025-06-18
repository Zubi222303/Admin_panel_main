// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { LayoutGrid, Users, FileText, Bell, Eye, LogOut } from "lucide-react";
// import logo from "../src/Assets/Logowhite.png"; // Your logo path
// import { auth } from "./firebase";
// import "./App.css";
// import defaultimage from "./Assets/ProfilePicture.jpg";

// const Dashboard2 = ({ children }) => {
//   const navigate = useNavigate();
//   const user = auth.currentUser;
//   const emailed = user?.email || "guest@example.com"; // Handle null case
//   const usernamefromemail = emailed.substring(0, emailed.indexOf("@"));

//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error.message);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100">
//       <div className="row h-100">
//         {/* Sidebar */}
//         <nav
//           className="col-md-3 col-lg-2 d-md-block text-white p-3 vh-100"
//           style={{ backgroundColor: "#044EB0" }}
//         >
//           <div className="text-center mb-3">
//             <img
//               src={logo}
//               alt="Logo"
//               className="img-fluid"
//               style={{ maxWidth: "100px" }}
//             />
//           </div>
//           <ul className="nav flex-column">
//             <li className="nav-item mb-3">
//               <NavLink
//                 to="/dashboard"
//                 className={({ isActive }) =>
//                   `nav-link text-white p-2 rounded hover-bg ${
//                     isActive ? "active-nav" : ""
//                   }`
//                 }
//               >
//                 <LayoutGrid className="me-2" size={20} /> Dashboard
//               </NavLink>
//             </li>
//             <li className="nav-item mb-3">
//               <NavLink
//                 to="/users"
//                 className={({ isActive }) =>
//                   `nav-link text-white p-2 rounded hover-bg ${
//                     isActive ? "active-nav" : ""
//                   }`
//                 }
//               >
//                 <Users className="me-2" size={20} /> Users
//               </NavLink>
//             </li>
//             <li className="nav-item mb-3">
//               <NavLink
//                 to="/form-submissions"
//                 className={({ isActive }) =>
//                   `nav-link text-white p-2 rounded hover-bg ${
//                     isActive ? "active-nav" : ""
//                   }`
//                 }
//               >
//                 <FileText className="me-2" size={20} /> Form Submissions
//               </NavLink>
//             </li>
//             <li className="nav-item mb-3">
//               <NavLink
//                 to="/notifications"
//                 className={({ isActive }) =>
//                   `nav-link text-white p-2 rounded hover-bg ${
//                     isActive ? "active-nav" : ""
//                   }`
//                 }
//               >
//                 <Bell className="me-2" size={20} /> Notifications
//               </NavLink>
//             </li>
//             <li className="nav-item mb-3">
//               <NavLink
//                 to="/track-visitors"
//                 className={({ isActive }) =>
//                   `nav-link text-white p-2 rounded hover-bg ${
//                     isActive ? "active-nav" : ""
//                   }`
//                 }
//               >
//                 <Eye className="me-2" size={20} /> Track Visitors
//               </NavLink>
//             </li>
//           </ul>
//           <div className="mt-auto mb-2">
//             <button className="btn btn-danger w-100" onClick={handleLogout}>
//               <LogOut className="me-2" size={20} /> Logout
//             </button>
//           </div>
//         </nav>

//         {/* Main Content */}
//         <main className="col-md-9 col-lg-10 p-4 bg-light">
//           {/* Header */}
//           <header className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm rounded">
//             <h1 className="h4 fw-bold text-dark">
//               Welcome Back{" "}
//               <span style={{ color: "#044EB0", textTransform: "capitalize" }}>
//                 {usernamefromemail}
//               </span>
//             </h1>
//             <div className="d-flex align-items-center">
//               <p className="fw-regular text-dark">{usernamefromemail}</p>
//               <img
//                 src={user?.photoURL ? user.photoURL : defaultimage}
//                 alt="User Profile"
//                 className="rounded-circle border"
//                 style={{ width: "40px", height: "40px", objectFit: "cover" }}
//               />
//             </div>
//           </header>

//           {/* Render Children (Users List) */}
//           <div className="mt-4">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard2;
