import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "./routes/moods.js"; // Ensure path is correct

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
app.use("/api/moods", moodRoutes);

// --- ADD THIS FOR PART 4 (Health Check) ---
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});