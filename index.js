const express = require("express");
var shape = require("shape-json");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(
  //

  bodyParser.urlencoded({
    extended: true,
  })
);
// routes
/*app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});*/
app.get("/", function (req, res) {
  console.log("app   is running !!!!!!!!!");
  res.send(
    '<h1 style="color: #5e9ca0;"  text-align: center;" >This is the <span style="color: #2b2301;">Backend</span> of the application!</h1><h3 style="text-align: center;"><em><strong><a href="https://github.com/announaymen/Back-end_gestion_des_maintenances_preventive">click here</a> to see how to use it!!  <img src="https://html-online.com/editor/tinymce4_6_5/plugins/emoticons/img/smiley-laughing.gif" alt="laughing" /></strong></em></h3><p>&nbsp;</p><ol style="list-style: none; font-size: 14px; line-height: 32px; font-weight: bold;"><li style="clear: both;"><img style="display: block; margin-left: auto; margin-right: auto;" src="https://i.ibb.co/FwJpXBY/logo-vert.png" alt="interactive connection" width="407" height="265" /></li></ol> <p></p>'
  );
});
/***************Gestion des employees*********************************/
app.post("/employees", db.createEmployee);
app.post("/auth", db.auth);
app.get("/employees", db.getEmployees);
app.get("/employees/:id", db.getEmployeeById);
app.put("/employees/:id", db.updateEmployee);
app.delete("/employees/:id", db.deleteEmployee);
/*****************Gestion des pieces**********************************/
app.put("/pieces/:id", db.updatePiece);
app.get("/pieces", db.getPieces);
app.post("/pieces", db.createPiece);
app.get("/pieces/:id", db.getPieceById);
app.delete("/pieces/:id", db.deletePiece);
/***************** gestion des vehicules*****************************/
app.get("/vehicules", db.getVehicules);
/********************** */
app.listen(port, () => {
  console.log(`App running on porttt ${port}.`);
});
