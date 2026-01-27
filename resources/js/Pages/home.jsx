/*Ne pas enlever*/
/* eslint-disable react/react-in-jsx-scope */
/* <> */
import { useState } from "react"

import '@css/home.css';
/* Fonction du header - WIP :
- Prévoir la gestion de l'écran (ordi ou tel) via un useState
*/

export function Reservation(){
    console.log('c reserve tkt');
}

export function Header(){
    return (
        <header className="Header">
            <nav className="Nav">
                <a href ="/">Se connecter</a>
                <button onClick={Reservation}>Reservé</button>
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
    const [nb,setNb] = useState(0);

    const increment = _ =>{
        setNb(nb+1)
    };

    return (
        <>
            <h1>Hello user</h1>
            <header>
                
            </header>
            <button onClick={increment} className = 'Button'>{nb} 
            Click</button>

            <div id="stations">
                <h1>Nos stations</h1>
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
        </>
    );
}