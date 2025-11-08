// Fetch data from Notion via the server
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
    console.log("Properties 1:", data.results[0].properties);
    console.log("Project 1 Website:", data.results[0].properties.Website.url);
    console.log("Project 1 Images:", data.results[0].properties.Images.id);
    console.log("Properties 1:", data.results[1].properties);
    console.log("Project 2 Website:", data.results[1].properties.Website.url);
    console.log("Project 2 Images:", data.results[1].properties.Images.id);
    console.log("Properties 1:", data.results[2].properties);
    console.log("Project 3 Website:", data.results[2].properties.Website.url);
    console.log("Project 3 Images:", data.results[2].properties.Images.id);
    console.log("Properties 1:", data.results[3].properties);
    console.log("Project 4 Website:", data.results[3].properties.Website.url);
    console.log("Project 4 Images:", data.results[3].properties.Images.id);
    console.log("Properties 1:", data.results[4].properties);
    console.log("Project 5 Website:", data.results[4].properties.Website.url);
    console.log("Project 5 Images:", data.results[4].properties.Images.id);
    console.log("Properties 1:", data.results[5].properties);
    console.log("Project 6 Website:", data.results[5].properties.Website.url);
    console.log("Project 6 Images:", data.results[5].properties.Images.id);
    // Process and display the data
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
