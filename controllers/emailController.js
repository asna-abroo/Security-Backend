const nodemailer = require("nodemailer");
require("dotenv").config(); // Ensure environment variables are loaded

const sendEmail = async (req, res) => {
  const { firstName, lastName, email, messageContent } = req.body;

  try {
    const userEmail = process.env.EMAIL_USER;
    const userPassword = process.env.EMAIL_PASS;
    const receivingEmail = process.env.RECEIVING_EMAIL;

    if (!userEmail || !userPassword || !receivingEmail) {
      throw new Error("Missing required environment variables");
    }

    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: userEmail,
        pass: userPassword,
      },
    });

    let mailOptions = {
      from: userEmail,
      to: receivingEmail,
      subject: `New Feedback from ${firstName} ${lastName}`,
      text: `User Email: ${email}\n\nMessage:\n${messageContent}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Stack Trace:", error.stack);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};

const sendScoreEmail = async (req, res) => {
  const { email, scores, totalPercentage } = req.body;

  try {
    const userEmail = process.env.EMAIL_USER;
    const userPassword = process.env.EMAIL_PASS;

    if (!userEmail || !userPassword) {
      throw new Error("Missing required environment variables");
    }

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,   // SMTP server from .env
      port: process.env.SMTP_PORT,     // SMTP port from .env
      secure: false, // `true` for port 465, `false` for 587
      auth: {
        user: userEmail,
        pass: userPassword,
      },
    });    

    // Format the email content
    const emailContent = `
      <h1>Your Security Score Report</h1>
      <p>Your overall security score is: <strong>${totalPercentage}%</strong></p>
      <h2>Category-wise Scores:</h2>
      <ul>
        ${Object.entries(scores)
          .map(
            ([category, score]) => `
          <li><strong>${category}:</strong> ${score}</li>
        `
          )
          .join("")}
      </ul>
      <p>Thank you for using our security assessment tool!</p>
    `;

    let mailOptions = {
      from: userEmail,
      to: email,
      subject: "Your Security Score Report",
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error.message);
    console.error("Stack Trace:", error.stack);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
};

module.exports = { sendEmail, sendScoreEmail };