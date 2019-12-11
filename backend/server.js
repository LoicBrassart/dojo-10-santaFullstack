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
        return res.status(500).send("Sorry, we encountered an internal error.");
      }
      return res.status(200).json(rows);
    }
  );
});

app.post("/gifts", (req, res) => {
  const formData = req.body;
  db.query(`INSERT INTO gift SET ?`, formData, (err, rows) => {
    if (err) {
      console.log("Error on POST /gifts !");
      console.error(err);
      return res.status(500).send("Sorry, we encountered an internal error.");
    }
    return res.status(200).json(rows);
  });
});

app.delete("/children/:id_child/gifts", (req, res) => {
  db.query(
    `DELETE FROM gift WHERE id_child=?`,
    req.params.id_child,
    (err, rows) => {
      if (err) {
        console.log("Error on DELETE /children/:id_child/gifts !");
        console.error(err);
        return res.status(500).send("Sorry, we encountered an internal error.");
      }
      return res.status(200).json(rows);
    }
  );
});

app.patch("/gifts/:id/begin", (req, res) => {
  db.query(`SELECT id FROM elf WHERE id_gift IS NULL LIMIT 1`, (err, rows) => {
    if (err) {
      console.log("Error on PATCH /gifts/:id/begin !");
      console.error(err);
      return res.status(500).send("Sorry, we encountered an internal error.");
    }
    if (!rows[0]) {
      return res.status(418).send("Sorry, no elf available...");
    }
    const elfId = rows[0].id;
    db.query(
      `UPDATE elf SET id_gift=? WHERE id=?`,
      [req.params.id, elfId],
      (errUpdate, rowsUpdate) => {
        if (errUpdate) {
          console.log("Error on PATCH /gifts/:id/begin !");
          console.error(errUpdate);
          return res
            .status(500)
            .send("Sorry, we encountered an internal error.");
        }
        return res.status(200).json({
          id_gift: parseInt(req.params.id),
          id_elf: elfId
        });
      }
    );
  });
});

app.listen(backendPort, err => {
  if (err) throw err;
  console.log(`Server listening on http://localhost:${backendPort}`);
});
