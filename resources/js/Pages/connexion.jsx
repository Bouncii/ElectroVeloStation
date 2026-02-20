import { useForm, Link } from '@inertiajs/react';
import '@css/connexion.css';
import { Header } from "./home.jsx";

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
            <div className="blocConnexion">
                <h3>Connexion</h3>
                <form onSubmit={submit}>
                    <label>Email :</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={data.email} 
                        onChange={e => setData('email', e.target.value)} 
                    />
                    {errors.email && <div className="messageErr">{errors.email}</div>}
                    <label>Mot de passe :</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={data.password} 
                        onChange={e => setData('password', e.target.value)} 
                    />
                    {errors.password && <div className="messageErr">{errors.password}</div>}
                    <button type="submit" disabled={processing}>
                        {texteBouton}
                    </button>
                </form>
                <p>Vous n'avez pas de compte ? <Link href="/register">Créez-en un</Link></p>
            </div>
        </>
}


export default function Connexion() {
    return <FormulaireConnexion />;
}