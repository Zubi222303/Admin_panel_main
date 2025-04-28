import React, { useState } from "react";
import { auth, db } from "../firebase"; // Import Firestore
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore functions
import { Link, useNavigate } from "react-router-dom";
import logo from "../Assets/Logo.png";

const AuthPage = ({ isSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before attempting login/signup

    try {
      if (isSignup) {
        // 🔹 Sign up user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 🔹 Store user data in Firestore (Assign role: "admin")
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          role: "admin", // Assign admin role
        });

        alert("Signup Successful! Please login.");
        navigate("/login");
      } else {
        // 🔹 Login user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 🔹 Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          if (userData.role === "admin") {
            alert("Login Successful! Redirecting to Dashboard.");
            navigate("/dashboard"); // ✅ Navigate only if role is "admin"
          } else {
            alert("Access Denied! You are not an admin.");
          }
        } else {
          alert("User data not found in Firestore!");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container p-4">
        <div className="row shadow-lg bg-white rounded p-4">
          
          {/* Logo Section */}
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
            <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "300px" }} />
          </div>

          {/* Form Section */}
          <div className="col-md-6 p-4">
            <h2 className="fw-bold text-center mb-3">{isSignup ? "Sign Up" : "Login"}</h2>

            {/* Display Errors */}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "#044EB0" }}>
                  {isSignup ? "Sign Up" : "Login"}
                </button>
              </div>
            </form>

            {/* Switch to Signup/Login */}
            <div className="text-center mt-3">
              {isSignup ? (
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary fw-bold text-decoration-none">
                    Login
                  </Link>
                </p>
              ) : (
                <p>
                  Don’t have an account?{" "}
                  <Link to="/signup" className="text-primary fw-bold text-decoration-none">
                    Sign Up
                  </Link>
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
