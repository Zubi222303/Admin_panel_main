import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./LoginSignupPages/LoginSignuppage";
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardHome from "./dashbord";
import UsersList from "./users";
import Dashboard2 from "./Dashboard2";
import { auth, db } from "./firebase"; // Firebase setup
import { doc, getDoc } from "firebase/firestore";
import ManageRequests from "./map-requests";

// Protected route to ensure only authenticated admins can access dashboard and users page
function ProtectedRoute({ element }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists() && userDoc.data().role === "admin") {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading screen while checking authentication

  return user ? element : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/dashboard" /> : <AuthPage isSignup={false} />
          }
        />
        <Route
          path="/signup"
          element={
            user ? <Navigate to="/dashboard" /> : <AuthPage isSignup={true} />
          }
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashboardHome />} />}
        />
        <Route
          path="/users"
          element={<ProtectedRoute element={<UsersList />} />}
        />
        <Route
          path="/map-requests"
          element={<ProtectedRoute element={<ManageRequests />} />}
        />

        <Route
          path="/dashboard2"
          element={<ProtectedRoute element={<Dashboard2 />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
