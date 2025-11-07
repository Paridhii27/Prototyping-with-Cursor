import express from "express";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// IMPORTANT: Add body parser middleware BEFORE your routes
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Notion webhook endpoint
app.post("/notion-webhook", (req, res) => {
  console.log("📥 Incoming webhook from Notion:");
  console.log(JSON.stringify(req.body, null, 2));

  // Handle verification request (Notion sends a challenge that must be echoed back)
  if (req.body && req.body.type === "verification") {
    console.log("Verification challenge received:", req.body.challenge);
    // Echo back the challenge to verify the webhook
    return res.status(200).json({ challenge: req.body.challenge });
  }

  // Handle actual webhook events
  if (
    (req.body && req.body.type === "page_updated") ||
    req.body.type === "page_added"
  ) {
    console.log("Webhook event received:", req.body.type);
    // Process the webhook event here
  }

  res.status(200).send("ok");
});

// API endpoint to fetch Notion data
app.get("/api/notion", async (req, res) => {
  try {
    // Replace with your actual database ID
    const databaseId = process.env.NOTION_DATABASE_ID;

    const response = await notion.databases.query({
      database_id: databaseId,
    });

    res.json(response);
  } catch (error) {
    console.error("Error fetching from Notion:", error);
    res.status(500).json({ error: error.message });
  }
});

// Example endpoint to get a specific page
app.get("/api/notion/page/:pageId", async (req, res) => {
  try {
    const { pageId } = req.params;
    const response = await notion.pages.retrieve({ page_id: pageId });
    res.json(response);
  } catch (error) {
    console.error("Error fetching page:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
