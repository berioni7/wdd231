const slides = document.querySelectorAll('input[name="slider"]');
let current = 0;
const total = slides.length;

setInterval(() => {
  slides[current].checked = false;
  current = (current + 1) % total;
  slides[current].checked = true;
}, 4000); 


