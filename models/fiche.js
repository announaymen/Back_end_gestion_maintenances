/*INSERT INTO public.piece(
	id_fournisseur, reference, duree_vie, fabriqueur, prix, nb_ex_dispo)
	VALUES ( 1 , '1', 5456, 'fab1', 542, 20);
*/
var shape = require("shape-json");
const updateHuile = (request, response, pool) => {
  const id_huile = parseInt(request.params.id);
  const {
    id_fournisseur,
    reference,
    duree_vie,
    fabriqueur,
    prix,
    quantite_dispo,
  } = request.body;
  pool.query(
    "UPDATE huile SET id_fournisseur = $1, reference = $2, duree_vie = $3,fabriqueur = $4,prix=$5 ,quantite_dispo = $6 WHERE id_huile = $7 RETURNING *",
    [
      id_fournisseur,
      reference,
      duree_vie,
      fabriqueur,
      prix,
      quantite_dispo,
      id_huile,
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
const createHuile = (request, response, pool) => {
  // response.status(201).send("employee created");
  const {
    id_fournisseur,
    reference,
    duree_vie,
    fabriqueur,
    prix,
    quantite_dispo,
  } = request.body;

  pool.query(
    "INSERT INTO huile ( id_fournisseur, reference, duree_vie, fabriqueur, prix, quantite_dispo) VALUES ($1, $2,$3, $4,$5, $6) RETURNING *",
    [id_fournisseur, reference, duree_vie, fabriqueur, prix, quantite_dispo],
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
const getFiches = (request, response, pool) => {
  pool.query("SELECT  * FROM fiche_technique ", (error, results) => {
    if (error) {
      throw error;
    }
    const fiches = results.rows;
    response.status(200).json(fiches);
  });
};
const getFicheById = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT  * FROM fiche_technique  WHERE id_fiche_technique = $1 ORDER BY id_fiche_technique ASC",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const fiche = results.rows;

      response.status(200).json(fiche);
      //response.status(200).json(shape.parse(huile, scheme));
    }
  );
};
const deleteHuile = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    "DELETE FROM huile WHERE id_huile = $1",
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
  getFiches,
  //createHuile,
  //updateHuile,
  getFicheById,
  deleteHuile,
};
