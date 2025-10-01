// auth.js – Login & Sign Up logic for Hackathon Hub

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const studentTab = document.getElementById('studentTab');
  const collegeTab = document.getElementById('collegeTab');
  const studentLogin = document.getElementById('studentLogin');
  const studentSignUp = document.getElementById('studentSignUp');
  const collegeLogin = document.getElementById('collegeLogin');
  const collegeSignUp = document.getElementById('collegeSignUp');
  const authSuccess = document.getElementById('authSuccess');

  function showForm(form) {
    [studentLogin, studentSignUp, collegeLogin, collegeSignUp].forEach(f => f.style.display = 'none');
    form.style.display = 'flex';
    authSuccess.style.display = 'none';
  }

  studentTab.onclick = () => {
    studentTab.classList.add('active');
    collegeTab.classList.remove('active');
    showForm(studentLogin);
  };
  collegeTab.onclick = () => {
    collegeTab.classList.add('active');
    studentTab.classList.remove('active');
    showForm(collegeLogin);
  };

  // Switch between login/signup
  document.getElementById('showStudentSignUp').onclick = e => { e.preventDefault(); showForm(studentSignUp); };
  document.getElementById('showStudentLogin').onclick = e => { e.preventDefault(); showForm(studentLogin); };
  document.getElementById('showCollegeSignUp').onclick = e => { e.preventDefault(); showForm(collegeSignUp); };
  document.getElementById('showCollegeLogin').onclick = e => { e.preventDefault(); showForm(collegeLogin); };

  // Validation helpers
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function showSuccess(msg) {
    authSuccess.textContent = msg;
    authSuccess.style.display = 'block';
  }
  function hideSuccess() {
    authSuccess.style.display = 'none';
  }

  // Student Sign Up
  studentSignUp.onsubmit = function(e) {
    e.preventDefault();
    const id = this.studentId.value.trim();
    const name = this.fullName.value.trim();
    const email = this.email.value.trim();
    const pass = this.password.value;
    const cpass = this.confirmPassword.value;
    if (!id || !name || !email || !pass || !cpass) return showSuccess('Please fill all fields.');
    if (!validateEmail(email)) return showSuccess('Invalid email format.');
    if (pass !== cpass) return showSuccess('Passwords do not match.');
    let students = JSON.parse(localStorage.getItem('students')) || [];
    if (students.some(s => s.studentId === id || s.email === email)) return showSuccess('Account already exists.');
    students.push({ studentId: id, fullName: name, email, password: pass });
    localStorage.setItem('students', JSON.stringify(students));
    showSuccess('Sign up successful! You can now login.');
    setTimeout(() => { showForm(studentLogin); }, 1200);
  };
  // Student Login
  studentLogin.onsubmit = function(e) {
    e.preventDefault();
    const idOrEmail = this.studentIdOrEmail.value.trim();
    const pass = this.password.value;
    let students = JSON.parse(localStorage.getItem('students')) || [];
    const user = students.find(s => s.studentId === idOrEmail || s.email === idOrEmail);
    if (!user || user.password !== pass) return showSuccess('Invalid credentials.');
    showSuccess('Login successful! Redirecting...');
    setTimeout(() => { window.location.href = 'student-profile.html'; }, 1200);
  };
  // College Sign Up
  collegeSignUp.onsubmit = function(e) {
    e.preventDefault();
    const id = this.collegeId.value.trim();
    const name = this.collegeName.value.trim();
    const email = this.email.value.trim();
    const pass = this.password.value;
    const cpass = this.confirmPassword.value;
    if (!id || !name || !email || !pass || !cpass) return showSuccess('Please fill all fields.');
    if (!validateEmail(email)) return showSuccess('Invalid email format.');
    if (pass !== cpass) return showSuccess('Passwords do not match.');
    let colleges = JSON.parse(localStorage.getItem('colleges')) || [];
    if (colleges.some(c => c.collegeId === id || c.email === email)) return showSuccess('Account already exists.');
    colleges.push({ collegeId: id, collegeName: name, email, password: pass });
    localStorage.setItem('colleges', JSON.stringify(colleges));
    showSuccess('Sign up successful! You can now login.');
    setTimeout(() => { showForm(collegeLogin); }, 1200);
  };
  // College Login
  collegeLogin.onsubmit = function(e) {
    e.preventDefault();
    const idOrEmail = this.collegeIdOrEmail.value.trim();
    const pass = this.password.value;
    let colleges = JSON.parse(localStorage.getItem('colleges')) || [];
    const user = colleges.find(c => c.collegeId === idOrEmail || c.email === idOrEmail);
    if (!user || user.password !== pass) return showSuccess('Invalid credentials.');
    showSuccess('Login successful! Redirecting...');
    setTimeout(() => { window.location.href = 'college-profile.html'; }, 1200);
  };
});
