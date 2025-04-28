import emailjs from "emailjs-com";

const SERVICE_ID = "service_65nunsv";
const TEMPLATE_APPROVAL_ID = "template_r4y7bfu";
const TEMPLATE_DECLINE_ID = "template_r4y7bfu";
const PUBLIC_KEY = "ms7CLzz_mrzVWcwr4";

export const sendApprovalEmail = async (userEmail, buildingName) => {
  const templateParams = {
    to_email: userEmail,
    subject: "Building Request Approved",
    message: `Congratulations! Your request for the building '${buildingName}' has been approved.`,
  };

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_APPROVAL_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log("Approval email sent successfully!");
    return true;
  } catch (error) {
    console.error("Error sending approval email:", error);
    return false;
  }
};

export const sendDeclineEmail = async (userEmail, buildingName) => {
  const templateParams = {
    to_email: userEmail,
    subject: "Building Request Declined",
    message: `We regret to inform you that your request for the building '${buildingName}' has been declined.`,
  };

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_DECLINE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log("Decline email sent successfully!");
    return true;
  } catch (error) {
    console.error("Error sending decline email:", error);
    return false;
  }
};
