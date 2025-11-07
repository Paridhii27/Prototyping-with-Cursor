import express from "express";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

app.post("/notion-webhook", (req, res) => {
  console.log("📥 Incoming webhook from Notion:");
  console.log(JSON.stringify(req.body, null, 2)); // <-- print full body

  // Handle verification request
  if (req.body && req.body.verification_token) {
    console.log("✅ Verification token received:", req.body.verification_token);
    return res.status(200).send({ received: true });
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
