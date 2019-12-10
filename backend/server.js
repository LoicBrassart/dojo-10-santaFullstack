const express = require("express");
const app = express();
const { backendPort } = require("./conf.js");

app.listen(backendPort, err => {
  if (err) throw err;
  console.log(`Server listening on http://localhost:${backendPort}`);
});
