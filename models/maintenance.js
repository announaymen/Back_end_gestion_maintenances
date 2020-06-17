/*SELECT 	  m.id_maintenance, m.date_fin, m.date_debut, m.niveau, m.priorite, m.etat, 
		  v.id_vehicule,
		 	mo.id_model,mo.nom_model,
		 	ma.id_marque,ma.nom_marque, ma.annee,
		 	f.id_fiche_technique,
				f.constructeur, f.reservoir, f.consommation_carburant,f.nb_cylindres,f.vitesse_max,
			chauf.id_employee id_chauffeur,
				chauf.nom nom_chauffeur,chauf.prenom prenom_chauffeur,
		  mec.id_employee id_mecanicien,
		  	mec.nom nom_mecanicien ,mec.prenom prenom_mecanicien,
		  p.id_piece,p.id_fournisseur id_fournisseur_piece , p.reference reference_piece, p.duree_vie duree_vie_piece ,p.nb_ex_dispo nb_ex_dispo_piece,
		  h.id_huile,h.id_fournisseur id_fournisseur_huile , h.reference reference_huile, h.duree_vie duree_vie_huile ,h.quantite_dispo quantite_dispo_huile
	FROM maintenance m 
		 join vehicule v on v.id_vehicule=m.vehicule
		 join model mo   on mo.id_model = v.id_model
		 join marque ma on ma.id_marque= mo.id_marque
		 join fiche_technique f on f.id_fiche_technique = v.fiche_technique
		 join employee chauf on chauf.id_employee = v.chauffeur
		 join employee mec on mec.id_employee=m.mecanicien 
		 join piece p on p.id_piece= m.piece
		 join huile h on h.id_huile = m.huile
--	  select * from maintenance*/
var shape = require("shape-json");
const { json } = require("express");

const updateMaintenance = (request, response, pool) => {
  const id_maintenance = parseInt(request.params.id);
  const {
    date_fin,
    date_debut,
    niveau,
    priorite,
    etat,
    mecanicien,
    vehicule,
    piece,
    huile,
  } = request.body;
  pool.query(
    `  UPDATE public.maintenance
	SET  date_fin=$1, date_debut=$2, niveau=$3, priorite=$4, etat=$5, mecanicien=$6, vehicule=$7, huile=$8, piece=$9
	WHERE id_maintenance=$10
             RETURNING *`,
    [
      date_fin,
      date_debut,
      niveau,
      priorite,
      etat,
      mecanicien,
      vehicule,
      huile,
      piece,
      id_maintenance,
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
const createMaintenance = (request, response, pool) => {
  const {
    date_fin,
    date_debut,
    niveau,
    priorite,
    etat,
    mecanicien,
    vehicule,
    piece,
    huile,
  } = request.body;

  pool.query(
    `
 
    INSERT INTO public.maintenance(
        date_fin, date_debut, niveau, priorite, etat, mecanicien, vehicule, piece,huile)
       VALUES ($1, $2,$3, $4,$5,$6, $7,$8,$9) RETURNING *;
   `,
    [
      date_fin,
      date_debut,
      niveau,
      priorite,
      etat,
      mecanicien,
      vehicule,
      piece,
      huile,
    ],
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
const getMaintenances = (request, response, pool) => {
  pool.query(
    `
    SELECT 	  m.id_maintenance, m.date_fin, m.date_debut, m.niveau, m.priorite, m.etat, 
		  v.id_vehicule,
		 	mo.id_model,mo.nom_model,
		 	ma.id_marque,ma.nom_marque, ma.annee,
		 	f.id_fiche_technique,
				f.constructeur, f.reservoir, f.consommation_carburant,f.nb_cylindres,f.vitesse_max,
			chauf.id_employee id_chauffeur,
				chauf.nom nom_chauffeur,chauf.prenom prenom_chauffeur,
		  mec.id_employee id_mecanicien,
		  	mec.nom nom_mecanicien ,mec.prenom prenom_mecanicien,
		  p.id_piece,p.id_fournisseur id_fournisseur_piece , p.reference reference_piece, p.duree_vie duree_vie_piece ,p.nb_ex_dispo nb_ex_dispo_piece,
		  h.id_huile,h.id_fournisseur id_fournisseur_huile , h.reference reference_huile, h.duree_vie duree_vie_huile ,h.quantite_dispo quantite_dispo_huile
	FROM maintenance m 
		 join vehicule v on v.id_vehicule=m.vehicule
		 join model mo   on mo.id_model = v.id_model
		 join marque ma on ma.id_marque= mo.id_marque
		 join fiche_technique f on f.id_fiche_technique = v.fiche_technique
		 join employee chauf on chauf.id_employee = v.chauffeur
		 join employee mec on mec.id_employee=m.mecanicien 
		 left join piece p on p.id_piece= m.piece
		 left join huile h on h.id_huile = m.huile
    `,
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rowCount < 1) {
        response.status(200).json(results.rows);
      } else {
        const maintenances = results.rows;
        //   response.status(200).json(piece);
        var scheme = {
          "$group[Maintenances](id_maintenance)": {
            id_maintenance: "id_maintenance",
            date_fin: "date_fin",
            date_debut: "date_debut",
            niveau: "niveau",
            priorite: "priorite",
            etat: "etat",
            vehicule: {
              id_vehicule: "id_vehicule",
              id_model: "id_model",
              nom_model: "nom_model",
              id_marque: "id_marque",
              nom_marque: "nom_marque",
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
                id_chauffeur: "id_chauffeur",
                nom_chauffeur: "nom_chauffeur",
                prenom_chauffeur: "prenom_chauffeur",
              },
            },
            mecanicien: {
              id_mecanicien: "id_mecanicien",
              nom_mecanicien: "nom_mecanicien",
              prenom_mecanicien: "prenom_mecanicien",
            },
            piece: {
              id_piece: "id_piece",
              id_fournisseur_piece: "id_fournisseur_piece",
              reference_piece: "reference_piece",
              duree_vie_piece: "duree_vie_piece",
              nb_ex_dispo_piece: "nb_ex_dispo_piece",
            },
            huile: {
              id_huile: "id_huile",
              id_fournisseur_huile: "id_fournisseur_huile",
              reference_huile: "reference_huile",
              duree_vie_huile: "duree_vie_huile",
              quantite_dispo_huile: "quantite_dispo_huile",
            },
          },
        };
        // response.status(200).json(maintenances);
        response.status(200).json(shape.parse(maintenances, scheme));
      }
    }
  );
};
const getMaintenanceById = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    `
    SELECT 	  m.id_maintenance, m.date_fin, m.date_debut, m.niveau, m.priorite, m.etat, 
		  v.id_vehicule,
		 	mo.id_model,mo.nom_model,
		 	ma.id_marque,ma.nom_marque, ma.annee,
		 	f.id_fiche_technique,
				f.constructeur, f.reservoir, f.consommation_carburant,f.nb_cylindres,f.vitesse_max,
			chauf.id_employee id_chauffeur,
				chauf.nom nom_chauffeur,chauf.prenom prenom_chauffeur,
		  mec.id_employee id_mecanicien,
		  	mec.nom nom_mecanicien ,mec.prenom prenom_mecanicien,
		  p.id_piece,p.id_fournisseur id_fournisseur_piece , p.reference reference_piece, p.duree_vie duree_vie_piece ,p.nb_ex_dispo nb_ex_dispo_piece,
		  h.id_huile,h.id_fournisseur id_fournisseur_huile , h.reference reference_huile, h.duree_vie duree_vie_huile ,h.quantite_dispo quantite_dispo_huile
	FROM maintenance m 
		 join vehicule v on v.id_vehicule=m.vehicule
		 join model mo   on mo.id_model = v.id_model
		 join marque ma on ma.id_marque= mo.id_marque
		 join fiche_technique f on f.id_fiche_technique = v.fiche_technique
		 join employee chauf on chauf.id_employee = v.chauffeur
		 join employee mec on mec.id_employee=m.mecanicien 
		 join piece p on p.id_piece= m.piece
		 join huile h on h.id_huile = m.huile where id_maintenance = $1;`,
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      if (results.rowCount < 1) {
        response.status(200).json(results.rows);
      } else {
        const maintenances = results.rows;
        //   response.status(200).json(piece);
        var scheme = {
          maintenance: {
            id_maintenance: "id_maintenance",
            date_fin: "date_fin",
            date_debut: "date_debut",
            niveau: "niveau",
            priorite: "priorite",
            etat: "etat",
            vehicule: {
              id_vehicule: "id_vehicule",
              id_model: "id_model",
              nom_model: "nom_model",
              id_marque: "id_marque",
              nom_marque: "nom_marque",
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
                id_chauffeur: "id_chauffeur",
                nom_chauffeur: "nom_chauffeur",
                prenom_chauffeur: "prenom_chauffeur",
              },
            },
            mecanicien: {
              id_mecanicien: "id_mecanicien",
              nom_mecanicien: "nom_mecanicien",
              prenom_mecanicien: "prenom_mecanicien",
            },
            piece: {
              id_piece: "id_piece",
              id_fournisseur_piece: "id_fournisseur_piece",
              reference_piece: "reference_piece",
              duree_vie_piece: "duree_vie_piece",
              nb_ex_dispo_piece: "nb_ex_dispo_piece",
            },
            huile: {
              id_huile: "id_huile",
              id_fournisseur_huile: "id_fournisseur_huile",
              reference_huile: "reference_huile",
              duree_vie_huile: "duree_vie_huile",
              quantite_dispo_huile: "quantite_dispo_huile",
            },
          },
        };
        // response.status(200).json(maintenances);
        response.setHeader("custom_header_name", "abcde");
        response.status(200).json(shape.parse(maintenances, scheme));
      }
    }
  );
};
const deleteMaintenance = (request, response, pool) => {
  const id = parseInt(request.params.id);
  pool.query(
    "DELETE FROM maintenance WHERE id_maintenance = $1",
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
  getMaintenances,
  createMaintenance,
  updateMaintenance,
  getMaintenanceById,
  deleteMaintenance,
};
