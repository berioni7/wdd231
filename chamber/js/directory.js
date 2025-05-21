document.addEventListener("DOMContentLoaded", () => {  
  const gridBtn = document.getElementById('grid-view');
  const listBtn = document.getElementById('list-view');
  const container = document.getElementById('members-container');

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

  async function loadMembers() {
    try {
      const response = await fetch("data/members.json");
      if (!response.ok) throw new Error("Error loading JSON");
      const data = await response.json();
      membersData = data;

      container.innerHTML = "";

      membersData.forEach((member, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        const imageSrc = `images/i${index + 1}.jpg`;

        card.innerHTML = `
          <img src="${imageSrc}" alt="Image ${index + 1}" class="card-logo" />
          <div class="card-content">
            <h3>${member.name}</h3>
            <p><strong>Industry:</strong> ${member.industry}</p>
            <p><strong>Location:</strong> ${member.location}</p>
            <button class="btn">Read More</button>
          </div>
        `;

        container.appendChild(card);
      });

      const readMoreButtons = container.querySelectorAll(".btn");

      readMoreButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();

          const cardContent = btn.closest(".card-content");
          const name = cardContent.querySelector("h3").textContent.trim();
          const memberIndex = findMemberIndexByName(name);

          if (memberIndex === -1) {
            alert("Member information not found.");
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
            const description = member.description || member.fullDescription || "No description.";

            fullInfoDiv.innerHTML = `
              <p><strong>Name:</strong> ${member.name || "N/A"}</p>
              <p><strong>Industry:</strong> ${member.industry || "N/A"}</p>
              <p><strong>Location:</strong> ${member.location || "N/A"}</p>
              <p><strong>Founded:</strong> ${member.founded || "N/A"}</p>
              <p><strong>Employees:</strong> ${member.employees || "N/A"}</p>
              <p><strong>Address:</strong> ${member.address || "N/A"}</p>
              <p><strong>Phone:</strong> ${member.phone || "N/A"}</p>
              <p><strong>Description:</strong> ${description}</p>
              ${
                member.website
                  ? `<p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website}</a></p>`
                  : ""
              }
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
      container.innerHTML = "<p>Sorry, we could not load the members at this time.</p>";
    }
  }

  loadMembers();

  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

  // Toggle do menu hambúrguer
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navMenu = document.getElementById("nav-menu");

  hamburgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

});
