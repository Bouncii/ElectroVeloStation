import '@css/creerCompte.css';
import { Header } from "./home.jsx";

function FormulaireCreerCompte(){
    return <>
        <Header/>
        <div className="blocCreerCompte">
        <h3>Création de compte</h3>
        <form action="" method="post">
            <label>Nom :</label>
            <input type="text" name="nom" />
            <label>Prénom :</label>
            <input type="text" name="prenom" />
            <label>Email :</label>
            <input type="email" name="email" />
            <label>Mot de passe :</label>
            <input type="password" name="password" />
        </form>
        <button>Créer un compte</button>
        <p>Déjà un compte ? <a href="../connexion">Connectez-vous</a></p>
        </div>
        </>
}

export default function CreerCompte(){
    return <><FormulaireCreerCompte/></>
}