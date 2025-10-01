// scrollEffects.js – Scroll reveal & parallax for HackHub

document.addEventListener('DOMContentLoaded', () => {
  // Section reveal
  const blocks = document.querySelectorAll('.scroll-block');
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  blocks.forEach(block => observer.observe(block));

  // Parallax neon lines (background effect)
  // (For demo, add subtle lines to body background)
  const parallaxLines = document.createElement('div');
  parallaxLines.className = 'parallax-lines';
  document.body.appendChild(parallaxLines);
  for (let i = 0; i < 6; i++) {
    const line = document.createElement('div');
    line.className = 'parallax-line';
    line.style.top = `${10 + i * 15}vh`;
    parallaxLines.appendChild(line);
  }
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelectorAll('.parallax-line').forEach((line, i) => {
      line.style.transform = `translateX(${Math.sin(scrollY/200 + i) * 40}px)`;
    });
  });
});
