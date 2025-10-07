import { Elysia } from "elysia";
import { csrf } from "@simple-csrf/elysia";

const app = new Elysia()
  .use(
    csrf({
      cookie: {
        secure: process.env.NODE_ENV === "production",
      },
    })
  )
  .get("/", ({ headers }) => {
    const csrfToken = headers["x-csrf-token"] || "missing";
    return `
      <!doctype html>
      <html>
        <head>
          <title>Elysia CSRF Example</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              color: #333;
              margin-top: 0;
            }
            form {
              margin-top: 20px;
            }
            input, button {
              display: block;
              width: 100%;
              margin: 10px 0;
              padding: 10px;
              font-size: 16px;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            button {
              background: #5865f2;
              color: white;
              border: none;
              cursor: pointer;
              font-weight: 600;
            }
            button:hover {
              background: #4752c4;
            }
            .info {
              background: #f0f8ff;
              padding: 15px;
              border-radius: 4px;
              margin-top: 20px;
              font-size: 14px;
              color: #333;
            }
            code {
              background: #e8e8e8;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🦊 Elysia CSRF Protection Example</h1>
            <p>This form is protected by CSRF tokens. Try submitting it!</p>
            <form action="/form-handler" method="post">
              <input type="hidden" name="csrf_token" value="${csrfToken}" />
              <input type="text" name="username" placeholder="Enter your name" required />
              <input type="email" name="email" placeholder="Enter your email" required />
              <button type="submit">Submit Form</button>
            </form>
            <div class="info">
              <strong>CSRF Token:</strong><br>
              <code>${csrfToken}</code>
            </div>
          </div>
        </body>
      </html>
    `;
  })
  .post("/form-handler", () => {
    return `
      <!doctype html>
      <html>
        <head>
          <title>Success!</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 600px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              color: #10b981;
            }
            a {
              color: #5865f2;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Form Submitted Successfully!</h1>
            <p>Your form data was received with a valid CSRF token.</p>
            <p><a href="/">← Go back</a></p>
          </div>
        </body>
      </html>
    `;
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
