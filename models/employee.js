const updateEmployee = (request, response, pool) => {
  const id_employee = parseInt(request.params.id);
  const {
    poste,
    parc,
    nom,
    prenom,
    date_embauche,
    email,
    password,
    nss,
    chef,
  } = request.body;
  pool.query(
    "UPDATE employee SET id_poste = $1, id_parc = $2, nom = $3,prenom = $4,date_embauche=$5 ,email = $6,password = $7,nss = $8,id_chef = $9 WHERE id_employee = $10 RETURNING *",
    [
      poste,
      parc,
      nom,
      prenom,
      date_embauche,
      email,
      password,
      nss,
      chef,
      id_employee,
    ],
    (error, results) => {
      if (error) {
        response.status(404).send("error 1 " + error);
      }
      if (typeof results.rows == "undefined") {
        response.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
        response.status(404).send(`User not found`);
      } else {
        response.status(200).json({ Message: "Modifié avec succès" });
      }
    }
  );
};
const createEmployee = (request, response, pool) => {
  // response.status(201).send("employee created");
  const {
    poste,
    parc,
    nom,
    prenom,
    date_embauche,
    email,
    password,
    nss,
    chef,
  } = request.body;

  pool.query(
    "INSERT INTO employee ( id_poste, id_parc, nom, prenom, date_embauche, email, password, nss, id_chef) VALUES ($1, $2,$3, $4,$5, $6,$7, $8, $9) RETURNING *",
    [poste, parc, nom, prenom, date_embauche, email, password, nss, chef],
    (error, results) => {
      if (error) {
        response.status(201).send("error 1" + error);
      } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
        response.status(201).send("error 2" + error);
      }
      response.status(200).json({ Message: "crée avec succès" });
    }
  );
};
const getEmployees = (request, response, pool) => {
  pool.query(
    "SELECT * FROM employee ORDER BY id_employee ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
const getEmployeeById = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT * FROM employee WHERE id_employee = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
const deleteEmployee = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    "DELETE FROM employee WHERE id_employee = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json({ Message: "supprimé avec succès" });
    }
  );
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  getEmployeeById,
  deleteEmployee,
};
