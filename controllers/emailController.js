const nodemailer = require("nodemailer");
require("dotenv").config();

// Function to create a transporter using Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Gmail Address
      pass: process.env.EMAIL_PASS, // App Password (Generated from Google Account)
    },
  });
};

// Send feedback email
const sendEmail = async (req, res) => {
  const { firstName, lastName, email, messageContent } = req.body;

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVING_EMAIL,
      subject: `New Feedback from ${firstName} ${lastName}`,
      text: `User Email: ${email}\n\nMessage:\n${messageContent}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};

// Send security score email
const sendScoreEmail = async (req, res) => {
  const { email, scores, totalPercentage } = req.body;

  try {
    const transporter = createTransporter();

    // Generating HTML content for the email
    const emailContent = `
      <h1>Your Security Score Report</h1>
      <p>Your overall security score is: <strong>${totalPercentage}%</strong></p>
      <h2>Category-wise Scores:</h2>
      <ul>
        ${Object.entries(scores)
          .map(([category, score]) => `<li><strong>${category}:</strong> ${score}</li>`)
          .join("")}
      </ul>
      <p>Thank you for using our security assessment tool!</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Security Score Report",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};

module.exports = { sendEmail, sendScoreEmail };