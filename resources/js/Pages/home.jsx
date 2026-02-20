/*Ne pas enlever*/
/* eslint-disable react/react-in-jsx-scope */
/* <></> */
import { useState } from "react"

import '@css/home.css';

export function Background() {
  return (
<svg 
viewBox="0 0 376 4352" fill="none" xmlns="http://www.w3.org/2000/svg" className="backgroundSvg" preserveAspectRatio="none">
<rect width="375" height="3557" transform="translate(0.23)" fill="#5AA9E6"/>
<path d="M0.23 1017.2L375.23 924V2087.9L0.23 2181L0.23 1017.2Z" fill="#0031A4"/>
</svg>
  );
}

export function Header(){
    

    const [isOpen, setIsOpen] = useState(false);

    return (
        
        <header className="Header">
            <nav className={isOpen ? "Nav responsive" : "Nav"} id="topnav">
                
                <div id="menu">
                <a href="/">Accueil</a>
                <a href ="/login">Se connecter</a>
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
            <img src="./frog.png" className="StationImage"></img>
            <h2>{props.name}</h2>
            <p>{props.desc}</p>
            <a href="./TrucIG?" className="LinkStationMap">Afficher sur la carte</a>
            <button onClick={() => alert('Vélo réservé !')}>
            Résever
            </button>
        </div>
    );
};

const TextOval = (props) => {
    return (
        <div className="OvalLayout">
            <p>{props.text}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	            <path fill="currentColor" d="m10.6 13.8l-2.15-2.15q-.275-.275-.7-.275t-.7.275t-.275.7t.275.7L9.9 15.9q.3.3.7.3t.7-.3l5.65-5.65q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
            </svg>
            
        </div>
    )
}

const LinkOval = (props) => {
    return (
        <div className="LinkOval">
            <a href={props.link} target="_blank" className="LinkOval">{props.text}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path strokeDasharray="20" d="M3 12h17.5">
                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="20;0" />
                    </path>
                    <path strokeDasharray="12" strokeDashoffset="12" d="M21 12l-7 7M21 12l-7 -7">
                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.2s" to="0" />
                    </path>
                </g>
            </svg>
            </a>
        </div>

    )
}
const CardTuto = (props) => {
    return (
        <div className="tuto">
        <h1>{props.num}</h1>    
        <h3>{props.desc}</h3>
        <p>{props.text}</p>
        </div>
    )
}


export default function Home(){

    return (
        <>
        
        <div className="homePage">
            
            <Header />
            <h1>.</h1>
            <img src="./frog.png"></img>
            <p id="TextTop">ELECTRO VELO STATION</p>
            <h2 id="slogan">Un slogan vraiment cool.|</h2>

            <TextOval 
                text="Simplicité"
            />
            <TextOval 
                text="Ecologie"
            />
            <TextOval 
                text="Entreprise française"
            />
            <LinkOval id="reserver"
                link='/reservation'
                text="Réservez votre vélo"    
            />
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
            <h2 className="titreGros">Réservez votre premier vélo.</h2>
            <p>Vous allez voir, c'est facile !</p>
            <CardTuto
            num="1"
            desc="Choisir votre station"
            text="lorem"
            />
            <CardTuto
            num="2"
            desc="Validez votre réservation"
            text="ipsum"
            />
            <CardTuto
            num="3"
            desc="Partez à l'aventure avec votre vélo !"
            text="vitaes"
            />

            <h2 className="titreGros">Simplifiez-vous la vie, créez un compte !</h2>
            <LinkOval
                link='/creerCompte'
                text="Créer un compte"    
            />
            <Background />
            </div>
            
        </>
    );
}