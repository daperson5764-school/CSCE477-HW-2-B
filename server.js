// Minimal server that re-validates credentials on the back end.
// No framework required — uses only Node's built-in "http" module.

const http = require("http");

const PORT = 3000;

/**
 * Same three rules as the client, enforced again on the server.
 * This is the point of the exercise: the client checks can be bypassed
 * (curl, Postman, disabled JS), so the server must never trust them.
 */
function validateCredentials(email, password) {
  if (typeof email !== "string" || typeof password !== "string") {
    return "Email and password must be provided.";
  }
  if (email.trim() === "" || password.trim() === "") {
    return "Email and password are both required.";
  }
  if (!email.includes("@")) {
    return "Email must contain an @ symbol.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null;
}

const server = http.createServer((req, res) => {
  // Allow the browser page (served from file:// or another port) to call us.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "POST" && req.url === "/login") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      res.setHeader("Content-Type", "application/json");

      let data;
      try {
        data = JSON.parse(body);
      } catch {
        res.writeHead(400);
        return res.end(JSON.stringify({ success: false, error: "Invalid JSON." }));
      }

      const error = validateCredentials(data.email, data.password);
      if (error) {
        res.writeHead(400);
        return res.end(JSON.stringify({ success: false, error }));
      }

      // In a real app you'd now look up the user and compare a bcrypt hash.
      // Here we just confirm the input passed server-side validation.
      res.writeHead(200);
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ success: false, error: "Not found." }));
});

server.listen(PORT, () => {
  console.log(`Server-side validator running at http://localhost:${PORT}`);
});
