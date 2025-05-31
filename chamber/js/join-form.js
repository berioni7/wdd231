document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('joinForm');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = {
      fname: form.fname.value,
      lname: form.lname.value,
      email: form.email.value,
      phone: form.phone.value,
      organization: form.organization.value,
      membership: form.membership.value,
      timestamp: new Date().toLocaleString()
    };

    localStorage.setItem('joinFormData', JSON.stringify(data));

    window.location.href = 'thankyou.html';
  });
});
