document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

    const courses = [
        { title: 'WDD 130 - Web Fundamentals', type: 'WDD', completed: true },
        { title: 'WDD 131 - Dynamic Web Fundamentals', type: 'WDD', completed: true },
        { title: 'CSE 110 - Intro to Programming', type: 'CSE', completed: true },
        { title: 'CSE 210 - Programming with Classes', type: 'CSE', completed: true },
        { title: 'CSE 250 - Data Structures', type: 'CSE', completed: false },
        { title: 'WDD 230 - Web Frontend Development I', type: 'WDD', completed: true },
    ];


   document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".box3 ul li");
  const courseItems = document.querySelectorAll(".texts > *");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.textContent.trim().toLowerCase();

      courseItems.forEach(item => {
        const classList = item.classList;

        if (filter === "all") {
          item.style.display = "flex";
        } else if (classList.contains(filter)) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
});

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

 menuToggle.addEventListener('click', () => {
    mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
    });