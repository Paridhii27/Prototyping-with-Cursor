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

// Call when page loads
document.addEventListener("DOMContentLoaded", fetchNotionData);
