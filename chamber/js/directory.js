document.addEventListener("DOMContentLoaded", () => {
  const gridBtn = document.getElementById('grid-view');
  const listBtn = document.getElementById('list-view');
  const container = document.getElementById('members-container');

  gridBtn.addEventListener('click', () => {
    container.classList.add('grid-view');
    container.classList.remove('list-view');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
  });

  listBtn.addEventListener('click', () => {
    container.classList.add('list-view');
    container.classList.remove('grid-view');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

document.addEventListener("DOMContentLoaded", () => {
  const membersContainer = document.getElementById("members-container");

  let membersData = [];

  function normalizeString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();
  }

  function findMemberIndexByName(name) {
    const normalizedName = normalizeString(name);
    return membersData.findIndex(
      (member) => normalizeString(member.name) === normalizedName
    );
  }

  async function loadMembers() {
    try {
      const response = await fetch("data/members.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      membersData = data;

      const readMoreButtons = document.querySelectorAll(".btn");

      readMoreButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();

          const cardContent = btn.closest(".card-content");
          const name = cardContent.querySelector("h3").textContent.trim();

          const memberIndex = findMemberIndexByName(name);

          if (memberIndex === -1) {
            alert("Member info not found in JSON.");
            return;
          }

          const member = membersData[memberIndex];

          let fullInfoDiv = cardContent.querySelector(".full-info");

          if (!fullInfoDiv) {
            fullInfoDiv = document.createElement("div");
            fullInfoDiv.classList.add("full-info");
            fullInfoDiv.style.marginTop = "1rem";
            fullInfoDiv.style.textAlign = "left";
            fullInfoDiv.style.borderTop = "1px solid #ccc";
            fullInfoDiv.style.paddingTop = "1rem";

            cardContent.appendChild(fullInfoDiv);
          }

          if (fullInfoDiv.style.display === "block") {
            fullInfoDiv.style.display = "none";
            btn.textContent = "Read More";
          } else {
            const description =
              member.description || member.fullDescription || "No description.";

            fullInfoDiv.innerHTML = `
              <p><strong>Name:</strong> ${member.name || "N/A"}</p>
              <p><strong>Industry:</strong> ${member.industry || "N/A"}</p>
              <p><strong>Location:</strong> ${member.location || "N/A"}</p>
              <p><strong>Founded:</strong> ${member.founded || "N/A"}</p>
              <p><strong>Employees:</strong> ${member.employees || "N/A"}</p>
              <p><strong>Description:</strong> ${description}</p>
              ${
                member.website
                  ? `<p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>`
                  : ""
              }
              ${member.phone ? `<p><strong>Phone:</strong> ${member.phone}</p>` : ""}
              ${
                member.email
                  ? `<p><strong>Email:</strong> <a href="mailto:${member.email}">${member.email}</a></p>`
                  : ""
              }
            `;
            fullInfoDiv.style.display = "block";
            btn.textContent = "Read Less";
          }
        });
      });
    } catch (error) {
      console.error("Error loading members:", error);
      membersContainer.innerHTML =
        "<p>Sorry, we could not load the members at this time.</p>";
    }
  }

  loadMembers();
});



