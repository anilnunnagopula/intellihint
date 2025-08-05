const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middlewares/authMiddleware"); // Import protect middleware

// IMPORTANT: Removed 'const fetch = require('node-fetch');' from here.
// node-fetch is now dynamically imported within the async route handler.

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Authentication routes
app.use("/api/auth", authRoutes);

// AI Service Route (Protected) - Directly calls Gemini API
app.post("/api/ai/analyze-problem", protect, async (req, res) => {
  // Dynamically import node-fetch here, inside the async function
  const fetch = (await import("node-fetch")).default; // Use .default for ES Module default export

  const { prompt, problem } = req.body; // 'prompt' will contain the structured request for Gemini

  if (!prompt || !problem) {
    return res
      .status(400)
      .json({ message: "Prompt and problem are required." });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res
      .status(500)
      .json({
        message: "GEMINI_API_KEY is not configured in environment variables.",
      });
  }

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }], // Send the structured prompt to Gemini
        },
      ],
      generationConfig: {
        responseMimeType: "application/json", // Request JSON output
      },
    };

    // Implement exponential backoff for retries
    let attempts = 0;
    const maxAttempts = 3;
    let geminiResponse;

    while (attempts < maxAttempts) {
      try {
        geminiResponse = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (geminiResponse.ok) {
          break; // Exit loop if successful
        } else {
          const errorText = await geminiResponse.text();
          console.error(
            `Attempt ${attempts + 1}: Error from Gemini API: ${
              geminiResponse.status
            } - ${errorText}`
          );
          if (geminiResponse.status === 429 || geminiResponse.status >= 500) {
            // Retry on Too Many Requests or server errors
            attempts++;
            const delay = Math.pow(2, attempts) * 1000; // Exponential backoff
            await new Promise((resolve) => setTimeout(resolve, delay));
          } else {
            throw new Error(
              `Failed to get response from Gemini API: ${geminiResponse.status} ${errorText}`
            );
          }
        }
      } catch (innerError) {
        console.error(
          `Attempt ${attempts + 1}: Network or fetch error to Gemini API: ${
            innerError.message
          }`
        );
        attempts++;
        const delay = Math.pow(2, attempts) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    if (!geminiResponse || !geminiResponse.ok) {
      throw new Error(
        "Failed to get response from Gemini API after multiple retries."
      );
    }

    const result = await geminiResponse.json();

    // Extract the JSON string from Gemini's response and parse it
    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      const jsonString = result.candidates[0].content.parts[0].text;
      const parsedData = JSON.parse(jsonString); // Parse the JSON string
      res.json(parsedData); // Send the parsed JSON back to the frontend
    } else {
      console.error("Unexpected Gemini API response structure:", result);
      res.status(500).json({ message: "Unexpected response from AI model." });
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res
      .status(500)
      .json({ message: "Internal server error or AI service unavailable." });
  }
});

// Basic root route for API status check
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
