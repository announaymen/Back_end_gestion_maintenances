/*
SELECT v.id_vehicule, 
		f.id_fiche_technique, f.constructeur, f.reservoir, f.consommation_carburant,f.nb_cylindres,f.vitesse_max,
		e.id_employee, e.nom,e.prenom,
		ma.id_marque,ma.nom_marque, ma.annee,
		m.id_model,nom_model
		from vehicule v 
		left join fiche_technique f on v.fiche_technique=f.id_fiche_technique
		left join employee e on v.chauffeur=e.id_employee 
		left join model m on v.id_model = m.id_model 
		left join marque ma on ma.id_marque= m.id_marque;
*/
var shape = require("../node_modules/shape-json");

const updatePiece = (request, response, pool) => {
  const id_piece = parseInt(request.params.id);
  const {
    id_fournisseur,
    reference,
    duree_vie,
    fabriqueur,
    prix,
    nb_ex_dispo,
  } = request.body;
  pool.query(
    "UPDATE piece SET id_fournisseur = $1, reference = $2, duree_vie = $3,fabriqueur = $4,prix=$5 ,nb_ex_dispo = $6 WHERE id_piece = $7 RETURNING *",
    [
      id_fournisseur,
      reference,
      duree_vie,
      fabriqueur,
      prix,
      nb_ex_dispo,
      id_piece,
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
        response.status(200).json({ Message: "modifié avec succès" });
      }
    }
  );
};
const createPiece = (request, response, pool) => {
  // response.status(201).send("employee created");
  const {
    id_fournisseur,
    reference,
    duree_vie,
    fabriqueur,
    prix,
    nb_ex_dispo,
  } = request.body;

  pool.query(
    "INSERT INTO piece ( id_fournisseur, reference, duree_vie, fabriqueur, prix, nb_ex_dispo) VALUES ($1, $2,$3, $4,$5, $6) RETURNING *",
    [id_fournisseur, reference, duree_vie, fabriqueur, prix, nb_ex_dispo],
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
      const piece = results.rows;
      //   response.status(200).json(piece);
      var scheme = {
        "$group[vehicules](id_vehicule)": {
          id_vehicule: "id_vehicule",
          id_marque: "id_marque",
          nom_marque: "nom_marque",
          id_model: "id_model",
          nom_model: "nom_model",
          annee: "annee",
          "$group[fiche_technique](id_fiche_technique)": {
            id_fiche_technique: "id_fiche_technique",
            constructeur: "constructeur",
            reservoir: "reservoir",
            consommation_carburant: "consommation_carburant",
            nb_cylindres: "nb_cylindres",
            vitesse_max: "vitesse_max",
          },
          "$group[chaffeur](id_employee)": {
            id_chauffreur: "id_employee",
            nom: "nom",
            prenom: "prenom",
          },
        },
      };
      console.log(shape.parse(piece, scheme));
      response.status(200).json(shape.parse(piece, scheme));
    }
  );
};
const getPieceById = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT  * FROM piece NATURAL join fournisseur WHERE id_piece = $1 ORDER BY id_piece ASC",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const piece = results.rows;
      var scheme = {
        id_piece: "id_piece",
        reference: "reference",
        duree_vie: "duree_vie",
        fabriqueur: "fabriqueur",
        prix: "prix",
        nb_ex_dispo: "nb_ex_dispo",
        fournisseur: {
          id_fournisseur: "id_fournisseur",
          nom: "nom",
          adresse: "adresse",
          date_debut_contrat: "date_debut_contrat",
        },
      };
      console.log(shape.parse(piece, scheme));
      //response.status(200).json(piece);
      response.status(200).json(shape.parse(piece, scheme));
    }
  );
};
const deletePiece = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    "DELETE FROM piece WHERE id_piece = $1",
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
  // createPiece,
  // updatePiece,
  // getPieceById,
  // deletePiece,
};
