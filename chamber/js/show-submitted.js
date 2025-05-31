document.addEventListener('DOMContentLoaded', () => {
  const dataJSON = localStorage.getItem('joinFormData');

  if (dataJSON) {
    const data = JSON.parse(dataJSON);
    document.getElementById('firstName').textContent = data.fname || '';
    document.getElementById('lastName').textContent = data.lname || '';
    document.getElementById('email').textContent = data.email || '';
    document.getElementById('phone').textContent = data.phone || '';
    document.getElementById('business').textContent = data.organization || '';
    document.getElementById('timestamp').textContent = data.timestamp || '';

  } else {
    alert('No form data found. Please fill the form first.');
    window.location.href = 'join.html';
  }
});
