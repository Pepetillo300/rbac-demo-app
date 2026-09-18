const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Bump this value on every change you commit — it's how you'll
// visually confirm the pipeline actually redeployed the new version.
const APP_VERSION = process.env.APP_VERSION || 'v2';

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>RBAC + CI/CD Demo</title></head>
      <body style="font-family: sans-serif; text-align:center; margin-top: 10%;">
        <h1>RBAC + CICD Demo</h1>
        <h2>Current version: <strong>${APP_VERSION}</strong></h2>
        <p>Served by pod: ${process.env.HOSTNAME || 'unknown'}</p>
      </body>
    </html>
  `);
});

app.get('/healthz', (req, res) => res.status(200).send('ok'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}, version ${APP_VERSION}`);
});
