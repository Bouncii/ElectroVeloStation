import { useState } from "react"

function formulaire({complet}){
        let formulaire = (<>
        <label>Nom :</label>
        <input type="text" name="nom" />
        <label>Prénom :</label>
        <input type="text" name="prenom" />
        <label>Âge :</label>
        <input type="number" name="age" />
        </>);
        {
        
        if (complet) {
            {formulaire += (<><label>Email :</label>
        <input type="email" name="email" />
        <label>Téléphone :</label>
        <input type="tel" name="telephone" />
        </>);}
        }
        return (formulaire);
    }

        
}
export default function Reservation(){
    
    return (
        <>
            <h1>Réservez chez Electro Vélo Station</h1>
            {formulaire({complet:true})}
            <button> + Ajouter</button>
        </>
    )

}