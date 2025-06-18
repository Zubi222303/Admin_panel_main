import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users as UsersIcon,
  FileText,
  Bell,
  Eye,
  LogOut,
  User,
} from "lucide-react";
import logo from "../Assets/Logowhite.png";

const Sidebar = ({ handleLogout }) => {
  return (
    <nav
      className="col-md-3 col-lg-2 d-md-block text-white p-3 manage-nav vh-100 position-sticky top-0 overflow-y-auto"
      style={{ backgroundColor: "#282c34" }}
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
              `nav-link text-white p-2 rounded hover-bg ${
                isActive ? "active-nav" : ""
              }`
            }
          >
            <LayoutGrid className="me-2" size={20} /> Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-3">
          <NavLink
            to="/adminProfile"
            className={({ isActive }) =>
              `nav-link text-white p-2 rounded hover-bg ${
                isActive ? "active-nav" : ""
              }`
            }
          >
            <UsersIcon className="me-2" size={20} /> User Profile
          </NavLink>
        </li>

        <li className="nav-item mb-3">
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `nav-link text-white p-2 rounded hover-bg ${
                isActive ? "active-nav" : ""
              }`
            }
          >
            <User className="me-2" size={20} /> Visitors
          </NavLink>
        </li>
        <li className="nav-item mb-3">
          <NavLink
            to="/OrganizationalUser"
            className={({ isActive }) =>
              `nav-link text-white p-2 rounded hover-bg ${
                isActive ? "active-nav" : ""
              }`
            }
          >
            <User className="me-2" size={20} />
            Organizers
          </NavLink>
        </li>
      </ul>
      <div className="mt-auto mb-2">
        <button className="btn btn-danger w-100" onClick={handleLogout}>
          <LogOut className="me-2" size={20} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
