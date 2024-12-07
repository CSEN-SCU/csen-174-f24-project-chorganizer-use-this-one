import functions from "firebase-functions";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const KEY = process.env.SEND_GRID_KEY_UNRESTRICTED;
if (!KEY) {
  throw new Error("sendgrid api key environment variable is not set");
}
// Set SendGrid API Key
sgMail.setApiKey(KEY);

const sender_email = "choreganizerapp@gmail.com";
// Cloud Function
export const sendEmailNotification = functions.https.onRequest(async (req, res) => {
  try {
    // Extract email data from the request body
    const { to, subject, text, html } = req.body;

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      return res.status(400).send("Missing required fields: 'to', 'subject', 'text' or 'html'.");
    }

    // Create the email object
    const msg = {
      to, // Recipient email
      from: sender_email, // Verified sender email in SendGrid
      subject,
      text,
      html,
    }

    // Send the email
    await sgMail.send(msg);
    console.log("Email sent successfully");
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);

    // Return error details to the client
    if (error.response && error.response.body) {
      return res.status(500).json({
        message: "Failed to send email",
        details: error.response.body.errors,
      });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
});