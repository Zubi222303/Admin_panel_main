// import React, { useEffect, useState } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import AuthPage from "./LoginSignupPages/LoginSignuppage";
// import "bootstrap/dist/css/bootstrap.min.css";
// import DashboardHome from "./dashbord";
// import UsersList from "./users";
// import Dashboard2 from "./Dashboard2";
// import { auth, db } from "./firebase"; // Firebase setup
// import { doc, getDoc } from "firebase/firestore";
// import ManageRequests from "./map-requests";

// // Protected route to ensure only authenticated admins can access dashboard and users page
// function ProtectedRoute({ element }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
//       if (currentUser) {
//         const userRef = doc(db, "users", currentUser.uid);
//         const userDoc = await getDoc(userRef);

//         if (userDoc.exists() && userDoc.data().role === "admin") {
//           setUser(currentUser);
//         } else {
//           setUser(null);
//         }
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) return <div>Loading...</div>; // Show loading screen while checking authentication

//   return user ? element : <Navigate to="/login" />;
// }

// function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     auth.onAuthStateChanged(setUser);
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
//           }
//         />
//         <Route
//           path="/login"
//           element={
//             user ? <Navigate to="/dashboard" /> : <AuthPage isSignup={false} />
//           }
//         />
//         <Route
//           path="/signup"
//           element={
//             user ? <Navigate to="/dashboard" /> : <AuthPage isSignup={true} />
//           }
//         />
//         <Route
//           path="/dashboard"
//           element={<ProtectedRoute element={<DashboardHome />} />}
//         />
//         <Route
//           path="/users"
//           element={<ProtectedRoute element={<UsersList />} />}
//         />
//         <Route
//           path="/map-requests"
//           element={<ProtectedRoute element={<ManageRequests />} />}
//         />

//         <Route
//           path="/dashboard2"
//           element={<ProtectedRoute element={<Dashboard2 />} />}
//         />
//       </Routes>
//       <Route
//         path="/profile"
//         element={<ProtectedRoute element={<AdminProfile />} />}
//       />
//     </Router>
//   );
// }

// export default App;

import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AuthPage from "./LoginSignupPages/LoginSignuppage";
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardHome from "./dashbord";
import UsersList from "./users";
import Dashboard2 from "./Dashboard2";
import AdminProfile from "./adminProfile";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import ManageRequests from "./map-requests";
import { onAuthStateChanged } from "firebase/auth";
import OrganizationalUser from "./OrganizationalUser";

// Enhanced ProtectedRoute component with better error handling
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists() && userDoc.data().role === "admin") {
            setUser(currentUser);
          } else {
            setUser(null);
            navigate("/login");
          }
        } else {
          setUser(null);
          navigate("/login");
        }
      } catch (err) {
        setError("Failed to verify user permissions");
        console.error("Auth error:", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">
        {error}. Redirecting to login...
      </div>
    );
  }

  return user ? children : null;
}

function App() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return () => unsubscribe();
  }, [initializing]);

  if (initializing) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage isSignup={false} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage isSignup={true} />
            )
          }
        />

        {/* Protected admin routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map-requests"
          element={
            <ProtectedRoute>
              <ManageRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard2"
          element={
            <ProtectedRoute>
              <Dashboard2 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminProfile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizationalUser"
          element={
            <ProtectedRoute>
              <OrganizationalUser />
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
