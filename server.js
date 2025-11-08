import express from "express";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Checking if environment variables are loaded
const notionToken = process.env.NOTION_KEY?.trim();
const databaseId = process.env.NOTION_DATABASE_ID?.trim();

console.log("Environment Variables Check:");
console.log("NOTION_KEY exists:", !!notionToken);
console.log("NOTION_KEY length:", notionToken?.length || 0);
console.log("NOTION_DATABASE_ID exists:", !!databaseId);
console.log(
  "NOTION_DATABASE_ID:",
  databaseId ? `${databaseId.substring(0, 8)}...` : "missing"
);

// Validate token before initializing client
if (!notionToken) {
  console.error("ERROR: NOTION_KEY is not set!");
}

// Initialize Notion client
const notion = new Client({
  auth: notionToken,
});

// Notion webhook endpoint
app.post("/notion-webhook", (req, res) => {
  console.log("📥 Incoming webhook from Notion:");
  console.log(JSON.stringify(req.body, null, 2));

  // Handle verification request
  if (req.body && req.body.type === "verification") {
    console.log("Verification challenge received:", req.body.challenge);
    // Send a response to verify the webhook
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
app.post("/api/notion", async (req, res) => {
  try {
    // Use the databaseId variable that was already validated
    if (!databaseId) {
      return res
        .status(500)
        .json({ error: "NOTION_DATABASE_ID is not configured" });
    }

    if (!notionToken) {
      return res.status(500).json({ error: "NOTION_KEY is not configured" });
    }

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
app.post("/api/notion/page", async (req, res) => {
  try {
    const { pageId } = req.body;
    if (!pageId) {
      return res
        .status(400)
        .json({ error: "pageId is required in request body" });
    }
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
