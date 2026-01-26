import { useState } from "react";
import React from "react";

const ajd = new Date().toLocaleDateString("fr");

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
    return <>
        <h3>Choix de la réservation : </h3>
        <form action="" method="post">
        <div className="choix_stations">
        <label>Station de départ : </label>
        <select name="stationDepart">
            <option value="gare">Gare</option>
            <option value="mairie">Mairie</option>
            <option value="aquarium">Aquarium</option>
        </select>
        <label>Station d'arrivée : </label>
        <select name="stationArrivee">
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
        <select name="heureDepart">
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
        <select name="heureDepart">
            {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i+8 < 10 ? `0${i+8}:00` : `${i+8}:00`}>
                {i+8 < 10 ? `0${i+8}:00` : `${i+8}:00`}
                </option>
            ))}
        </select>
        </div>
        </form>
        </> 
}

function Ajouterformulaire(){
    return <><Formulaire /></>
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

            <button onClick={() => setFormulaires([...formulaires, {}])}> ➕ Ajouter</button>
            <button onClick={() => setFormulaires(formulaires.slice(0, -1))}> ➖ Supprimer</button>
            {formulaires.map((_, index) => (
                <div key={index} className="champ">
                    <Ajouterformulaire />
                </div>
            ))}
            </div>
        </>
    )

}