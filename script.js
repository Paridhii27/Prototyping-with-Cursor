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
    console.log(
      "Project 1 Name:",
      data.results[0].properties.Title.title[0].plain_text
    );
    console.log("Project 1 Website:", data.results[0].properties.Website.url);
    console.log(
      "Project 1 Image: ",
      data.results[0].properties.Images.files[0].file.url
    );

    if (data.results && Array.isArray(data.results)) {
      const projectName = document.getElementById(".project-name");
      const projectWebsites = document.querySelectorAll(".project-website");
      data.results.forEach((result, index) => {
        console.log(`Properties:`, result[index].properties);
        if (result[index].properties) {
          if (result[index].properties.Title?.title?.[0]?.plain_text) {
            console.log(
              `Project Name:`,
              result[index].properties.Title.title[0].plain_text
            );
            projectName.innerHTML =
              result[index].properties.Title.title[0].plain_text;
          }
          if (result[index].properties.Website?.url) {
            console.log(
              `Project Website:`,
              result[index].properties.Website.url
            );
          }
        }
      });
      return data;
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
