const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { backendPort, db } = require("./conf.js");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/children", (req, res) => {
  db.query(
    `SELECT 
        child.id AS child_id, firstname, lastname, wisdom, COUNT(gift.id) AS nb_gifts
    FROM 
        child
        INNER JOIN gift ON child.id=gift.id_child
    GROUP BY child.id`,
    (err, rows) => {
      if (err) {
        console.log("Error on GET /children !");
        console.error(err);
        res.status(500).send("Sorry, we encountered an internal error.");
      }
      res.status(200).json(rows);
    }
  );
});

app.post("/gifts", (req, res) => {
  const formData = req.body;

  db.query(`INSERT INTO gift SET ?`, formData, (err, rows) => {
    if (err) {
      console.log("Error on GET / !");
      console.error(err);
      res.status(500).send("Sorry, we encountered an internal error.");
    }
    res.status(200).json(rows);
  });
});

app.listen(backendPort, err => {
  if (err) throw err;
  console.log(`Server listening on http://localhost:${backendPort}`);
});
