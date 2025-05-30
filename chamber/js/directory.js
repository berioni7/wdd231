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

  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navMenu = document.getElementById("nav-menu");

  hamburgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });

});

const apiKey = '6da9767d31efd9546e30521b7bc64bb6';
const lat = -23.26;
const lon = -47.29;

const currentTempEl = document.querySelector('.current-weather .temp');
const currentDescEl = document.querySelector('.current-weather .description');

const day1TempEl = document.querySelector('.day1 .temp');
const day2TempEl = document.querySelector('.day2 .temp');
const day3TempEl = document.querySelector('.day3 .temp');

const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${apiKey}`;

const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=${apiKey}`;

async function getCurrentWeather() {
  try {
    const response = await fetch(currentWeatherUrl);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();
    currentTempEl.textContent = `${Math.round(data.main.temp)}°C`;
    currentDescEl.textContent = data.weather[0].description;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    currentTempEl.textContent = 'Error';
    currentDescEl.textContent = 'Unable to get data.';
  }
}

async function getForecast() {
  try {
    const response = await fetch(forecastUrl);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();

    const middayForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));

    if (middayForecasts.length >= 3) {
      day1TempEl.textContent = `${Math.round(middayForecasts[0].main.temp)}°C`;
      day2TempEl.textContent = `${Math.round(middayForecasts[1].main.temp)}°C`;
      day3TempEl.textContent = `${Math.round(middayForecasts[2].main.temp)}°C`;
    } else {
      day1TempEl.textContent = 'N/A';
      day2TempEl.textContent = 'N/A';
      day3TempEl.textContent = 'N/A';
    }
  } catch (error) {
    console.error('Error:', error);
    day1TempEl.textContent = 'Error';
    day2TempEl.textContent = 'Error';
    day3TempEl.textContent = 'Error';
  }
}

getCurrentWeather();
getForecast();

const companies = [
  {
    name: "O Boticário",
    phone: "+55 41 3317-9000",
    address: "Rua das Flores, 123, Curitiba, Paraná, Brazil",
    website: "https://www.boticario.com.br",
    membership: "Gold"
  },
  {
    name: "Decathlon",
    phone: "+33 1 30 48 88 88",
    address: "4 Boulevard de Mons, Villeneuve-d'Ascq, France",
    website: "https://www.decathlon.com",
    membership: "Silver"
  },
  {
    name: "Cacau Show",
    phone: "+55 11 4003-3030",
    address: "Av. Paulista, 1500, São Paulo, Brazil",
    website: "https://www.cacaushow.com.br",
    membership: "Gold"
  }
];

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function showSpotlights() {
  const container = document.getElementById('spotlight-cards');

  const eligibleCompanies = companies.filter(c => c.membership === 'Gold' || c.membership === 'Silver');

  const shuffled = shuffleArray(eligibleCompanies);
  const count = Math.floor(Math.random() * 2) + 2; 
  const selected = shuffled.slice(0, count);
  const mainfield = shuffleArray.slice(0, count);

  container.innerHTML = ''; 

  const images = ['images/i1.jpg', 'images/i2.jpg', 'images/i3.jpg'];

  selected.forEach((company, index) => {
    const card = document.createElement('div');
    card.classList.add('spotlight-card');
    card.innerHTML = `
      <img src="${images[index]}" alt="${company.name} Logo" class="spotlight-logo" />
      <h3>${company.name}</h3>
      <p><strong>Phone:</strong> ${company.phone}</p>
      <p><strong>Address:</strong> ${company.address}</p>
      <p><strong>Website:</strong> <a href="${company.website}" target="_blank" rel="noopener">${company.website}</a></p>
      <p class="membership-level">${company.membership} Member</p>
    `;
    container.appendChild(card);
  });
}
