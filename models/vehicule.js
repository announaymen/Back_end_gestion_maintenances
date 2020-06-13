var shape = require("shape-json");

const updateVehicule = (request, response, pool) => {
  const id_vehicule = parseInt(request.params.id);
  const { fiche_technique, parc, chauffeur, id_model } = request.body;
  pool.query(
    "UPDATE Vehicule SET fiche_technique = $1, parc = $2, chauffeur = $3,id_model = $4 WHERE id_vehicule = $5 RETURNING *",
    [fiche_technique, parc, chauffeur, id_model, id_vehicule],
    (error, results) => {
      if (error) {
        response.status(404).send("error 1 " + error);
      }
      if (typeof results.rows == "undefined") {
        response.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
        response.status(404).send(`User not found`);
      } else {
        response.status(200).json({ Message: "modifié avec succès" });
      }
    }
  );
};
const createVehicule = (request, response, pool) => {
  const { fiche_technique, parc, chauffeur, id_model } = request.body;

  pool.query(
    `INSERT INTO vehicule ( fiche_technique, parc, chauffeur, id_model) 
            VALUES ($1, $2,$3, $4) RETURNING *`,
    [fiche_technique, parc, chauffeur, id_model],
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
const getVehicules = (request, response, pool) => {
  pool.query(
    `
    SELECT v.id_vehicule,
      f.id_fiche_technique, f.constructeur, f.reservoir, f.consommation_carburant,f.nb_cylindres,f.vitesse_max,
      e.id_employee, e.nom,e.prenom,
      ma.id_marque,ma.nom_marque, ma.annee,
      m.id_model,nom_model
		from vehicule v 
      left join fiche_technique f on v.fiche_technique=f.id_fiche_technique
      left join employee e on v.chauffeur=e.id_employee 
      left join model m on v.id_model = m.id_model 
      left join marque ma on ma.id_marque= m.id_marque;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      const vehicule = results.rows;
      //   response.status(200).json(piece);
      var scheme = {
        "$group[vehicules](id_vehicule)": {
          id_vehicule: "id_vehicule",
          id_marque: "id_marque",
          nom_marque: "nom_marque",
          id_model: "id_model",
          nom_model: "nom_model",
          annee: "annee",
          fiche_technique: {
            id_fiche_technique: "id_fiche_technique",
            constructeur: "constructeur",
            reservoir: "reservoir",
            consommation_carburant: "consommation_carburant",
            nb_cylindres: "nb_cylindres",
            vitesse_max: "vitesse_max",
          },
          chaffeur: {
            id_chauffreur: "id_employee",
            nom: "nom",
            prenom: "prenom",
          },
        },
      };
      response.status(200).json(shape.parse(vehicule, scheme));
    }
  );
};
const getVehiculeById = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    `SELECT v.id_vehicule,
      f.id_fiche_technique, f.constructeur, f.reservoir, f.consommation_carburant,f.nb_cylindres,f.vitesse_max,
      e.id_employee, e.nom,e.prenom,
      ma.id_marque,ma.nom_marque, ma.annee,
      m.id_model,nom_model
		from vehicule v 
      left join fiche_technique f on v.fiche_technique=f.id_fiche_technique
      left join employee e on v.chauffeur=e.id_employee 
      left join model m on v.id_model = m.id_model 
      left join marque ma on ma.id_marque= m.id_marque where id_vehicule = $1;`,
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const vehicule = results.rows;
      //   response.status(200).json(piece);
      var scheme = {
        vehicule: {
          id_vehicule: "id_vehicule",
          id_marque: "id_marque",
          nom_marque: "nom_marque",
          id_model: "id_model",
          nom_model: "nom_model",
          annee: "annee",
          fiche_technique: {
            id_fiche_technique: "id_fiche_technique",
            constructeur: "constructeur",
            reservoir: "reservoir",
            consommation_carburant: "consommation_carburant",
            nb_cylindres: "nb_cylindres",
            vitesse_max: "vitesse_max",
          },
          chaffeur: {
            id_chauffreur: "id_employee",
            nom: "nom",
            prenom: "prenom",
          },
        },
      };
      response.status(200).json(shape.parse(vehicule, scheme));
    }
  );
};
const deleteVehicule = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    "DELETE FROM vehicule WHERE id_vehicule = $1",
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
  getVehicules,
  createVehicule,
  updateVehicule,
  getVehiculeById,
  deleteVehicule,
};
