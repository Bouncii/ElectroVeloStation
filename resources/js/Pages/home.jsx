/*Ne pas enlever*/
/* eslint-disable react/react-in-jsx-scope */
/* <> */
import { useState } from "react"

import '@css/home.css';


export function Header(){
    
    const toggleMenu = () => {
            var x = document.getElementById("topnav")
                if (x.className === "Nav") {
                    x.className += "responsive";
                    console.log("responsive")
                } else {
                    x.className = "Nav";
                    console.log("Nav")
                }
        };

    return (
        
        <header className="Header">
            <nav className="Nav" id="topnav">
                <a href="/">Accueil</a>
                <a href ="/connexion" id="connecterHeader">Se connecter</a>
                <button id="reserverHeader" onClick={() => window.location.href = '/reservation'}>Reserver</button>
            </nav>         
        </header>
    )
}

/* Les stations */

const Station = (props) => {
    return (
        <div className="stationCard">
            <h2>{props.name}</h2>
            <p>{props.desc}</p>
            <button onClick={() => alert('Vélo réservé !')}>
            Résever
            </button>
        </div>
    );
};

export default function Home(){

    return (
        <>
        <div className="homePage">
            <Header />
            <div style={{marginTop: '80px'}}>
            
            <h1>Electrovélo station</h1>

            <h2>Nos stations</h2>

            <div id="stations">
                
                <Station
                    name="Amusment Park"
                    desc="Voici uee description super pertinante."
                />
                <Station
                    name="Judgment"
                    desc="Voici uee description super pertinante."
                />
                <Station
                    name="Ashura-chan"
                    desc="Voici uee description super pertinante."
                />
                <Station
                    name="Throne"
                    desc="Voici uee description super pertinante."
                />
            </div>
            </div>
        </div>
        </>
    );
}