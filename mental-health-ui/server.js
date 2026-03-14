import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "../routes/moods.js";
// Make sure to import your database connection if it's defined in another file
// import db from "./db.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows Vue to communicate with Express
app.use(express.json());

// --- ADDED ROUTE START ---
app.post("/mood", async (req, res) => {
  console.log("POST /mood request received");
  console.log("Request body:", req.body);

  const mood = req.body.mood;
  
  try {
    // Note: Ensure 'db' is defined/imported in this file
    const result = await db.query(
      "INSERT INTO mood_log (mood) VALUES (?)",
      [mood]
    );

    console.log("Database insert result:", result);
    res.json({ message: "Mood saved successfully" });
  } catch (error) {
    console.error("Error in /mood route:", error);
    res.status(500).json({ error: "Database error" });
  }
});
// --- ADDED ROUTE END ---

// Routes
app.use("/api/moods", moodRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});