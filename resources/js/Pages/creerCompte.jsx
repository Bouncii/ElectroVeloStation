import { useForm, Link } from '@inertiajs/react';
import { Header } from "./home.jsx";
import styles from '@css/inscription.module.css';
import '@css/app.css';

function FormulaireCreerCompte(){
    const { data, setData, post, processing, errors } = useForm({
        last_name:'',
        first_name:'',
        email: '',
        password: '',
    }); // Initialisation des données du formulaire

    let texteBouton;
    if (processing) {
        texteBouton = 'Création en cours...';
    } else {
        texteBouton = 'Créer un compte';
    } // Variable pour le texte du bouton, qui change en fonction de l'état de "processing"


    function submit(e) {
        // Fonction appelée lors de la soumission du formulaire
        e.preventDefault();
        post('/register');
    }


    // Formulaire d'inscription
    return <>
            <Header />
            <div className={styles.blocCreerCompte}>
                <h3>Création de compte</h3>    
                <form onSubmit={submit}>
                    
                    <input 
                        type="text" 
                        placeholder='Nom'
                        value={data.last_name} 
                        onChange={e => setData('last_name', e.target.value)} // Mise à jour de la valeur de "last_name" dans les données du formulaire lors de la saisie
                    />
                    {errors.last_name && <div className={styles.messageErr}>{errors.last_name}</div>}
                    
                    <input 
                        type="text" 
                        placeholder='Prénom'
                        value={data.first_name} 
                        onChange={e => setData('first_name', e.target.value)} // Mise à jour de la valeur de "first_name" dans les données du formulaire lors de la saisie
                    />
                    {errors.first_name && <div className={styles.messageErr}>{errors.first_name}</div>}
                    
                    <input 
                        type="email" 
                        placeholder='email'
                        value={data.email} 
                        onChange={e => setData('email', e.target.value)} // Mise à jour de la valeur de "email" dans les données du formulaire lors de la saisie
                    />
                    {errors.email && <div className={styles.messageErr}>{errors.email}</div>}
                    <input 
                        type="password" 
                        placeholder="Mot de passe "
                        value={data.password} 
                        onChange={e => setData('password', e.target.value)} // Mise à jour de la valeur de "password" dans les données du formulaire lors de la saisie
                    />
                    {errors.password && <div className={styles.messageErr}>{errors.password}</div>}
                    {/* Le bouton utilise notre variable texteBouton calculée avec le "if" */}
                    <div>
                    <button type="submit" disabled={processing}>
                        {texteBouton}
                    </button>
                    </div>
                </form>

                <p>Déjà un compte ? <Link href="/login">Connectez-vous</Link></p> {/* lien vers la page de connexion */}
            </div>
        </>
}



export default function CreerCompte(){
    return <>
    <header>
        <title>Créez votre compte EVS</title>
    </header>
    <div className={styles.inscriptionPage}>
        <div className={styles.flou}>
            <FormulaireCreerCompte />
            </div></div>
            </>;
}