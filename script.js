const btnE1 = document.getElementById("btn");
const resetBtn = document.getElementById("resetBtn");
const birthdayE1 = document.getElementById("Birthday");
const resultE1 = document.getElementById("result");
const loader = document.getElementById("loader");
const dots = document.getElementById("dots");

let typingTimer = null; // so we can cancel previous typing animations

// Prevent choosing a future date in the picker
birthdayE1.max = new Date().toISOString().split("T")[0];

// Events
btnE1.addEventListener("click", calculateAge);
resetBtn?.addEventListener("click", resetForm);
birthdayE1.addEventListener("keydown", (e) => {
  if (e.key === "Enter") calculateAge();
});

function resetForm() {
  if (typingTimer) clearInterval(typingTimer);
  birthdayE1.value = "";
  resultE1.textContent = "✨ Now we will calculate your age ✨";
  hideLoader();
}

function calculateAge() {
  const value = birthdayE1.value;
  if (!value) return showResult("⚠️ Please enter your birthday");

  const birthDate = parseDateLocal(value); // timezone-safe
  const today = new Date();

  if (birthDate > today) {
    return showResult("⚠️ Please select a past date (no future birthdays).");
  }

  // Show loader while "calculating"
  showLoader();

  // Simulate a short delay (so loader is visible)
  setTimeout(() => {
    const { years, months, days } = diffYMD(birthDate, today);
    const msg = `🎂 You are ${years} ${plural(years, "year")}, ${months} ${plural(months, "month")} and ${days} ${plural(days, "day")} old 🎉`;

    hideLoader();
    typeEffect(msg);
  }, 1000); // 1s delay for effect
}

// Parse "YYYY-MM-DD" as a LOCAL date (avoids UTC shift issues)
function parseDateLocal(yyyy_mm_dd) {
  const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Difference in years, months, days
function diffYMD(from, to) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

function plural(n, word) {
  return n === 1 ? word : word + "s";
}

function showResult(text) {
  if (typingTimer) clearInterval(typingTimer);
  resultE1.textContent = text;
  hideLoader();
}

function typeEffect(text) {
  if (typingTimer) clearInterval(typingTimer);
  resultE1.textContent = "";
  let i = 0;
  const speed = 25; // ms per char
  typingTimer = setInterval(() => {
    resultE1.textContent += text.charAt(i++);
    if (i >= text.length) clearInterval(typingTimer);
  }, speed);
}

// Loader functions
function showLoader() {
  loader.style.display = "block";
  dots.style.display = "block";
  resultE1.textContent = ""; // clear previous result
}

function hideLoader() {
  loader.style.display = "none";
  dots.style.display = "none";
}
