import { useForm, Link } from '@inertiajs/react';
import '@css/creerCompte.css';
import { Header } from "./home.jsx";

function FormulaireCreerCompte(){
    const { data, setData, post, processing, errors } = useForm({
        last_name:'',
        first_name:'',
        email: '',
        password: '',
    });

    let texteBouton;
    if (processing) {
        texteBouton = 'Création en cours...';
    } else {
        texteBouton = 'Créer un compte';
    }


    function submit(e) {
        e.preventDefault();
        post('/register');
    }

    return <>
            <Header />
            <div className="blocCreerCompte">
                <h3>Création de compte</h3>    
                <form onSubmit={submit}>
                    <label>Nom :</label>
                    <input 
                        type="text" 
                        value={data.last_name} 
                        onChange={e => setData('last_name', e.target.value)} 
                    />
                    {errors.last_name && <div className="messageErr">{errors.last_name}</div>}
                    <label>Prénom :</label>
                    <input 
                        type="text" 
                        value={data.first_name} 
                        onChange={e => setData('first_name', e.target.value)} 
                    />
                    {errors.first_name && <div className="messageErr">{errors.first_name}</div>}
                    <label>Email :</label>
                    <input 
                        type="email" 
                        value={data.email} 
                        onChange={e => setData('email', e.target.value)} 
                    />
                    {errors.email && <div className="messageErr">{errors.email}</div>}

                    <label>Mot de passe :</label>
                    <input 
                        type="password" 
                        value={data.password} 
                        onChange={e => setData('password', e.target.value)} 
                    />
                    {errors.password && <div className="messageErr">{errors.password}</div>}
                    {/* Le bouton utilise notre variable texteBouton calculée avec le "if" */}
                    <button type="submit" disabled={processing}>
                        {texteBouton}
                    </button>
                </form>

                <p>Déjà un compte ? <Link href="/login">Connectez-vous</Link></p>
            </div>
        </>
}



export default function CreerCompte(){
    return <><FormulaireCreerCompte/></>
}