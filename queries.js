//create connection
const Pool = require("pg").Pool;
const emp = require("./models/employee");
const piece = require("./models/piece");
const huile = require("./models/huile");
const vehicule = require("./models/vehicule");
const maintenance = require("./models/maintenance");
const pool = new Pool({
  user: "duqnlvru",
  host: "balarama.db.elephantsql.com",
  database: "duqnlvru",
  password: "Nr2MB7TkmKVyVJkEv68R7kp7tcGCzPHw",
  port: 5432,
});
//*********************gestion des employee ***************************************
const createEmployee = (request, response) => {
  emp.createEmployee(request, response, pool);
};
const updateEmployee = (request, response) => {
  emp.updateEmployee(request, response, pool);
};
const getEmployees = (request, response) => {
  emp.getEmployees(request, response, pool);
};
const getEmployeeById = (request, response) => {
  emp.getEmployeeById(request, response, pool);
};
const deleteEmployee = (request, response) => {
  emp.deleteEmployee(request, response, pool);
};
//********************** gestion des pieces */************************************* */
const updatePiece = (request, response) => {
  piece.updatePiece(request, response, pool);
};
const getPieces = (request, response) => {
  piece.getPieces(request, response, pool);
};
const createPiece = (request, response) => {
  piece.createPiece(request, response, pool);
};
const getPieceById = (request, response) => {
  piece.getPieceById(request, response, pool);
};
const deletePiece = (request, response) => {
  piece.deletePiece(request, response, pool);
};
//********************** gestion des Huile */************************************* */
const updateHuile = (request, response) => {
  huile.updateHuile(request, response, pool);
};
const getHuiles = (request, response) => {
  huile.getHuiles(request, response, pool);
};
const createHuile = (request, response) => {
  huile.createHuile(request, response, pool);
};
const getHuileById = (request, response) => {
  huile.getHuileById(request, response, pool);
};
const deleteHuile = (request, response) => {
  huile.deleteHuile(request, response, pool);
};
//********************** gestion d'huile */************************************* */

/*********************** gestion des véhicules*********************************** */

/*********************** gestion des maintenance ******************************** */

/*********************** gestion des notification ******************************* */

/***********************gestion des publication ********************************* */

/***********************gestion des véhicules************************************ */
const getVehicules = (request, response) => {
  vehicule.getVehicules(request, response, pool);
};
const getVehiculeById = (request, response) => {
  vehicule.getVehiculeById(request, response, pool);
};
const createVehicule = (request, response) => {
  vehicule.createVehicule(request, response, pool);
};
const updateVehicule = (request, response) => {
  vehicule.updateVehicule(request, response, pool);
};
const deleteVehicule = (request, response) => {
  vehicule.deleteVehicule(request, response, pool);
};
/*********************************gestion des Maintenances ************************/
const createMaintenance = (request, response) => {
  maintenance.createMaintenance(request, response, pool);
};
const updateMaintenance = (request, response) => {
  maintenance.updateMaintenance(request, response, pool);
};
const getMaintenances = (request, response) => {
  maintenance.getMaintenances(request, response, pool);
};
const getMaintenanceById = (request, response) => {
  maintenance.getMaintenanceById(request, response, pool);
};
const deleteMaintenance = (request, response) => {
  maintenance.deleteMaintenance(request, response, pool);
};
//**************************authentification****************************************
const auth = (request, response) => {
  const { email, password } = request.body;
  pool.query(
    "SELECT * FROM employee WHERE email = $1 and password = $2",
    [email, password],
    (error, results) => {
      if (error) {
        response.status(200).send(error);
      }
      if (results.rowCount < 1) {
        response.writeHead(200, { "Content-Type": "text/event-stream" });
        response.status(200).send("authentification feild");
      } else {
        response.setHeader("custom_header_name", "abcde");
        response.status(200).send("signed in!!!!");
      }
    }
  );
};
module.exports = {
  /********employees**************/
  createEmployee,
  auth,
  getEmployees,
  getEmployeeById,
  deleteEmployee,
  updateEmployee,
  /**************** pieces ************/
  createPiece,
  updatePiece,
  getPieces,
  getPieceById,
  deletePiece,
  /**************** Huile ************/
  createHuile,
  updateHuile,
  getHuiles,
  getHuileById,
  deleteHuile,
  /************* Vehicules *******************/
  getVehicules,
  getVehiculeById,
  createVehicule,
  updateVehicule,
  deleteVehicule,
  /************** Maintenances ***************/
  createMaintenance,
  updateMaintenance,
  getMaintenances,
  getMaintenanceById,
  deleteMaintenance,
};
