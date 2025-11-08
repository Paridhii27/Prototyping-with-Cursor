// Fetch data from Notion via your server
async function fetchNotionData() {
  try {
    const response = await fetch("/api/notion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Notion data:", data);
    console.log("Page ID:", data.properties);

    notionPageId = data.properties.ID.rich_text[0].plain_text;
    console.log("Notion page ID:", notionPageId);
    fetchNotionPageContent(notionPageId);

    // Process and display the data
    // Example: populate project cards
    if (data.results) {
      const projectCards = document.querySelectorAll(".project-card");
      data.results.forEach((page, index) => {
        if (projectCards[index]) {
          // Extract title or other properties from the page
          const title =
            page.properties?.Name?.title?.[0]?.plain_text ||
            `Project ${index + 1}`;
          projectCards[index].textContent = title;
        }
      });
    }
  } catch (error) {
    console.error("Error fetching Notion data:", error);
  }
}

// Fetch page content (blocks) from Notion
async function fetchNotionPageContent(pageId) {
  try {
    console.log("Fetching page content for page ID:", pageId);

    const response = await fetch("/api/notion/page-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pageId: pageId }),
    });
    const data = await response.json();

    console.log("Page content received. Page ID:", data.pageId);

    // Display the content on your webpage
    if (data.blocks && data.blocks.length > 0) {
      const container = document.querySelector(".description-text");
      if (container) {
        const previousContent = container.innerHTML;

        // Clear existing content
        container.innerHTML = "";

        // Add each block's text
        data.blocks.forEach((block) => {
          if (block.text) {
            const p = document.createElement("p");
            p.textContent = block.text;
            p.className = `notion-block notion-block-${block.type}`;
            container.appendChild(p);
          }
        });

        // Check if content changed
        if (previousContent !== container.innerHTML) {
          console.log("Page content updated on website");
        } else {
          console.log("Page content unchanged");
        }
      } else {
        console.log("Container not found");
      }
    } else {
      console.log("No blocks to display");
    }
    return data;
  } catch (error) {
    console.error("Error fetching Notion page content:", error);
    return null;
  }
}

// Call when the page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchNotionData();
});
