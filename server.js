require("dotenv").config();

const cors = require("cors");
const express = require("express");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"] // Required headers
}));

const emailRoutes = require("./routes/emailRoutes");
app.use("/api", emailRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
