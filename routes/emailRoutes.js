const express = require("express");
const { sendEmail, sendScoreEmail } = require("../controllers/emailController"); // Import the new function

const router = express.Router();

router.post("/send-email", sendEmail);

router.post("/send-score-email", sendScoreEmail);

module.exports = router;