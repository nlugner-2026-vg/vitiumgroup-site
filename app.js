// app.js — deterministic keypad generation (no duplication)

const pinInput = document.getElementById("pin");
const loginBtn = document.getElementById("loginBtn");
const errorBox = document.getElementById("error");
const keypadContainer = document.getElementById("keypad-container");

if (pinInput && loginBtn && keypadContainer) {
  // Ensure input is editable
  pinInput.removeAttribute("readonly");

  // 🔒 Clear any existing keypad before rebuilding
  keypadContainer.innerHTML = "";

  // Build keypad once, deterministically
  const keypad = document.createElement("div");
  keypad.className = "keypad";

  const keys = ["1","2","3","4","5","6","7","8","9","0","←","✓"];

  for (const key of keys) {
    const btn = document.createElement("button");
    btn.textContent = key;
    btn.className = "key";

    btn.addEventListener("click", () => {
      if (key === "←") {
        pinInput.value = pinInput.value.slice(0, -1);
      } else if (key === "✓") {
        loginBtn.click();
      } else {
        pinInput.value += key;
      }
    });

    keypad.appendChild(btn);
  }

  // Append keypad once
  keypadContainer.appendChild(keypad);

  // Login logic
  loginBtn.addEventListener("click", () => {
    const pin = pinInput.value.trim();

    if (pin === "1937") {
      window.location.href = "evidence.html";
    } else if (pin === "") {
      errorBox.textContent = "Please enter your PIN.";
    } else {
      errorBox.textContent = "Invalid PIN.";
    }
  });

  // Enter key triggers login
  pinInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") loginBtn.click();
  });
}




