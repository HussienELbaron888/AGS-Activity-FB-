
const functions = require("firebase-functions");
const { Resend } = require("resend");
const admin = require("firebase-admin");

admin.initializeApp();

// Initialize Resend with the API key stored in Firebase config
// To set the key, run: firebase functions:config:set resend.key="YOUR_API_KEY"
const resendApiKey = functions.config().resend.key;
const resend = new Resend(resendApiKey);

/**
 * A general-purpose callable function to send emails via Resend.
 * This can be called from the frontend to handle various email sending needs.
 *
 * @param {object} data - The data passed to the function, expects { to, subject, html }.
 * @param {object} context - The context of the function call.
 */
exports.sendCustomActionEmail = functions.https.onCall(async (data, context) => {
  const { to, subject, html } = data;

  // Basic validation
  if (!to || !subject || !html) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with arguments 'to', 'subject', and 'html'."
    );
  }

  const payload = {
    from: "AGS Activities Hub <onboarding@resend.dev>", // Replace with your verified Resend domain later
    to: to,
    subject: subject,
    html: html,
  };

  try {
    const { data: resendData, error } = await resend.emails.send(payload);

    if (error) {
      console.error("Resend API Error:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to send email.",
        error
      );
    }

    console.log("Email sent successfully to:", to, "ID:", resendData.id);
    return { success: true, messageId: resendData.id };
  } catch (err) {
    console.error("Error in sendCustomActionEmail function:", err);
    throw new functions.https.HttpsError(
      "internal",
      "An unexpected error occurred while sending the email."
    );
  }
});
