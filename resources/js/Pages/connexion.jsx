function FormulaireConnexion(){
    return <>
        <div className="blocConnexion">
        <h3>Connexion</h3>
        <form action="" method="post">
            <label>Email :</label>
            <input type="email" name="email" />
            <label>Mot de passe :</label>
            <input type="password" name="password" />
        </form>
        <a href="reservation">Se connecter</a>
        </div>
        </>
}

export default function Connexion(){
    return <><FormulaireConnexion/></>
}