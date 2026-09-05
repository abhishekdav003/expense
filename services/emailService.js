const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendForgotPasswordEmail = async (email, resetToken) => {
  try {
    const resetLink = `http://localhost:5500/reset-password.html?token=${resetToken}`;

    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME,
      },

      to: [
        {
          email: email,
        },
      ],

      subject: "Reset Your Password",

      htmlContent: `
          <h2>Password Reset Request</h2>

          <p>We received a request to reset your password.</p>

          <p>
            Click the link below to reset your password:
          </p>

          <a href="${resetLink}">
            Reset Password
          </a>

          <p>This link will expire in 15 minutes.</p>
        `,
    });

    console.log("Email sent successfully:", response);

    return response;
  } catch (error) {
    console.error("Brevo Email Error:", error.body || error.message);

    throw new Error("Failed to send email");
  }
};

module.exports = {
  sendForgotPasswordEmail,
};
