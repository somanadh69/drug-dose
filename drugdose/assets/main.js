// --- Loader and popup logic ---
function showLoader(show = true) {
	let loader = document.getElementById('globalLoader');
	if (!loader) {
		loader = document.createElement('div');
		loader.id = 'globalLoader';
		loader.className = 'loader';
		loader.innerHTML = '<div class="spinner"></div>';
		document.body.appendChild(loader);
	}
	loader.classList.toggle('active', show);
}

function showPopup(message, type = 'info') {
	let popup = document.getElementById('globalPopup');
	if (!popup) {
		popup = document.createElement('div');
		popup.id = 'globalPopup';
		popup.className = 'popup';
		popup.innerHTML = '<div class="popup-content"><div id="popupMsg"></div><button onclick="document.getElementById(\'globalPopup\').classList.remove(\'active\')">OK</button></div>';
		document.body.appendChild(popup);
	}
	document.getElementById('popupMsg').innerText = message;
	popup.classList.add('active');
}

// --- Page transition logic ---
function addPageTransitions() {
	document.querySelectorAll('a[href]').forEach(link => {
		if (link.getAttribute('target')) return;
		link.addEventListener('click', function(e) {
			const container = document.querySelector('.container');
			if (container) {
				e.preventDefault();
				container.classList.add('fade-out');
				setTimeout(() => { window.location = link.href; }, 400);
			}
		});
	});
}
// --- Dark mode toggle logic ---
function setDarkMode(enabled) {
	if (enabled) {
		document.body.classList.add('dark-mode');
		localStorage.setItem('darkMode', '1');
		if (document.getElementById('darkIcon')) document.getElementById('darkIcon').innerHTML = '<path d="M21.64 13.64A9 9 0 1 1 12 3a7 7 0 0 0 9.64 10.64z"></path>';
	} else {
		document.body.classList.remove('dark-mode');
		localStorage.setItem('darkMode', '0');
		if (document.getElementById('darkIcon')) document.getElementById('darkIcon').innerHTML = '<path d="M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm5.657 3.343a1 1 0 0 1 1.414 0l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414zM21 11a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2h1zm-2.929 7.071a1 1 0 0 1 0-1.414l.707-.707a1 1 0 1 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414 0zM12 20a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1zm-7.071-2.929a1 1 0 0 1 1.414 0l.707.707a1 1 0 1 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414zM4 13a1 1 0 1 1 0-2H3a1 1 0 1 1 0 2h1zm2.343-7.657a1 1 0 0 1 0 1.414l-.707.707A1 1 0 1 1 4.222 6.05l.707-.707a1 1 0 0 1 1.414 0zM12 6a6 6 0 1 1 0 12A6 6 0 0 1 12 6z"/>';
	}
}

function initDarkMode() {
	const saved = localStorage.getItem('darkMode');
	setDarkMode(saved === '1');
	const toggle = document.getElementById('darkToggle');
	if (toggle) {
		toggle.onclick = () => setDarkMode(!document.body.classList.contains('dark-mode'));
	}
}


// --- Auto-complete for drug input fields ---
const drugList = [
	"paracetamol", "ibuprofen", "amoxicillin", "azithromycin", "metformin", "atorvastatin", "omeprazole", "amitriptyline", "cetirizine", "ciprofloxacin", "doxycycline", "lisinopril", "losartan", "simvastatin", "levothyroxine", "amlodipine", "clopidogrel", "pantoprazole", "gabapentin", "tramadol"
];

function createAutocomplete(input) {
	let currentFocus;
	input.addEventListener("input", function() {
		let val = this.value;
		closeAllLists();
		if (!val) return false;
		currentFocus = -1;
		const list = document.createElement("div");
		list.setAttribute("class", "autocomplete-list");
		this.parentNode.appendChild(list);
		drugList.filter(drug => drug.toLowerCase().startsWith(val.toLowerCase()))
			.forEach(drug => {
				const item = document.createElement("div");
				item.innerHTML = `<span>${drug.substr(0, val.length)}</span><strong>${drug.substr(val.length)}</strong>`;
				item.className = "autocomplete-item";
				item.addEventListener("mousedown", function(e) {
					input.value = drug;
					closeAllLists();
				});
				list.appendChild(item);
			});
	});
	input.addEventListener("keydown", function(e) {
		let list = this.parentNode.querySelector(".autocomplete-list");
		if (list) list = list.getElementsByTagName("div");
		if (e.keyCode === 40) { // down
			currentFocus++;
			addActive(list);
		} else if (e.keyCode === 38) { // up
			currentFocus--;
			addActive(list);
		} else if (e.keyCode === 13) { // enter
			e.preventDefault();
			if (currentFocus > -1 && list) {
				list[currentFocus].dispatchEvent(new Event('mousedown'));
			}
		}
	});
	function addActive(list) {
		if (!list) return false;
		removeActive(list);
		if (currentFocus >= list.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = list.length - 1;
		list[currentFocus].classList.add("active");
	}
	function removeActive(list) {
		for (let i = 0; i < list.length; i++) {
			list[i].classList.remove("active");
		}
	}
	function closeAllLists(elmnt) {
		const lists = document.querySelectorAll(".autocomplete-list");
		lists.forEach(list => {
			if (elmnt !== list && elmnt !== input) list.parentNode.removeChild(list);
		});
	}
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}

window.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('input[type="text"]#drugName, input[type="text"]#buyDrugName').forEach(input => {
		createAutocomplete(input);
	});
	initDarkMode();
	addPageTransitions();
});