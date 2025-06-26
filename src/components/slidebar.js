import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Users as UsersIcon,
  Bell,
  MapPin,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import logo from "../Assets/Logowhite.png";
import "./Sidebar.css";

const Sidebar = ({ handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".sidebar-custom");
      const mobileHeader = document.querySelector(".mobile-header");

      if (
        isOpen &&
        !sidebar.contains(event.target) &&
        !mobileHeader.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    // Close sidebar when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="mobile-header d-md-none">
        <img src={logo} alt="Logo" height={40} />
        <button
          className="btn btn-light btn-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <nav className={`sidebar-custom ${isOpen ? "open" : ""}`}>
        <div className="p-3 flex-grow-1 overflow-auto">
          <div className="text-center mb-3">
            <img src={logo} alt="Logo" width={80} />
          </div>

          {/* Border bottom after logo */}
          <div
            style={{
              borderBottom: "5px solid rgba(255, 255, 255, 0.1)",
              marginBottom: "1rem",
            }}
          ></div>

          <ul className="nav flex-column">
            <SidebarItem
              to="/dashboard"
              icon={LayoutGrid}
              label="Dashboard"
              onClick={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/adminProfile"
              icon={UsersIcon}
              label="User Profile"
              onClick={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/users"
              icon={User}
              label="Visitors"
              onClick={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/OrganizationalUser"
              icon={User}
              label="Organizers"
              onClick={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/map-requests"
              icon={MapPin}
              label="Requests"
              onClick={() => setIsOpen(false)}
            />
            <SidebarItem
              to="/send-notification-form"
              icon={Bell}
              label="Notifications"
              onClick={() => setIsOpen(false)}
            />
          </ul>
        </div>

        <div className="p-3">
          {/* Border top before logout button */}
          <div
            style={{
              borderTop: "5px solid rgba(255, 255, 255, 0.1)",
              marginBottom: "0.5rem",
            }}
          ></div>

          <button className="btn btn-danger w-100" onClick={handleLogout}>
            <LogOut className="me-2" size={16} />
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

const SidebarItem = ({ to, icon: Icon, label, onClick }) => (
  <li className="nav-item mb-2">
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-link d-flex align-items-center text-white px-3 py-2 rounded ${
          isActive ? "active-nav" : "hover-nav"
        }`
      }
      onClick={onClick}
    >
      <Icon className="me-2" size={20} />
      {label}
    </NavLink>
  </li>
);

export default Sidebar;
