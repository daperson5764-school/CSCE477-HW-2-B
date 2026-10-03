# Juice Shop–Style Login Form

A small demonstration login page modeled on the OWASP Juice Shop login screen,
built to show **client-side and server-side validation working together**.

## What it does

The page presents an email and password field inside a login card. When the form
is submitted, the input is validated in two places:

1. **Client-side (`script.js`)** — a `validateCredentials()` function runs in the
   browser and blocks the request if any field is empty, the email has no `@`, or
   the password is shorter than 8 characters. This gives the user instant feedback.
2. **Server-side (`server.js`)** — the same three rules are enforced again on the
   back end. This is the important part: client-side checks can be bypassed (with
   `curl`, Postman, or by disabling JavaScript), so the server treats the browser
   as untrusted and re-validates everything before accepting the login.

## Files

| File         | Purpose                                             |
|--------------|-----------------------------------------------------|
| `index.html` | Markup for the login card and form                  |
| `styles.css` | Styling for the page                                |
| `script.js`  | Client-side validation + request to the server      |
| `server.js`  | Node HTTP server that re-validates on the back end  |

## Requirements

- [Node.js](https://nodejs.org/) (v14 or newer). No npm packages needed —
  `server.js` uses only Node's built-in `http` module.

## How to run

1. **Start the server** (from inside this folder):

   ```bash
   node server.js
   ```

   You should see: `Server-side validator running at http://localhost:3000`

2. **Open the page.** Double-click `index.html`, or serve the folder with a
   simple static server, for example:

   ```bash
   npx serve .
   ```

   Then visit the address it prints (or just open the `index.html` file directly).

3. **Try it out:**
   - Submit with empty fields → blocked client-side.
   - Enter an email with no `@` or a password under 8 characters → blocked.
   - Enter a valid email and an 8+ character password → the request reaches the
     server, which re-validates and responds with success.

## Testing the server directly

To prove the server validates independently of the browser, send it a bad request
straight from the terminal — the client checks never run here:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"no-at-symbol","password":"short"}'
```

The server still rejects it, which is the whole point: **never trust the client.**
