import express from "express";
import { Client, iteratePaginatedAPI } from "@notionhq/client";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

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
const notionPageId = process.env.NOTION_PAGE_ID?.trim();

console.log("Environment Variables Check:");
// Validate token before initializing client
if (!notionToken) {
  console.error("ERROR: NOTION_KEY is not set!");
} else if (!databaseId) {
  console.error("ERROR: NOTION_DATABASE_ID is not set!");
} else if (!notionPageId) {
  console.error("ERROR: NOTION_PAGE_ID is not set!");
} else {
  console.log("Environment variables are set correctly");
}

// Initialize Notion client
const notion = new Client({
  auth: notionToken,
});

//Function to get plain text from rich text blocks in Notion
// const getPlainTextFromRichText = (richText) => {
//   if (!richText || !Array.isArray(richText)) return "";
//   return richText.map((t) => t.plain_text).join("");
// };

// Helper function to get media source text (for images, videos, files, etc.)
// const getMediaSourceText = (block) => {
//   const blockData = block[block.type];
//   let source = "";
//   let caption = "";

//   if (blockData.external) {
//     source = blockData.external.url || "";
//   } else if (blockData.file) {
//     source = blockData.file.url || "";
//   } else if (blockData.url) {
//     source = blockData.url || "";
//   }

//   if (blockData.caption && Array.isArray(blockData.caption)) {
//     caption = getPlainTextFromRichText(blockData.caption);
//   }

//   if (caption) {
//     return caption + ": " + source;
//   }
//   return source;
// };

// // Helper function to get text from any block type
// const getTextFromBlock = (block) => {
//   let text = "";

//   // Get rich text from blocks that support it
//   if (block[block.type]?.rich_text) {
//     text = getPlainTextFromRichText(block[block.type].rich_text);
//   } else {
//     // Handle other block types
//     switch (block.type) {
//       case "bookmark":
//         text = block.bookmark?.url || "";
//         break;
//       case "child_page":
//         text = block.child_page?.title || "";
//         break;
//       case "child_database":
//         text = block.child_database?.title || "";
//         break;
//       case "equation":
//         text = block.equation?.expression || "";
//         break;
//       case "link_preview":
//         text = block.link_preview?.url || "";
//         break;
//       case "embed":
//       case "video":
//       case "file":
//       case "image":
//       case "pdf":
//         text = getMediaSourceText(block);
//         break;
//       case "table":
//         text = "Table width: " + (block.table?.table_width || 0);
//         break;
//       case "table_of_contents":
//         text = "Table of Contents";
//         break;
//       case "divider":
//         text = "---";
//         break;
//       case "unsupported":
//         text = "[Unsupported block type]";
//         break;
//       default:
//         text = "";
//         break;
//     }
//   }

//   return {
//     type: block.type,
//     text: text,
//     has_children: block.has_children || false,
//   };
// };

// Notion webhook endpoint verification
app.post("/notion-webhook", (req, res) => {
  console.log("Incoming webhook from Notion:");
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

// API endpoint to fetch page content (blocks) from Notion
// app.post("/api/notion/page-content", async (req, res) => {
//   try {
//     const { pageId } = req.body;

//     console.log("Page ID:", pageId);

//     if (!pageId) {
//       return res
//         .status(400)
//         .json({ error: "pageId is required in request body" });
//     }

//     if (!notionToken) {
//       return res.status(500).json({ error: "NOTION_KEY is not configured" });
//     }

//     // Fetch all blocks from the page
//     const blocks = [];
//     for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
//       block_id: pageId,
//     })) {
//       blocks.push(block);
//     }

//     // Parse text from each block
//     const parsedBlocks = blocks.map((block) => getTextFromBlock(block));

//     console.log("Total blocks fetched:", parsedBlocks.length);

//     res.json({
//       success: true,
//       pageId: pageId,
//       totalBlocks: parsedBlocks.length,
//       blocks: parsedBlocks,
//     });
//   } catch (error) {
//     console.error("Error fetching page content:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
