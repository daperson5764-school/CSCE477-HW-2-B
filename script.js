const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

// Where the server-side validator lives (see server.js).
const SERVER_URL = "http://localhost:3000/login";

/**
 * Core client-side validation function.
 * Returns an error string if the input is invalid, or null if it passes.
 *   1. Neither field may be empty (prevents empty submissions).
 *   2. The email must contain an "@".
 *   3. The password must be at least 8 characters.
 */
function validateCredentials(email, password) {
  if (email.trim() === "" || password.trim() === "") {
    return "Email and password are both required.";
  }
  if (!email.includes("@")) {
    return "Email must contain an \u0040 symbol.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null; // all checks passed
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = "message " + type; // "error" or "ok"
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // stop the browser from reloading the page

  const email = emailInput.value;
  const password = passwordInput.value;

  // --- Client-side validation (first line of defense) ---
  const clientError = validateCredentials(email, password);
  if (clientError) {
    showMessage(clientError, "error");
    return; // never even reach the server if the client already caught it
  }

  // --- Server-side validation (the authority) ---
  // The client checks are only a convenience; the server re-runs the same
  // rules so a user who bypasses the page (e.g. via curl) can't skip them.
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showMessage("Login accepted by server. ✔", "ok");
    } else {
      showMessage("Server rejected: " + result.error, "error");
    }
  } catch (err) {
    showMessage("Could not reach the server. Is server.js running?", "error");
  }
});
