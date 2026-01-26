/*Ne pas enlever sinon c'est la merde*/
/* eslint-disable react/react-in-jsx-scope */
/* <> */
import { useState } from "react"

import '../../css/home.css'; /* TODO : configuré un alias */
/* Fonction du header - WIP :
- Prévoir la gestion de l'écran (ordi ou tel) via un useState
*/

export function reservation(){
    console.log('c reserve tkt');
}

export function Header(){
    return (
        <header className="Header">
            <nav className="Nav">
                <a href ="/">Se connecter</a>
                <button onClick={reservation}>Reservé</button>
            </nav>         
        </header>
    )
}

export default function Home(){
    const [nb,setNb] = useState(0);

    const increment = _ =>{
        setNb(nb+1)
    };

    return (
        <>
            <h1>Hello user</h1>
            <button onClick={increment}>{nb} clicks</button>
        </>
    );
}