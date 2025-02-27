require("dotenv").config();

const express = require("express");
const emailRoutes = require("./routes/emailRoutes");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.use("/api", emailRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});