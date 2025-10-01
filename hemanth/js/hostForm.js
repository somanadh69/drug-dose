// hostForm.js – Host hackathon form, localStorage, dynamic update

document.addEventListener('DOMContentLoaded', () => {
  const hostForm = document.getElementById('hostForm');
  const hostSuccess = document.getElementById('hostSuccess');

  hostForm.onsubmit = function(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(hostForm));
    let hackathons = JSON.parse(localStorage.getItem('hackathons')) || [];
    data.id = Date.now();
    hackathons.push(data);
    localStorage.setItem('hackathons', JSON.stringify(hackathons));
    hostForm.style.display = 'none';
    hostSuccess.style.display = 'block';
    setTimeout(() => {
      hostForm.reset();
      hostForm.style.display = 'block';
      hostSuccess.style.display = 'none';
    }, 1800);
  };
});
