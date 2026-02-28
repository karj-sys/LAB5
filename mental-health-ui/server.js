import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "../routes/moods.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows Vue to communicate with Express
app.use(express.json());

// Routes
app.use("/api/moods", moodRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});