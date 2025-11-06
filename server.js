import express from "express";
import { Client } from "@notionhq/client";

const app = express();

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
