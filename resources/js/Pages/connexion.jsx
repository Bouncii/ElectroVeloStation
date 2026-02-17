import '@css/connexion.css';
import { Header } from "./home.jsx";

function FormulaireConnexion(){
    return <>
        <Header/>
        <div className="blocConnexion">
        <h3>Connexion</h3>
        <form action="" method="post">
            <label>Email :</label>
            <input type="email" name="email" />
            <label>Mot de passe :</label>
            <input type="password" name="password" />
        </form>
        <button>Se connecter</button>
        <p>Vous n'avez pas de compte ? <a href="../creerCompte">Créez-en un</a></p>
        </div>
        </>
}

export default function Connexion(){
    return <><FormulaireConnexion/></>
}