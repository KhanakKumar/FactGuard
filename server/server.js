const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

app.post("/api/home", async (req, res) => {
    const { query1, query2 } = req.body;

    // Validate both inputs
    if (!query1 || typeof query1 !== "string" || !query2 || typeof query2 !== "string") {
        return res.status(400).json({ error: "Invalid input. Please enter valid texts." });
    }

    try {
        // Send both texts to Python FastAPI backend
        const response = await axios.post("http://localhost:5005/preprocess", {
            text1: query1,
            text2: query2
        });

        // Return Python API response to frontend
        return res.json(response.data);
    } catch (error) {
        console.error("Python API Error:", error.message);
        return res.status(500).json({ error: "Failed to process texts." });
    }
});

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});
