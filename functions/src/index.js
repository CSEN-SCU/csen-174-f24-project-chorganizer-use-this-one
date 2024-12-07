import functions from "firebase-functions";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const KEY = process.env.SEND_GRID_KEY_UNRESTRICTED;
if (!KEY) {
  throw new Error("SendGrid API key environment variable is not set");
}

// Set SendGrid API Key
sgMail.setApiKey(KEY);

const sender_email = "choreganizerapp@gmail.com";

// Cloud Function (Callable)
export const sendEmailNotification = functions.https.onCall(async (data, context) => {
  try {

    // Validate required fields
    if (!data) {
      console.error("No data received in Cloud Function call");
      throw new functions.https.HttpsError("invalid-argument", "No data received");
    }
    const { to, subject, text, html } = data.data;
    if (!to || !subject || (!text && !html)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required fields: 'to', 'subject', 'text' or 'html'."
      );
    }
    console.log("Received data:", to, subject, text, html); 

    // Create the email object
    const msg = {
      to, // Recipient email
      from: sender_email, // Verified sender email in SendGrid
      subject,
      text
    };
    console.log("Sending email:", msg);

    // Send the email
    await sgMail.send(msg);
    console.log("Email sent successfully");
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);

    // Handle errors and provide detailed response
    if (error.response && error.response.body) {
      throw new functions.https.HttpsError(
        "internal",
        "Failed to send email",
        error.response.body.errors
      );
    } else {
      throw new functions.https.HttpsError("internal", "An unexpected error occurred");
    }
  }
});
