/*INSERT INTO public.piece(
	id_fournisseur, reference, duree_vie, fabriqueur, prix, nb_ex_dispo)
	VALUES ( 1 , '1', 5456, 'fab1', 542, 20);
*/
var shape = require("shape-json");

const createMission = (request, response, pool) => {
  // response.status(201).send("employee created");
  const {
    vehicule,
    parc,
    chauffeur,
    heuresortie,
    heureentree,
    distance,
  } = request.body;

  pool.query(
    "INSERT INTO public.missions(  vehicule, parc, chauffeur, heuresortie, heureentree, distance)  VALUES ($1, $2,$3, $4,$5, $6 ) RETURNING *;",
    [vehicule, parc, chauffeur, heuresortie, heureentree, distance],
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
const getMissions = (request, response, pool) => {
  pool.query("SELECT  * FROM missions", (error, results) => {
    if (error) {
      throw error;
    }
    const missions = results.rows;
    response.status(200).json(shape.parse(huile, scheme));
    response.status(200).json(missions);
  });
};
const getMissionById = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    "SELECT  * FROM missions id_mission = $1 ",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      const mission = results.rows;
      // console.log(shape.parse(piece, scheme));
      //response.status(200).json(piece);
      response.status(200).json(mission);
    }
  );
};

module.exports = {
  getMissions,
  createMission,
  getMissionById,
};
