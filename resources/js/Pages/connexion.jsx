import { useForm, Link } from '@inertiajs/react';
import styles from '@css/connexion.module.css';
import { Header } from "./home.jsx";
import '@css/app.css';

function FormulaireConnexion() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    
    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    let texteBouton;
    if (processing) {
        texteBouton = 'Chargement...';
    } else {
        texteBouton = 'Se connecter';
    }

    return <>
            <Header />
            <div className={styles.blocConnexion}>
                <h3>Connexion</h3>
                <form onSubmit={submit}>
                    
                    <input 
                        type="email" 
                        name="email" 
                        placeholder='email'
                        value={data.email} 
                        onChange={e => setData('email', e.target.value)} 
                    />
                    {errors.email && <div className={styles.messageErr}>{errors.email}</div>}
                    
                    <input 
                        type="password" 
                        name="password" 
                        placeholder='Mot de passe '
                        value={data.password} 
                        onChange={e => setData('password', e.target.value)} 
                    />
                    {errors.password && <div className={styles.messageErr}>{errors.password}</div>}
                    <div>
                    <button type="submit" id='btn' disabled={processing}>
                        {texteBouton}
                    </button></div>
                </form>
                <p>Vous n'avez pas de compte ? <Link href="/register">Créez-en un</Link></p>
            </div>
        </>
}


export default function Connexion() {
    return <><div className={styles.connexionPage}><div className={styles.flou}><FormulaireConnexion /></div></div></>;
}