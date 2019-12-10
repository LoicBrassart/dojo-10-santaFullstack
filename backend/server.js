const express = require("express");
const app = express();
const { backendPort, db } = require("./conf.js");

app.get("/", (req, res) => {
  db.query(`SELECT 40+2 AS solution`, (err, rows) => {
    if (err) {
      console.log("Error on GET / !");
      console.error(err);
      res.status(500).send("Sorry, we encountered an internal error.");
    }
    res
      .status(200)
      .send(`Hello there! The answer is always ${rows[0].solution}`);
  });
});

app.listen(backendPort, err => {
  if (err) throw err;
  console.log(`Server listening on http://localhost:${backendPort}`);
});
