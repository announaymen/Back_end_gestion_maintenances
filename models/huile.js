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
const getHuiles = (request, response, pool) => {
  pool.query(
    "SELECT  * FROM huile NATURAL join fournisseur   ORDER BY id_huile ASC",
    (error, results) => {
      if (error) {
        throw error;
      }
      const huile = results.rows;
      var scheme = {
        "$group[huile](id_huile)": {
          id_huile: "id_huile",
          reference: "reference",
          duree_vie: "duree_vie",
          fabriqueur: "fabriqueur",
          prix: "prix",
          quantite_dispo: "quantite_dispo",
          fournisseur: {
            id_fournisseur: "id_fournisseur",
            nom: "nom",
            date_debut_contrat: "date_debut_contrat",
            adresse: "adresse",
          },
        },
      };
      response.status(200).json(shape.parse(huile, scheme));
    }
  );
};
const getHuileById = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT  * FROM huile NATURAL join fournisseur WHERE id_huile = $1 ORDER BY id_huile ASC",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const huile = results.rows;
      var scheme = {
        id_huile: "id_huile",
        reference: "reference",
        duree_vie: "duree_vie",
        fabriqueur: "fabriqueur",
        prix: "prix",
        quantite_dispo: "quantite_dispo",
        fournisseur: {
          id_fournisseur: "id_fournisseur",
          nom: "nom",
          adresse: "adresse",
          date_debut_contrat: "date_debut_contrat",
        },
      };
      // console.log(shape.parse(piece, scheme));
      //response.status(200).json(piece);
      response.status(200).json(shape.parse(huile, scheme));
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
  getHuiles,
  createHuile,
  updateHuile,
  getHuileById,
  deleteHuile,
};
