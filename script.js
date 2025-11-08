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

// Fetch a specific page from Notion
async function fetchNotionPage(pageId) {
  try {
    const response = await fetch("/api/notion/page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pageId }),
    });
    const data = await response.json();
    console.log("Notion page data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching Notion page:", error);
    return null;
  }
}

// Fetch page content (blocks) from Notion
async function fetchNotionPageContent(pageId) {
  try {
    const response = await fetch("/api/notion/page-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pageId: pageId }),
    });
    const data = await response.json();
    console.log("Notion page content:", data);

    // Display the content on your webpage
    if (data.blocks && data.blocks.length > 0) {
      const container = document.querySelector(".description-text");
      if (container) {
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
      }
    }
    return data;
  } catch (error) {
    console.error("Error fetching Notion page content:", error);
    return null;
  }
}

// Call when page loads
document.addEventListener("DOMContentLoaded", () => {
  fetchNotionData();

  // Example: If you have a page ID, you can fetch its content
  // Uncomment and replace with your actual page ID:
  // const pageId = "your-page-id-here";
  // fetchNotionPageContent(pageId);
});
