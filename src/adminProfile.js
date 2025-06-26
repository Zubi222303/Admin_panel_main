"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Camera } from "lucide-react";
import Sidebar from "./components/slidebar";
import defaultimage from "./Assets/ProfilePicture.jpg";
import { auth, storage } from "./firebase";
import {
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./App.css";

const AdminProfile = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || defaultimage);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    // Store the actual file for upload
    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile || !user) return null;

    try {
      // Generate a unique filename for the image
      const fileExtension = imageFile.name.split(".").pop();
      const storageRef = ref(
        storage,
        `profile_images/${user.uid}/profile.${fileExtension}`
      );

      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(storageRef, imageFile);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error("Failed to upload image: " + error.message);
    }
  };

  const reauthenticateUser = async () => {
    if (!password || !user?.email) {
      throw new Error("Password is required for profile updates");
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      throw new Error("Authentication failed. Please check your password.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if any changes were made
      const hasDisplayNameChange = displayName !== user.displayName;
      const hasEmailChange = email !== user.email;
      const hasImageChange = imageFile !== null;

      if (!hasDisplayNameChange && !hasEmailChange && !hasImageChange) {
        setError("No changes detected");
        setLoading(false);
        return;
      }

      // Reauthenticate if making sensitive changes
      if (hasEmailChange || hasImageChange || hasDisplayNameChange) {
        await reauthenticateUser();
      }

      let newPhotoURL = user.photoURL;

      // Upload image first if there's a new image
      if (hasImageChange) {
        newPhotoURL = await uploadImage();
      }

      // Prepare updates object
      const updates = {};
      if (hasDisplayNameChange) updates.displayName = displayName;
      if (hasImageChange) updates.photoURL = newPhotoURL;

      // Update profile if there are updates
      if (Object.keys(updates).length > 0) {
        await updateProfile(user, updates);
        // Update local state
        if (hasImageChange) {
          setPhotoURL(newPhotoURL);
        }
      }

      // Update email separately if changed
      if (hasEmailChange) {
        await updateEmail(user, email);
      }

      // Reset form state
      setImageFile(null);
      setImagePreview(null);
      setPassword("");

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDisplayName(user?.displayName || "");
    setEmail(user?.email || "");
    setImageFile(null);
    setImagePreview(null);
    setPassword("");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="container-fluid" style={{ minHeight: "100vh" }}>
      <div className="row">
        {/* Sidebar Column - fixed width */}
        <div className="col-md-3 col-lg-2 d-md-flex bg-dark text-white p-0">
          <Sidebar handleLogout={handleLogout} />
        </div>

        {/* Main Content Column */}
        <div className="col-md-9 col-lg-10 ms-sm-auto px-md-4 py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h4 fw-bold">Profile Settings</h1>
            <div className="d-flex align-items-center">
              <span className="me-2">
                {user?.displayName || user?.email?.split("@")[0]}
              </span>
              <img
                src={imagePreview || photoURL}
                alt="User Profile"
                className="rounded-circle border shadow-sm"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
            </div>
          </div>

          <div className="row g-4">
            {/* Profile Picture Column */}
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center d-flex flex-column">
                  <div
                    className="position-relative mx-auto mb-3"
                    style={{ width: "180px", height: "180px" }}
                  >
                    <img
                      src={imagePreview || photoURL}
                      alt="Profile"
                      className="rounded-circle border w-100 h-100 object-cover shadow"
                      style={{
                        border: "3px solid #f8f9fa",
                        objectFit: "cover",
                      }}
                    />
                    {isEditing && (
                      <label
                        htmlFor="profileImage"
                        className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer shadow"
                        style={{
                          width: "45px",
                          height: "45px",
                          cursor: "pointer",
                        }}
                        title="Change photo"
                      >
                        <Camera size={20} />
                        <input
                          id="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="d-none"
                          disabled={loading}
                        />
                      </label>
                    )}
                  </div>

                  <h4 className="mb-1">{user?.displayName || "Admin User"}</h4>
                  <p className="text-muted mb-2">{user?.email}</p>
                  <small className="text-muted">
                    Last login:{" "}
                    {user?.metadata?.lastSignInTime
                      ? new Date(user.metadata.lastSignInTime).toLocaleString()
                      : "N/A"}
                  </small>
                </div>
              </div>
            </div>

            {/* Profile Information Column */}
            <div className="col-md-8">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0">Profile Information</h5>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        isEditing ? cancelEdit() : setIsEditing(true)
                      }
                      disabled={loading}
                    >
                      {isEditing ? (
                        <>
                          <i className="bi bi-x-circle me-1"></i> Cancel
                        </>
                      ) : (
                        <>
                          <i className="bi bi-pencil-square me-1"></i> Edit
                          Profile
                        </>
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show mb-3">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setError(null)}
                      />
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success alert-dismissible fade show mb-3">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {success}
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccess(null)}
                      />
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label
                        htmlFor="displayName"
                        className="form-label d-flex align-items-center text-muted"
                      >
                        <User size={18} className="me-2 text-primary" />
                        Display Name
                      </label>
                      <input
                        type="text"
                        className="form-control py-2"
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={!isEditing || loading}
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="form-label d-flex align-items-center text-muted"
                      >
                        <Mail size={18} className="me-2 text-primary" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control py-2"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing || loading}
                      />
                    </div>

                    {isEditing && (
                      <>
                        <div className="mb-4">
                          <label
                            htmlFor="password"
                            className="form-label d-flex align-items-center text-muted"
                          >
                            <Lock size={18} className="me-2 text-primary" />
                            Current Password (required for changes)
                          </label>
                          <input
                            type="password"
                            className="form-control py-2"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter current password to confirm changes"
                            disabled={loading}
                            required
                          />
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                          <button
                            type="submit"
                            className="btn btn-primary px-4 py-2"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-save me-2"></i> Save Changes
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
