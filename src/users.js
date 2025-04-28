import { useEffect, useState } from "react";
//import { collection, getDocs } from "firebase/firestore";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
//import { FaSearch } from "react-icons/fa";
import { useNavigate, NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users as UsersIcon,
  FileText,
  Bell,
  Eye,
  LogOut,
} from "lucide-react";
import logo from "../src/Assets/Logowhite.png";
import { FaSearch, FaTrash } from "react-icons/fa";
import defaultimage from "./Assets/ProfilePicture.jpg";
const Users = () => {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  }
  const handleRemoveUser = async (userId) => {
    try {
      // Delete the user document from Firestore
      await deleteDoc(doc(db, "users", userId));

      // Update the local state to remove the user
      setUsers(users.filter((user) => user.id !== userId));
      alert("User removed successfully!");
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user.");
    }
  };
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (user) => user.username && user.role?.toLowerCase() !== "admin"
          );

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const lowercasedSearch = searchTerm.toLowerCase();

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(lowercasedSearch) ||
      user.name?.toLowerCase().includes(lowercasedSearch) ||
      user.email?.toLowerCase().includes(lowercasedSearch)
  );

  return (
    <div className="d-flex flex-column flex-md-row">
      <nav
        className="col-md-3 col-lg-2 d-md-block text-white p-3 manage-nav vh-100"
        style={{ backgroundColor: "#044EB0" }}
      >
        <div className="text-center mb-3">
          <img
            src={logo}
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "100px" }}
          />
        </div>
        <ul className="nav flex-column">
          <li className="nav-item mb-3">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link text-white p-2 rounded ${
                  isActive ? "active-nav" : ""
                }`
              }
            >
              <LayoutGrid className="me-2" size={20} /> Dashboard
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `nav-link text-white p-2 rounded ${
                  isActive ? "active-nav" : ""
                }`
              }
            >
              <UsersIcon className="me-2" size={20} /> User Profile
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink
              to="/form-submissions"
              className={({ isActive }) =>
                `nav-link text-white p-2 rounded ${
                  isActive ? "active-nav" : ""
                }`
              }
            >
              <FileText className="me-2" size={20} /> Form Submissions
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `nav-link text-white p-2 rounded ${
                  isActive ? "active-nav" : ""
                }`
              }
            >
              <Bell className="me-2" size={20} /> Notifications
            </NavLink>
          </li>
          <li className="nav-item mb-3">
            <NavLink
              to="/track-visitors"
              className={({ isActive }) =>
                `nav-link text-white p-2 rounded ${
                  isActive ? "active-nav" : ""
                }`
              }
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
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 shadow p-3 bg-white rounded">
          <h2 className="mb-0 d-flex align-items-center">
            <UsersIcon
              style={{ color: "#044EB0" }}
              className="me-3 fw-bold"
              size={30}
            />{" "}
            Users
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-striped shadow-lg rounded">
            <thead className="table-dark" style={{ background: "#044EB0" }}>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Remove User</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            user.profileImage ? user.profileImage : defaultimage
                          }
                          alt={user.username || "User profile"}
                          className="rounded-circle border"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email ?? "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        <FaTrash /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
