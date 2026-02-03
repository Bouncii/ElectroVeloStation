/*Ne pas enlever*/
/* eslint-disable react/react-in-jsx-scope */
/* <> */
import { useState } from "react"

import '@css/home.css';

export function Header(){
    

    const [isOpen, setIsOpen] = useState(false);

    return (
        
        <header className="Header">
            <nav className={isOpen ? "Nav responsive" : "Nav"} id="topnav">
                
                <div id="menu">
                <a href="/">Accueil</a>
                <a href ="/connexion">Se connecter</a>
                <button onClick={() => window.location.href = '/reservation'}>Reserver</button>
                </div>

                <button className="icon" onClick={() => setIsOpen(!isOpen)}>
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">

                    <path d="M4 6H20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M4 12H20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M4 18H20" stroke="black" strokeWidth="2" strokeLinecap="round"/>

                    </svg>
                </button>
                
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
        </>
    );
}