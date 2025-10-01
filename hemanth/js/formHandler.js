// formHandler.js – Hackathon listing, modal, registration, localStorage

const hackathons = JSON.parse(localStorage.getItem('hackathons')) || [
  {
    id: 1,
    name: 'CodeSprint 2025',
    college: 'IIT Bombay',
    date: 'Oct 10-12, 2025',
    logo: 'assets/iitb.png',
    desc: 'India’s biggest student hackathon. 48 hours of code, fun, and prizes!'
  },
  {
    id: 2,
    name: 'RedHack',
    college: 'BITS Pilani',
    date: 'Nov 2-4, 2025',
    logo: 'assets/bits.png',
    desc: 'Crimson-themed hackathon for creative coders.'
  },
  {
    id: 3,
    name: 'NeonNights',
    college: 'VIT Vellore',
    date: 'Dec 1-3, 2025',
    logo: 'assets/vit.png',
    desc: 'Futuristic challenges, neon vibes, and tech talks.'
  }
];

function renderHackathons(list) {
  const grid = document.getElementById('hackathonGrid');
  grid.innerHTML = '';
  list.forEach(h => {
    const card = document.createElement('div');
    card.className = 'hackathon-card';
    card.innerHTML = `
      <div class="hackathon-logo"><img src="${h.logo}" alt="${h.college}"></div>
      <div class="hackathon-info">
        <h3>${h.name}</h3>
        <p class="college">${h.college}</p>
        <p class="date">${h.date}</p>
        <p class="desc">${h.desc}</p>
        <button class="register-btn cta-btn" data-id="${h.id}">Register</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Modal logic
const modalOverlay = document.getElementById('modalOverlay');
const registerModal = document.getElementById('registerModal');
const closeModal = document.getElementById('closeModal');
const registerForm = document.getElementById('registerForm');
const modalSuccess = document.getElementById('modalSuccess');

function openModal() {
  modalOverlay.classList.add('active');
  registerModal.classList.add('show');
  registerForm.style.display = 'block';
  modalSuccess.style.display = 'none';
}
function closeModalFn() {
  modalOverlay.classList.remove('active');
  registerModal.classList.remove('show');
}
closeModal.onclick = closeModalFn;
modalOverlay.onclick = e => { if (e.target === modalOverlay) closeModalFn(); };

document.addEventListener('click', e => {
  if (e.target.classList.contains('register-btn')) {
    openModal();
    registerForm.setAttribute('data-hackathon', e.target.dataset.id);
  }
});

registerForm.onsubmit = function(e) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(registerForm));
  const hackathonId = registerForm.getAttribute('data-hackathon');
  let registrations = JSON.parse(localStorage.getItem('registrations')) || [];
  registrations.push({ ...data, hackathonId, time: Date.now() });
  localStorage.setItem('registrations', JSON.stringify(registrations));
  registerForm.style.display = 'none';
  modalSuccess.style.display = 'block';
  setTimeout(closeModalFn, 1800);
};

// Search/filter
const searchInput = document.getElementById('searchInput');
searchInput.oninput = function() {
  const val = searchInput.value.toLowerCase();
  renderHackathons(hackathons.filter(h =>
    h.name.toLowerCase().includes(val) ||
    h.college.toLowerCase().includes(val) ||
    h.desc.toLowerCase().includes(val)
  ));
};

document.getElementById('filterBtn').onclick = () => searchInput.oninput();

// Initial render
renderHackathons(hackathons);
