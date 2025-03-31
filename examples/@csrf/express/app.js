import { createCsrfMiddleware } from '@csrf/express'
import express from 'express'
import process from 'node:process'

/* global console */

// initalize csrf protection middleware
const csrfMiddleware = createCsrfMiddleware({
	cookie: {
		secure: process.env.NODE_ENV === 'production',
	},
})

// init app
const app = express()
const port = 3000

// add csrf middleware
app.use(csrfMiddleware)

// define handlers
app.get('/', (req, res) => {
	const csrfToken = res.getHeader('X-CSRF-Token') || 'missing'
	res.send(`
    <!doctype html>
    <html>
      <body>
        <p>CSRF token value: ${csrfToken}</p>
        <h2>HTML Form Submission Example:</h2>
        <form action="/form-handler" method="post">
          <legend>Form without CSRF (should fail):</legend>
          <input type="text" name="input1" />
          <button type="submit">Submit</button>
        </form>
        <br />
        <form action="/form-handler" method="post">
          <legend>Form with incorrect CSRF (should fail):</legend>
          <input type="hidden" name="csrf_token" value="notvalid" />
          <input type="text" name="input1" />
          <button type="submit">Submit</button>
        </form>
        <br />
        <form action="/form-handler" method="post">
          <legend>Form with CSRF (should succeed):</legend>
          <input type="hidden" name="csrf_token" value="${csrfToken}" />
          <input type="text" name="input1" />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `)
})

app.post('/form-handler', (req, res) => {
	res.send('success')
})

// start server
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
