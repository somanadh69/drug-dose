// studentProfile.js – Dynamic dashboard for student profile

document.addEventListener('DOMContentLoaded', () => {
  // Demo: Load student name from localStorage if available
  let students = JSON.parse(localStorage.getItem('students')) || [];
  let user = students[0] || { fullName: 'Student Name' };
  document.getElementById('profileName').textContent = user.fullName;

  // Rating graph (animated line)
  const ctx = document.getElementById('ratingGraph').getContext('2d');
  const points = [18, 22, 20, 25, 28, 32, 30, 36, 40, 38, 44, 40];
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

  // Animate progress bars
  setTimeout(() => {
    document.getElementById('easyBar').style.width = '80%';
    document.getElementById('mediumBar').style.width = '50%';
    document.getElementById('hardBar').style.width = '15%';
  }, 400);

  // Badges
  const badges = [
    { icon: 'assets/badge-star.svg', title: 'Hackathon Winner' },
    { icon: 'assets/badge-plus.svg', title: '10+ Events' },
    { icon: 'assets/badge-check.svg', title: 'Project Submitter' },
    { icon: 'assets/badge-star.svg', title: 'Top 5%' }
  ];
  const badgesGrid = document.getElementById('badgesGrid');
  badges.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge-card';
    div.innerHTML = `<img src="${b.icon}" class="badge-icon"><div class="badge-title">${b.title}</div>`;
    badgesGrid.appendChild(div);
  });

  // Activity timeline
  const activities = [
    'Won CodeSprint 2025 at IIT Bombay',
    'Submitted project "NeonHub"',
    'Attended RedHack at BITS Pilani',
    'Solved 10 Medium problems',
    'Won 2nd place at NeonNights',
    'Attended 2025 HackHub Summit'
  ];
  const timeline = document.getElementById('activityTimeline');
  activities.forEach(a => {
    const li = document.createElement('li');
    li.className = 'activity-item';
    li.textContent = a;
    timeline.appendChild(li);
  });
});
