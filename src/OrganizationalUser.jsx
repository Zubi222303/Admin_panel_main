import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaSearch, FaTrash } from "react-icons/fa";
import Sidebar from "./components/slidebar";
import defaultimage from "./Assets/ProfilePicture.jpg";

const OrganizationalUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
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
      alert("Organizer removed successfully!");
    } catch (error) {
      console.error("Error removing user:", error);
      alert("Failed to remove organizer.");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            displayName: auth.currentUser?.displayName || null,
          }))
          .filter(
            (user) => user.username && user.role?.toLowerCase() === "organizer"
          );

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching organizers:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(term) ||
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      (user.displayName && user.displayName.toLowerCase().includes(term))
    );
  });

  const getDisplayName = (user) => {
    return (
      user.displayName ||
      user.name ||
      user.username ||
      user.email?.split("@")[0] ||
      "User"
    );
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <Sidebar handleLogout={handleLogout} />

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3 shadow p-3 bg-white rounded">
          <h2 className="mb-0 d-flex align-items-center">
            <FaUserTie
              style={{ color: "#198754" }}
              className="me-3 fw-bold"
              size={30}
            />
            Organizers
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
                placeholder="Search organizers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-striped shadow-lg rounded">
            <thead className="table-dark">
              <tr>
                <th>Profile</th>
                <th>Display Name</th>
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
                    </td>
                    <td>{getDisplayName(user)}</td>
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
                    No organizers found
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

export default OrganizationalUser;
