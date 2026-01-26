import { useState } from "react";
import React from "react";

const ajd = new Date().toLocaleDateString("fr");
const nbVelosAdulte = 1;
const nbVelosEnfant = 0;

function FormulaireComplet(){
        return <>
        <h3>Informations personnelles :</h3>
        <form action="" method="post">
        <label>Nom :</label>
        <input type="text" name="nom" />
        <label>Prénom :</label>
        <input type="text" name="prenom" />
        <label>Âge :</label>
        <input type="number" name="age" /> 
        <label>Email :</label>
        <input type="email" name="email" />
        </form>
        </>     
}

function Formulaire() {
    return <><div className="champ">
        <h3>Nouveau cycliste : </h3>
        <form action="" method="post">
        <label>Nom :</label>
        <input type="text" name="nom" />
        <label>Prénom :</label>
        <input type="text" name="prenom" />
        <label>Âge :</label>
        <input type="number" name="age" />
        </form>
        </div>
    </>
    
}

function FormulaireReservation(props) {
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [heureDebut, setHeureDebut] = useState("");
    const [heureFin, setHeureFin] = useState("");
    const [lieuDepart, setLieuDepart] = useState("");
    const [lieuArrivee, setLieuArrivee] = useState("");
    return <>
        <h3>Choix de la réservation : </h3>
        <form action="" method="post">
        <div className="choix_stations">
        <label>Station de départ : </label>
        <select name="stationDepart" onChange={(e) => setLieuDepart(e.target.value)}>
            <option value="gare">Gare</option>
            <option value="mairie">Mairie</option>
            <option value="aquarium">Aquarium</option>
        </select>
        <label>Station d'arrivée : </label>
        <select name="stationArrivee" defaultValue={lieuDepart} onChange={(e) => setLieuArrivee(e.target.value)}>
            <option value="gare">Gare</option>
            <option value="mairie">Mairie</option>
            <option value="aquarium">Aquarium</option>
        </select>
        </div>
        <div className="choix_date">
        <label>Du : </label>
        <input type="date" name="dateDepart" min= {ajd}
            value={dateDebut}
         onChange={(e) => setDateDebut(e.target.value)}/>
        <label> à </label>
        <select name="heureDepart" onChange={(e) => setHeureDebut(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => (
                <>
                <option key={i} value={i+8 < 10 ? `0${i+8}:00` : `${i+8}:00`}>
                {i+8 < 10 ? `0${i+8}:00` : `${i+8}:00`}
                </option>
                <option key={i} value={i+8 < 10 ? `0${i+8}:30` : `${i+8}:30`}>
                {i+8 < 10 ? `0${i+8}:30` : `${i+8}:30`}
                </option>
                </>
            ))}
        </select>
        <label> Au : </label>
        <input type="date" name="dateArrivee" 
        value={dateFin}
        min={dateDebut}
        max={dateDebut + 30}
        onChange={(e) => setDateFin(e.target.value)}/>
        <label> à </label>
        <select name="heureDepart" onChange={(e) => setHeureFin(e.target.value)}>
            {dateDebut === dateFin && heureDebut > heureFin ? alert("L'heure de fin doit être supérieure à l'heure de début") : null}
            {Array.from({ length: 12 }, (_, i) => (
                <>
                <option key={i} value={i+8 < 10 ? `0${i+8}:00` : `${i+8}:00`}>
                {i+8 < 10 ? `0${i+8}:00` : `${i+8}:00`}
                </option>
                <option key={i} value={i+8 < 10 ? `0${i+8}:30` : `${i+8}:30`}>
                {i+8 < 10 ? `0${i+8}:30` : `${i+8}:30`}
                </option>
                </>
            ))}
        </select>
        </div>
        </form>
        </> 
}

function Ajouterformulaire(){
    return <><Formulaire /></>
}

function CalculDureeReservation(dateDebut, dateFin, heureDebut, heureFin){
    const debut = new Date(`${dateDebut}T${heureDebut}`);
    const fin = new Date(`${dateFin}T${heureFin}`);
    const dureeMs = fin - debut;
    const dureeHeures = Math.floor(dureeMs / (1000 * 60 * 60));
    return dureeHeures;
}

function CalculCoutReservation(dureeHeures){
    const tarifHoraire = 5;
    const tarifJournalier = 20;
    var coutTotal = 0;
    if(dureeHeures >= 24){
        const joursComplets = Math.floor(dureeHeures / 24);
        coutTotal += joursComplets * tarifJournalier;
    } 
    else {
        coutTotal += dureeHeures * tarifHoraire;
    }
    return coutTotal;
}

function FooterReservation(){
    return <>
    <footer>
        <p>Votre réservation : {nbVelosAdulte + nbVelosEnfant} vélo(s)</p>
        <p>Cout total : {CalculCoutReservation(24)} €</p>
        <button>Confirmer la réservation</button>
    </footer>
</>
}

export default function Reservation(){
    const [formulaires, setFormulaires] = useState([]);

    return (
        <>
            <h1>Réservez chez Electro Vélo Station</h1>
            <div className="champ">
            <FormulaireReservation />
            </div>
            <br/>
            <div className="champ">
            <FormulaireComplet />
            <br/>

            <button onClick={() => setFormulaires([...formulaires, {}])}> ➕ Ajouter</button>
            <button onClick={() => setFormulaires(formulaires.slice(0, -1))}> ➖ Supprimer</button>
            {formulaires.map((_, index) => (
                <div key={index} className="champ">
                    <Ajouterformulaire />
                </div>
            ))}
            </div>
            <FooterReservation />
        </>
    )

}