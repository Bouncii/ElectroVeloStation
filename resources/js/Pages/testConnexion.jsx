
import { usePage } from '@inertiajs/react';

export default function TestConnexion() {
    const { auth } = usePage().props;

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h1>🛠 Page de Debug Auth</h1>

            {auth.user ? (
                <div style={{ border: '2px solid green', padding: '15px', borderRadius: '8px' }}>
                    <h2 style={{ color: 'green' }}>✅ Utilisateur Connecté</h2>
                    
                    <p><strong>Prénom :</strong> {auth.user.first_name}</p>
                    <p><strong>Nom :</strong> {auth.user.last_name}</p>
                    <p><strong>Email :</strong> {auth.user.email}</p>
                    
                    <hr />
                    <h3>Données brutes (JSON) :</h3>
                    <pre style={{ background: '#f4f4f4', padding: '10px' }}>
                        {JSON.stringify(auth.user, null, 2)}
                    </pre>
                </div>
            ) : (
                <div style={{ border: '2px solid red', padding: '15px', borderRadius: '8px' }}>
                    <h2 style={{ color: 'red' }}>❌ Aucun utilisateur en session</h2>
                    <p>Tu es actuellement vu comme un "Invité".</p>
                    <a href="/auth/login">Retourner à la connexion</a>
                </div>
            )}
        </div>
    );
}
