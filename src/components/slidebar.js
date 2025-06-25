import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users as UsersIcon,
  Bell,
  MapPin,
  LogOut,
  User,
} from "lucide-react";
import logo from "../Assets/Logowhite.png";

const Sidebar = ({ handleLogout }) => {
  return (
    <nav
      className="col-md-3 col-lg-2 d-md-block text-white p-0 manage-nav position-sticky top-0"
      style={{
        backgroundColor: "#1a237e",
        background: "linear-gradient(180deg, #1a237e 0%, #283593 100%)",
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="p-3" style={{ flex: "1 1 auto", overflowY: "auto" }}>
        <div className="text-center mb-3">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "80px",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        <div className="sidebar-divider mb-3"></div>

        <ul className="nav flex-column">
          <li className="nav-item nav-item-custom">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center p-2 rounded text-white ${
                  isActive ? "active-nav" : "hover-nav"
                }`
              }
            >
              <LayoutGrid className="me-2" size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="nav-item nav-item-custom">
            <NavLink
              to="/adminProfile"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center p-2 rounded text-white ${
                  isActive ? "active-nav" : "hover-nav"
                }`
              }
            >
              <UsersIcon className="me-2" size={20} />
              <span>User Profile</span>
            </NavLink>
          </li>

          <li className="nav-item nav-item-custom">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center p-2 rounded text-white ${
                  isActive ? "active-nav" : "hover-nav"
                }`
              }
            >
              <User className="me-2" size={20} />
              <span>Visitors</span>
            </NavLink>
          </li>

          <li className="nav-item nav-item-custom">
            <NavLink
              to="/OrganizationalUser"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center p-2 rounded text-white ${
                  isActive ? "active-nav" : "hover-nav"
                }`
              }
            >
              <User className="me-2" size={20} />
              <span>Organizers</span>
            </NavLink>
          </li>

          <li className="nav-item nav-item-custom">
            <NavLink
              to="/map-requests"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center p-2 rounded text-white ${
                  isActive ? "active-nav" : "hover-nav"
                }`
              }
            >
              <MapPin className="me-2" size={20} />
              <span>Map Request</span>
            </NavLink>
          </li>

          <li className="nav-item nav-item-custom">
            <NavLink
              to="/send-notification-form"
              className={({ isActive }) =>
                `nav-link d-flex align-items-center p-2 rounded text-white ${
                  isActive ? "active-nav" : "hover-nav"
                }`
              }
            >
              <Bell className="me-2" size={20} />
              <span>Notifications</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="p-3">
        <div className="sidebar-divider mb-3"></div>
        <button
          className="btn w-100 d-flex align-items-center justify-content-center py-2"
          onClick={handleLogout}
          style={{
            transition: "all 0.3s ease",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            fontSize: "0.875rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#d32f2f";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f44336";
          }}
        >
          <LogOut className="me-2" size={16} />
          <span>Logout</span>
        </button>
      </div>

      <style jsx>{`
        .active-nav {
          background-color: rgba(255, 255, 255, 0.15) !important;
          position: relative;
        }

        .active-nav:after {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background-color: #4fc3f7;
          border-radius: 0 4px 4px 0;
        }

        .hover-nav:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
          transform: translateX(3px);
          transition: all 0.3s ease;
        }

        .sidebar-divider {
          height: 3px;
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-item-custom {
          margin-bottom: 0.8rem;
          font-size: 1rem;
        }
      `}</style>
    </nav>
  );
};

export default Sidebar;
