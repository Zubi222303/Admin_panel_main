// "use client"

// import { useState, useEffect } from "react"
// import { collection, getDocs } from "firebase/firestore"
// import { db } from "./firebase"
// import "bootstrap/dist/css/bootstrap.min.css"
// import Sidebar from "./components/slidebar";
// import {
//   FaBell,
//   FaPaperPlane,
//   FaUsers,
//   FaEye,
//   FaExclamationCircle,
//   FaCheckCircle,
//   FaSpinner,
//   FaCog,
//   FaImage,
//   FaLink,
// } from "react-icons/fa"

// const SendNotificationForm = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     message: "",
//     type: "general",
//     url: "",
//     imageUrl: "",
//     actionButton: "",
//     actionUrl: "",
//   })

//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(null)
//   const [error, setError] = useState(null)
//   const [previewMode, setPreviewMode] = useState(false)
//   const [stats, setStats] = useState({ totalUsers: 0 })
//   const [loadingStats, setLoadingStats] = useState(true)

//   // Predefined notification templates
//   const notificationTemplates = {
//     general: {
//       title: "Important Update",
//       message: "We have an important update for you. Please check the latest information.",
//     },
//     approval: {
//       title: "Request Approved",
//       message: "Your map request has been approved successfully. Our team will contact you soon.",
//     },
//     maintenance: {
//       title: "Scheduled Maintenance",
//       message: "We will be performing scheduled maintenance. The service may be temporarily unavailable.",
//     },
//     promotion: {
//       title: "Special Offer",
//       message: "Don't miss out on our special offer! Limited time only.",
//     },
//     welcome: {
//       title: "Welcome!",
//       message: "Welcome to our platform! We're excited to have you on board.",
//     },
//   }

//   // Load user statistics from Firebase
//   useEffect(() => {
//     const loadStats = async () => {
//       try {
//         setLoadingStats(true)
//         const usersSnapshot = await getDocs(collection(db, "users"))
//         const totalUsers = usersSnapshot.size

//         setStats({
//           totalUsers,
//         })
//       } catch (error) {
//         console.error("Error loading user stats:", error)
//         setError("Failed to load user statistics")
//       } finally {
//         setLoadingStats(false)
//       }
//     }

//     loadStats()
//   }, [])

//   // Simplified OneSignal notification function - Send to ALL users
//   const sendOneSignalNotification = async (notificationData) => {
//     const payload = {
//       // Use the SAME App ID as your mobile app
//       app_id: "dcf7bc92-264d-445e-878e-c8ca383de55f",
//       contents: { en: notificationData.message },
//       headings: { en: notificationData.title },

//       // Send to ALL users - simplified targeting
//       included_segments: ["All"],

//       // Custom data
//       data: {
//         type: notificationData.type,
//         url: notificationData.url || "",
//         timestamp: new Date().toISOString(),
//       },

//       // Notification options
//       priority: 10,
//       ttl: 259200, // 3 days

//       // Action buttons (if provided)
//       ...(notificationData.actionButton &&
//         notificationData.actionUrl && {
//           buttons: [
//             {
//               id: "action_button",
//               text: notificationData.actionButton,
//               url: notificationData.actionUrl,
//             },
//           ],
//         }),

//       // Large image (if provided)
//       ...(notificationData.imageUrl && {
//         big_picture: notificationData.imageUrl,
//         ios_attachments: { id: notificationData.imageUrl },
//       }),

//       // Launch URL (if provided)
//       ...(notificationData.url && {
//         url: notificationData.url,
//       }),
//     }

//     try {
//       console.log("Sending notification with payload:", payload)

//       const response = await fetch("https://onesignal.com/api/v1/notifications", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json; charset=utf-8",
//           // Use the SAME REST API Key as your mobile app setup
//           Authorization:
//             "Basic os_v2_app_3t33zergjvcf5b4ozdfdqppfl6yo632qwdie7emcna5rctehk5cxi3f6p34n4mhb44cxjurpzbr3ebn27ooennublkbhnxergd7uzpy",
//         },
//         body: JSON.stringify(payload),
//       })

//       const result = await response.json()
//       console.log("OneSignal response:", result)

//       if (response.ok) {
//         return {
//           success: true,
//           data: result,
//           recipients: result.recipients || 0,
//           id: result.id,
//         }
//       } else {
//         console.error("OneSignal error:", result)
//         throw new Error(result.errors?.[0] || "Failed to send notification")
//       }
//     } catch (error) {
//       console.error("Error sending notification:", error)
//       throw error
//     }
//   }

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//     if (success) setSuccess(null)
//     if (error) setError(null)
//   }

//   const handleTemplateSelect = (templateKey) => {
//     if (templateKey && notificationTemplates[templateKey]) {
//       const template = notificationTemplates[templateKey]
//       setFormData((prev) => ({
//         ...prev,
//         title: template.title,
//         message: template.message,
//         type: templateKey,
//       }))
//     }
//   }

//   const validateForm = () => {
//     if (!formData.title.trim()) {
//       setError("Title is required")
//       return false
//     }
//     if (!formData.message.trim()) {
//       setError("Message is required")
//       return false
//     }
//     if (formData.title.length > 100) {
//       setError("Title must be less than 100 characters")
//       return false
//     }
//     if (formData.message.length > 500) {
//       setError("Message must be less than 500 characters")
//       return false
//     }
//     return true
//   }

//   const handleSendNotification = async () => {
//     if (!validateForm()) return

//     try {
//       setLoading(true)
//       setError(null)

//       const result = await sendOneSignalNotification(formData)

//       if (result.success) {
//         setSuccess(`Notification sent successfully to ${result.recipients} users! (ID: ${result.id})`)

//         // Reset form after successful send
//         setFormData({
//           title: "",
//           message: "",
//           type: "general",
//           url: "",
//           imageUrl: "",
//           actionButton: "",
//           actionUrl: "",
//         })
//         setPreviewMode(false)
//       }
//     } catch (error) {
//       setError(`Failed to send notification: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handlePreview = () => {
//     if (!validateForm()) return
//     setPreviewMode(true)
//   }

//   const handleTestNotification = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       // Send a simple test notification
//       const testPayload = {
//         app_id: "dcf7bc92-264d-445e-878e-c8ca383de55f",
//         contents: { en: "This is a test notification to verify your setup is working correctly." },
//         headings: { en: "Test Notification" },
//         included_segments: ["All"],
//         data: { type: "test" },
//       }

//       const response = await fetch("https://onesignal.com/api/v1/notifications", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json; charset=utf-8",
//           Authorization:
//             "Basic os_v2_app_xqmi2ldaznf4vdqva6rdydsl32wpoxdkx2zuypfzh4enjmpeivo3ernm3kwnrpeuecrxu2n2kihddyocrw5s7qtzy5uie2tso4ufo3y",
//         },
//         body: JSON.stringify(testPayload),
//       })

//       const result = await response.json()

//       if (response.ok) {
//         setSuccess(`Test notification sent to ${result.recipients} users! (ID: ${result.id})`)
//       } else {
//         setError(`Test failed: ${result.errors?.[0] || "Unknown error"}`)
//       }
//     } catch (error) {
//       setError(`Test failed: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="container-fluid py-4">

//       <div className="row justify-content-center">
//        <Sidebar/>
//         <div className="col-12 col-xl-10">

//           {/* Header */}
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div className="d-flex align-items-center">
//               <FaBell className="text-primary me-3" size={32} />
//               <div>
//                 <h1 className="h2 mb-1">Send Notification</h1>
//                 <p className="text-muted mb-0">Send push notifications to all users</p>
//               </div>
//             </div>
//             <div className="text-center">
//               <div className="d-flex align-items-center justify-content-center mb-1">
//                 <FaUsers className="text-muted me-2" />
//                 <small className="text-muted">Total Users</small>
//               </div>
//               <h3 className="text-primary mb-0">
//                 {loadingStats ? <FaSpinner className="spinner" /> : stats.totalUsers}
//               </h3>
//             </div>
//           </div>

//           {/* Alerts */}
//           {error && (
//             <div className="alert alert-danger d-flex align-items-center" role="alert">
//               <FaExclamationCircle className="me-2" />
//               {error}
//               <button type="button" className="btn-close ms-auto" onClick={() => setError(null)}></button>
//             </div>
//           )}

//           {success && (
//             <div className="alert alert-success d-flex align-items-center" role="alert">
//               <FaCheckCircle className="me-2" />
//               {success}
//               <button type="button" className="btn-close ms-auto" onClick={() => setSuccess(null)}></button>
//             </div>
//           )}

//           <div className="row">
//             {/* Form Section */}
//             <div className="col-lg-8">
//               <div className="card shadow-sm">
//                 <div className="card-header bg-primary text-white">
//                   <h5 className="card-title mb-0 d-flex align-items-center">
//                     <FaPaperPlane className="me-2" />
//                     Compose Notification
//                   </h5>
//                 </div>
//                 <div className="card-body">
//                   {/* Template Selection */}
//                   <div className="mb-4">
//                     <label className="form-label">Quick Templates</label>
//                     <select
//                       className="form-select"
//                       onChange={(e) => handleTemplateSelect(e.target.value)}
//                       defaultValue=""
//                     >
//                       <option value="">Choose a template (optional)</option>
//                       <option value="general">General Update</option>
//                       <option value="approval">Request Approved</option>
//                       <option value="maintenance">Maintenance Notice</option>
//                       <option value="promotion">Promotion/Offer</option>
//                       <option value="welcome">Welcome Message</option>
//                     </select>
//                   </div>

//                   <hr />

//                   {/* Basic Information */}
//                   <div className="row">
//                     <div className="col-12 mb-3">
//                       <label className="form-label">
//                         Notification Title <span className="text-danger">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Enter notification title"
//                         value={formData.title}
//                         onChange={(e) => handleInputChange("title", e.target.value)}
//                         maxLength={100}
//                       />
//                       <div className="form-text">{formData.title.length}/100 characters</div>
//                     </div>

//                     <div className="col-12 mb-3">
//                       <label className="form-label">
//                         Message <span className="text-danger">*</span>
//                       </label>
//                       <textarea
//                         className="form-control"
//                         rows="4"
//                         placeholder="Enter your notification message"
//                         value={formData.message}
//                         onChange={(e) => handleInputChange("message", e.target.value)}
//                         maxLength={500}
//                       ></textarea>
//                       <div className="form-text">{formData.message.length}/500 characters</div>
//                     </div>

//                     <div className="col-md-6 mb-3">
//                       <label className="form-label">Notification Type</label>
//                       <select
//                         className="form-select"
//                         value={formData.type}
//                         onChange={(e) => handleInputChange("type", e.target.value)}
//                       >
//                         <option value="general">General</option>
//                         <option value="approval">Approval</option>
//                         <option value="maintenance">Maintenance</option>
//                         <option value="promotion">Promotion</option>
//                         <option value="welcome">Welcome</option>
//                         <option value="urgent">Urgent</option>
//                       </select>
//                     </div>
//                   </div>

//                   <hr />

//                   {/* Advanced Options */}
//                   <div className="mb-4">
//                     <h6 className="d-flex align-items-center mb-3">
//                       <FaCog className="me-2" />
//                       Advanced Options
//                     </h6>

//                     <div className="row">
//                       <div className="col-md-6 mb-3">
//                         <label className="form-label">
//                           <FaLink className="me-1" />
//                           Launch URL (optional)
//                         </label>
//                         <input
//                           type="url"
//                           className="form-control"
//                           placeholder="https://example.com"
//                           value={formData.url}
//                           onChange={(e) => handleInputChange("url", e.target.value)}
//                         />
//                         <div className="form-text">URL to open when notification is tapped</div>
//                       </div>

//                       <div className="col-md-6 mb-3">
//                         <label className="form-label">
//                           <FaImage className="me-1" />
//                           Large Image URL (optional)
//                         </label>
//                         <input
//                           type="url"
//                           className="form-control"
//                           placeholder="https://example.com/image.jpg"
//                           value={formData.imageUrl}
//                           onChange={(e) => handleInputChange("imageUrl", e.target.value)}
//                         />
//                         <div className="form-text">Image to display in the notification</div>
//                       </div>

//                       <div className="col-md-6 mb-3">
//                         <label className="form-label">Action Button Text</label>
//                         <input
//                           type="text"
//                           className="form-control"
//                           placeholder="View Details"
//                           value={formData.actionButton}
//                           onChange={(e) => handleInputChange("actionButton", e.target.value)}
//                         />
//                       </div>

//                       <div className="col-md-6 mb-3">
//                         <label className="form-label">Action Button URL</label>
//                         <input
//                           type="url"
//                           className="form-control"
//                           placeholder="https://example.com/action"
//                           value={formData.actionUrl}
//                           onChange={(e) => handleInputChange("actionUrl", e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="d-grid gap-2 d-md-flex justify-content-md-end">
//                     <button
//                       type="button"
//                       className="btn btn-outline-secondary me-md-2"
//                       onClick={handleTestNotification}
//                       disabled={loading}
//                     >
//                       {loading ? <FaSpinner className="spinner me-2" /> : <FaBell className="me-2" />}
//                       Send Test
//                     </button>
//                     <button type="button" className="btn btn-outline-primary me-md-2" onClick={handlePreview}>
//                       <FaEye className="me-2" />
//                       Preview
//                     </button>
//                     <button
//                       type="button"
//                       className="btn btn-primary"
//                       onClick={handleSendNotification}
//                       disabled={loading}
//                     >
//                       {loading ? <FaSpinner className="spinner me-2" /> : <FaPaperPlane className="me-2" />}
//                       Send to All Users
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Preview Section */}
//             <div className="col-lg-4">
//               <div className="card shadow-sm">
//                 <div className="card-header">
//                   <h6 className="card-title mb-0 d-flex align-items-center">
//                     <FaEye className="me-2" />
//                     Preview
//                   </h6>
//                 </div>
//                 <div className="card-body">
//                   {previewMode && formData.title && formData.message ? (
//                     <div>
//                       {/* Mobile Notification Preview */}
//                       <div className="bg-light rounded p-3 border-start border-primary border-4 mb-3">
//                         <div className="d-flex align-items-start">
//                           <div className="bg-primary rounded-circle p-2 me-3">
//                             <FaBell className="text-white" size={16} />
//                           </div>
//                           <div className="flex-grow-1">
//                             <h6 className="mb-1 text-truncate">{formData.title}</h6>
//                             <p className="mb-2 small text-muted">{formData.message}</p>
//                             <div className="d-flex justify-content-between align-items-center">
//                               <span className="badge bg-secondary">{formData.type}</span>
//                               <small className="text-muted">now</small>
//                             </div>
//                             {formData.actionButton && (
//                               <button className="btn btn-sm btn-primary mt-2">{formData.actionButton}</button>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       {/* Notification Details */}
//                       <div className="small">
//                         <div className="d-flex justify-content-between mb-2">
//                           <span className="text-muted">Recipients:</span>
//                           <strong>All Users</strong>
//                         </div>
//                         <div className="d-flex justify-content-between mb-2">
//                           <span className="text-muted">Type:</span>
//                           <span className="badge bg-outline-secondary">{formData.type}</span>
//                         </div>
//                         {formData.url && (
//                           <div className="d-flex justify-content-between mb-2">
//                             <span className="text-muted">Launch URL:</span>
//                             <span className="text-primary text-truncate" style={{ maxWidth: "120px" }}>
//                               {formData.url}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center text-muted py-5">
//                       <FaEye size={48} className="mb-3 opacity-50" />
//                       <p>Fill in the form and click Preview to see how your notification will look</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Statistics Card */}
//               <div className="card shadow-sm mt-3">
//                 <div className="card-header">
//                   <h6 className="card-title mb-0 d-flex align-items-center">
//                     <FaUsers className="me-2" />
//                     User Statistics
//                   </h6>
//                 </div>
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <span className="text-muted">Total Users</span>
//                     <h4 className="text-primary mb-0">{stats.totalUsers}</h4>
//                   </div>
//                   <hr />
//                   <p className="small text-muted mb-0">
//                     📱 Notifications will be sent to all users via OneSignal
//                     <br />🔗 OneSignal is linked with Firebase for automatic user management
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .spinner {
//           animation: spin 1s linear infinite;
//         }
//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default SendNotificationForm

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./components/slidebar";
import {
  FaBell,
  FaPaperPlane,
  FaUsers,
  FaEye,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
  FaCog,
  FaImage,
  FaLink,
} from "react-icons/fa";

const SendNotificationForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
    url: "",
    imageUrl: "",
    actionButton: "",
    actionUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const navigate = useNavigate();

  // Predefined notification templates
  const notificationTemplates = {
    general: {
      title: "Important Update",
      message:
        "We have an important update for you. Please check the latest information.",
    },
    approval: {
      title: "Request Approved",
      message:
        "Your map request has been approved successfully. Our team will contact you soon.",
    },
    maintenance: {
      title: "Scheduled Maintenance",
      message:
        "We will be performing scheduled maintenance. The service may be temporarily unavailable.",
    },
    promotion: {
      title: "Special Offer",
      message: "Don't miss out on our special offer! Limited time only.",
    },
    welcome: {
      title: "Welcome!",
      message: "Welcome to our platform! We're excited to have you on board.",
    },
  };

  // Load user statistics from Firebase
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoadingStats(true);
        const usersSnapshot = await getDocs(collection(db, "users"));
        const totalUsers = usersSnapshot.size;

        setStats({
          totalUsers,
        });
      } catch (error) {
        console.error("Error loading user stats:", error);
        setError("Failed to load user statistics");
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  // Simplified OneSignal notification function - Send to ALL users
  const sendOneSignalNotification = async (notificationData) => {
    const payload = {
      app_id: "dcf7bc92-264d-445e-878e-c8ca383de55f",
      contents: { en: notificationData.message },
      headings: { en: notificationData.title },
      included_segments: ["All"],
      data: {
        type: notificationData.type,
        url: notificationData.url || "",
        timestamp: new Date().toISOString(),
      },
      priority: 10,
      ttl: 259200, // 3 days
      ...(notificationData.actionButton &&
        notificationData.actionUrl && {
          buttons: [
            {
              id: "action_button",
              text: notificationData.actionButton,
              url: notificationData.actionUrl,
            },
          ],
        }),
      ...(notificationData.imageUrl && {
        big_picture: notificationData.imageUrl,
        ios_attachments: { id: notificationData.imageUrl },
      }),
      ...(notificationData.url && {
        url: notificationData.url,
      }),
    };

    try {
      console.log("Sending notification with payload:", payload);

      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization:
              "Basic os_v2_app_3t33zergjvcf5b4ozdfdqppfl6yo632qwdie7emcna5rctehk5cxi3f6p34n4mhb44cxjurpzbr3ebn27ooennublkbhnxergd7uzpy",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("OneSignal response:", result);

      if (response.ok) {
        return {
          success: true,
          data: result,
          recipients: result.recipients || 0,
          id: result.id,
        };
      } else {
        console.error("OneSignal error:", result);
        throw new Error(result.errors?.[0] || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (success) setSuccess(null);
    if (error) setError(null);
  };

  const handleTemplateSelect = (templateKey) => {
    if (templateKey && notificationTemplates[templateKey]) {
      const template = notificationTemplates[templateKey];
      setFormData((prev) => ({
        ...prev,
        title: template.title,
        message: template.message,
        type: templateKey,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.message.trim()) {
      setError("Message is required");
      return false;
    }
    if (formData.title.length > 100) {
      setError("Title must be less than 100 characters");
      return false;
    }
    if (formData.message.length > 500) {
      setError("Message must be less than 500 characters");
      return false;
    }
    return true;
  };

  const handleSendNotification = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const result = await sendOneSignalNotification(formData);

      if (result.success) {
        setSuccess(
          `Notification sent successfully to ${result.recipients} users! (ID: ${result.id})`
        );

        // Reset form after successful send
        setFormData({
          title: "",
          message: "",
          type: "general",
          url: "",
          imageUrl: "",
          actionButton: "",
          actionUrl: "",
        });
        setPreviewMode(false);
      }
    } catch (error) {
      setError(`Failed to send notification: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (!validateForm()) return;
    setPreviewMode(true);
  };

  const handleTestNotification = async () => {
    try {
      setLoading(true);
      setError(null);

      // Send a simple test notification
      const testPayload = {
        app_id: "dcf7bc92-264d-445e-878e-c8ca383de55f",
        contents: {
          en: "This is a test notification to verify your setup is working correctly.",
        },
        headings: { en: "Test Notification" },
        included_segments: ["All"],
        data: { type: "test" },
      };

      const response = await fetch(
        "https://onesignal.com/api/v1/notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization:
              "Basic os_v2_app_xqmi2ldaznf4vdqva6rdydsl32wpoxdkx2zuypfzh4enjmpeivo3ernm3kwnrpeuecrxu2n2kihddyocrw5s7qtzy5uie2tso4ufo3y",
          },
          body: JSON.stringify(testPayload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccess(
          `Test notification sent to ${result.recipients} users! (ID: ${result.id})`
        );
      } else {
        setError(`Test failed: ${result.errors?.[0] || "Unknown error"}`);
      }
    } catch (error) {
      setError(`Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <Sidebar handleLogout={handleLogout} />

      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8fafc" }}>
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center p-4 bg-white rounded-lg shadow-xs mb-4">
          <div className="d-flex align-items-center">
            <FaBell className="text-primary me-3" size={32} />
            <div>
              <h1 className="h2 mb-1">Send Notification</h1>
              <p className="text-muted mb-0">
                Send push notifications to all users
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center mb-1">
              <FaUsers className="text-muted me-2" />
              <small className="text-muted">Total Users</small>
            </div>
            <h3 className="text-primary mb-0">
              {loadingStats ? (
                <FaSpinner className="spinner me-2" />
              ) : (
                stats.totalUsers
              )}
            </h3>
          </div>
        </header>

        {/* Alerts */}
        {error && (
          <div
            className="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <FaExclamationCircle className="me-2" />
            {error}
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={() => setError(null)}
            ></button>
          </div>
        )}

        {success && (
          <div
            className="alert alert-success d-flex align-items-center"
            role="alert"
          >
            <FaCheckCircle className="me-2" />
            {success}
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={() => setSuccess(null)}
            ></button>
          </div>
        )}

        <div className="row">
          {/* Form Section */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <FaPaperPlane className="me-2" />
                  Compose Notification
                </h5>
              </div>
              <div className="card-body">
                {/* Template Selection */}
                <div className="mb-4">
                  <label className="form-label">Quick Templates</label>
                  <select
                    className="form-select"
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                    defaultValue=""
                  >
                    <option value="">Choose a template (optional)</option>
                    <option value="general">General Update</option>
                    <option value="approval">Request Approved</option>
                    <option value="maintenance">Maintenance Notice</option>
                    <option value="promotion">Promotion/Offer</option>
                    <option value="welcome">Welcome Message</option>
                  </select>
                </div>

                <hr />

                {/* Basic Information */}
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">
                      Notification Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter notification title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      maxLength={100}
                    />
                    <div className="form-text">
                      {formData.title.length}/100 characters
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label">
                      Message <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Enter your notification message"
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      maxLength={500}
                    ></textarea>
                    <div className="form-text">
                      {formData.message.length}/500 characters
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Notification Type</label>
                    <select
                      className="form-select"
                      value={formData.type}
                      onChange={(e) =>
                        handleInputChange("type", e.target.value)
                      }
                    >
                      <option value="general">General</option>
                      <option value="approval">Approval</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="promotion">Promotion</option>
                      <option value="welcome">Welcome</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <hr />

                {/* Advanced Options */}
                <div className="mb-4">
                  <h6 className="d-flex align-items-center mb-3">
                    <FaCog className="me-2" />
                    Advanced Options
                  </h6>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FaLink className="me-1" />
                        Launch URL (optional)
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com"
                        value={formData.url}
                        onChange={(e) =>
                          handleInputChange("url", e.target.value)
                        }
                      />
                      <div className="form-text">
                        URL to open when notification is tapped
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <FaImage className="me-1" />
                        Large Image URL (optional)
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com/image.jpg"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          handleInputChange("imageUrl", e.target.value)
                        }
                      />
                      <div className="form-text">
                        Image to display in the notification
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Action Button Text</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="View Details"
                        value={formData.actionButton}
                        onChange={(e) =>
                          handleInputChange("actionButton", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Action Button URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com/action"
                        value={formData.actionUrl}
                        onChange={(e) =>
                          handleInputChange("actionUrl", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-md-2"
                    onClick={handleTestNotification}
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="spinner me-2" />
                    ) : (
                      <FaBell className="me-2" />
                    )}
                    Send Test
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary me-md-2"
                    onClick={handlePreview}
                  >
                    <FaEye className="me-2" />
                    Preview
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSendNotification}
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="spinner me-2" />
                    ) : (
                      <FaPaperPlane className="me-2" />
                    )}
                    Send to All Users
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header">
                <h6 className="card-title mb-0 d-flex align-items-center">
                  <FaEye className="me-2" />
                  Preview
                </h6>
              </div>
              <div className="card-body">
                {previewMode && formData.title && formData.message ? (
                  <div>
                    {/* Mobile Notification Preview */}
                    <div className="bg-light rounded p-3 border-start border-primary border-4 mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-primary rounded-circle p-2 me-3">
                          <FaBell className="text-white" size={16} />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 text-truncate">
                            {formData.title}
                          </h6>
                          <p className="mb-2 small text-muted">
                            {formData.message}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-secondary">
                              {formData.type}
                            </span>
                            <small className="text-muted">now</small>
                          </div>
                          {formData.actionButton && (
                            <button className="btn btn-sm btn-primary mt-2">
                              {formData.actionButton}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Notification Details */}
                    <div className="small">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Recipients:</span>
                        <strong>All Users</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Type:</span>
                        <span className="badge bg-outline-secondary">
                          {formData.type}
                        </span>
                      </div>
                      {formData.url && (
                        <div className="d-flex justify-content-between mb-2">
                          <span className="text-muted">Launch URL:</span>
                          <span
                            className="text-primary text-truncate"
                            style={{ maxWidth: "120px" }}
                          >
                            {formData.url}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted py-5">
                    <FaEye size={48} className="mb-3 opacity-50" />
                    <p>
                      Fill in the form and click Preview to see how your
                      notification will look
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics Card */}
            <div className="card shadow-sm mt-3">
              <div className="card-header">
                <h6 className="card-title mb-0 d-flex align-items-center">
                  <FaUsers className="me-2" />
                  User Statistics
                </h6>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Total Users</span>
                  <h4 className="text-primary mb-0">{stats.totalUsers}</h4>
                </div>
                <hr />
                <p className="small text-muted mb-0">
                  📱 Notifications will be sent to all users via OneSignal
                  <br />
                  🔗 OneSignal is linked with Firebase for automatic user
                  management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotificationForm;
