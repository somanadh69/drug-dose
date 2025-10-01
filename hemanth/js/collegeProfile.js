// collegeProfile.js – Dynamic dashboard for college profile

document.addEventListener('DOMContentLoaded', () => {
  // Demo: Load college name from localStorage if available
  let colleges = JSON.parse(localStorage.getItem('colleges')) || [];
  let user = colleges[0] || { collegeName: 'BITS Pilani' };
  document.getElementById('collegeName').textContent = user.collegeName;

  // Ranking graph (animated line)
  const ctx = document.getElementById('collegeRankGraph').getContext('2d');
  const points = [30, 28, 25, 22, 20, 18, 15, 13, 10, 8, 7, 7];
  let progress = 0;
  function drawGraph() {
    ctx.clearRect(0,0,120,40);
    ctx.beginPath();
    ctx.moveTo(0, 40-points[0]);
    for (let i=1; i<points.length; i++) {
      ctx.lineTo(i*11, 40-points[i]);
    }
    ctx.strokeStyle = '#E50914';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#FF1E56';
    ctx.shadowBlur = 8;
    ctx.stroke();
    // Animate a moving dot
    if (progress < points.length) {
      ctx.beginPath();
      ctx.arc(progress*11, 40-points[progress], 4, 0, 2*Math.PI);
      ctx.fillStyle = '#FF1E56';
      ctx.shadowBlur = 12;
      ctx.fill();
      progress++;
      setTimeout(drawGraph, 90);
    }
  }
  drawGraph();

  // Badges
  const badges = [
    { icon: 'assets/badge-star.svg', title: 'Top Organizer' },
    { icon: 'assets/badge-plus.svg', title: 'Best Participation 2024' },
    { icon: 'assets/badge-check.svg', title: '1000+ Students' }
  ];
  const badgesGrid = document.getElementById('collegeBadgesGrid');
  badges.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge-card';
    div.innerHTML = `<img src="${b.icon}" class="badge-icon"><div class="badge-title">${b.title}</div>`;
    badgesGrid.appendChild(div);
  });

  // Events banner (auto-scroll)
  const posters = [
    'assets/iitb.png',
    'assets/bits.png',
    'assets/vit.png',
    'assets/iitb.png',
    'assets/bits.png'
  ];
  const banner = document.getElementById('eventsBanner');
  posters.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'event-poster';
    banner.appendChild(img);
  });

  // Events list
  const events = [
    { title: 'RedHack 2025', date: 'Nov 2-4, 2025', poster: 'assets/bits.png' },
    { title: 'CodeSprint', date: 'Oct 10-12, 2025', poster: 'assets/iitb.png' },
    { title: 'NeonNights', date: 'Dec 1-3, 2025', poster: 'assets/vit.png' }
  ];
  const eventsList = document.getElementById('eventsList');
  events.forEach(e => {
    const div = document.createElement('div');
    div.className = 'event-card';
    div.innerHTML = `<img src="${e.poster}"><div class="event-info"><div class="event-title">${e.title}</div><div class="event-date">${e.date}</div></div>`;
    eventsList.appendChild(div);
  });
});
