import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaUser, FaSearch, FaTrash } from "react-icons/fa";
import Sidebar from "./components/slidebar";
import defaultimage from "./Assets/ProfilePicture.jpg";

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);

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
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter((user) => user.id !== userId));
      alert("User removed successfully!");
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove user.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            displayName: auth.currentUser?.displayName || null,
          }))
          .filter(
            (user) => user.username && user.role?.toLowerCase() === "visitor"
          );

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
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

  const getDisplayName = (user) => {
    return user.name || user.username || user.email?.split("@")[0] || "User";
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <Sidebar handleLogout={handleLogout} />

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 shadow p-3 bg-white rounded">
          <h2 className="mb-0 d-flex align-items-center">
            <FaUser
              style={{ color: "#044EB0" }}
              className="me-3 fw-bold"
              size={30}
            />
            Visitors
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
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading visitor users...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped shadow-lg rounded">
              <thead className="table-dark" style={{ background: "#044EB0" }}>
                <tr>
                  <th>Profile</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={user.profileImage || defaultimage}
                            alt={getDisplayName(user)}
                            className="rounded-circle border"
                            style={{
                              width: "40px",
                              height: "40px",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      </td>

                      <td>{user.username || "N/A"}</td>
                      <td>{user.email || "N/A"}</td>
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
                    <td colSpan="5" className="text-center">
                      No visitor users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
