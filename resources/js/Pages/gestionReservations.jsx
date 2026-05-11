import { useState, useEffect } from "react";
import { useForm, router, Link } from '@inertiajs/react';
import styles from '@css/gestionReservations.module.css';
import '@css/app.css';

// Formulaire d'ajout de réservation
// onCancel : action fermeture
const AddReservationForm = ({ onCancel }) => {

    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        station_id: '',
        email : '',
        start_date: '',
        end_date: '',
        attributions: [],
    });
    // envoie des données
    const handleSubmit = (e) => {
        e.preventDefault();

        post('/panel/reservations', {
            onSuccess: () => onCancel(),
        });
    };

    const [idsString, setIdsString] = useState('');
    // gestion ID multiple personnes
    const handleIdsChange = (e) => {
        const input = e.target.value;
        setIdsString(input);

        const ids = input.split(',')
                .map(id => id.trim())
                .filter(id => id !== "" && !isNaN(id))
                .map(id => ({ person_id: parseInt(id) }));

            setData('attributions', ids);
    };

    return (
        // champs
        <form onSubmit={handleSubmit} className={styles.addUserForm}>
            <h3>Nouvelle Réservation</h3>
            
            {errors.attributions && <p style={{color: 'red'}}>Erreur : {errors.attributions}</p>}

            <input
                type="number"
                placeholder="User ID"
                value={data.user_id}
                onChange={(e) => setData('user_id', e.target.value)}
            />

            <input
                type="email"
                placeholder="Adresse Email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                required
            />

            <input
                type="number"
                placeholder="Station ID"
                value={data.station_id}
                onChange={(e) => setData('station_id', e.target.value)}
                required
            />

            <input 
                type="datetime-local" 
                value={data.start_date} 
                onChange={e => setData('start_date', e.target.value)} 
                required
            />

            <input 
                type="datetime-local" 
                value={data.end_date} 
                onChange={e => setData('end_date', e.target.value)}
                required
            />
            
            <div>
                <label>IDs des personnes (séparés par des virgules) :</label>
                <input 
                    type="text" 
                    placeholder="Id personne"
                    value={idsString}
                    onChange={handleIdsChange}
                />
                <p>
                    Actuellement {data.attributions.length} personne(s) ajoutée(s).
                </p>
                
                {errors.attributions && <p style={{color: 'red'}}>{errors.attributions}</p>}
                {Object.keys(errors).map(key => // map
                    key.includes('attributions') && <p key={key} style={{color: 'red'}}>{errors[key]}</p>
                )}

            </div>

            <button type="submit" disabled={processing}>
                {processing ? "Création..." : "Créer réservation"}
            </button>

        </form>
    );
};

// Component qui affiche les infos des réservations
const ReservationCard = ({ reservation }) => {

    const [isEditing, setIsEditing] = useState(false); // Indique si une modification est en cours

    // Formulaire
    const { data, setData, put, processing, errors } = useForm({
        user_id: reservation.user_id || '',
        station_id: reservation.station_id || '',
        email: reservation.email || '',
        start_date: reservation.start_date || '',
        end_date: reservation.end_date || '',
        attributions: reservation.attributions?.map(attr => ({ person_id: attr.person_id })) || [],
    });

    // gestion ID persons associés a l'user
    const [idsString, setIdsString] = useState(
        reservation.attributions?.map(attr => attr.person_id).join(', ') || ''
    );

    const handleIdsChange = (e) => {
        const input = e.target.value;
        setIdsString(input);

        const ids = input.split(',')
            .map(id => id.trim())
            .filter(id => id !== "" && !isNaN(id))
            .map(id => ({ person_id: parseInt(id) }));

        setData('attributions', ids);
    };

    const handleSave = (e) => {
        e.preventDefault();

        put(`/panel/reservations/${reservation.id}`, {
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleDelete = () => {

        if (confirm(`Supprimer la réservation #${reservation.id} ?`)) {

            router.delete(`/panel/reservations/${reservation.id}`);

        }

    };

    return (

        <div className={styles.usersCardDetails}>

            {isEditing ? (

                <form onSubmit={handleSave}>

                    <label>User ID</label>
                    <input
                        type="number"
                        value={data.user_id}
                        onChange={(e) => setData('user_id', e.target.value)}
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <label>Station ID</label>
                    <input
                        type="number"
                        value={data.station_id}
                        onChange={(e) => setData('station_id', e.target.value)}
                        required
                    />

                    <label>Début</label>
                    <input 
                        type="datetime-local" 
                        value={data.start_date} 
                        onChange={e => setData('start_date', e.target.value)} 
                        required
                    />

                    <label>Fin</label>
                    <input 
                        type="datetime-local" 
                        value={data.end_date} 
                        onChange={e => setData('end_date', e.target.value)} 
                        required
                    />
                    
                    <div>
                        <label>IDs des personnes (séparés par des virgules) :</label>
                        <input 
                            type="text" 
                            value={idsString}
                            onChange={handleIdsChange}
                        />
                        <p>
                            Actuellement {data.attributions.length} personne(s) ajoutée(s).
                        </p>
                    
                        {errors.attributions && <p style={{color: 'red'}}>{errors.attributions}</p>}
                        {Object.keys(errors).map(key => 
                            key.includes('attributions') && <p key={key} style={{color: 'red'}}>{errors[key]}</p>
                        )}
                    </div>

                    <div className={styles.button}>

                        <button type="submit" disabled={processing}>
                            {processing ? "Sauvegarde..." : "Enregistrer"}
                        </button>

                        <button type="button" onClick={() => setIsEditing(false)}>
                            Annuler
                        </button>

                    </div>

                </form>

            ) : (

                <>

                    <p>Réservation #{reservation.id}</p>

                    <p>User : {reservation.user?.first_name} {reservation.user?.last_name}</p>
                    <p>Email : {reservation.email}</p>
                    <p>
                        Station : {reservation.station?.name}
                    </p>

                    <p>Du : {new Date(reservation.start_date).toLocaleString()}</p>
                    <p>Au : {new Date(reservation.end_date).toLocaleString()}</p>
                    <p>Statut : <strong>{reservation.status}</strong></p>
                    <div>
                        <strong>Personnes :</strong>
                        {reservation.attributions && reservation.attributions.length > 0 ? (
                            <ul>
                                {reservation.attributions.map((attr, index) => (
                                    <li key={index}>
                                        {attr.person ? (
                                            `${attr.person.first_name} ${attr.person.last_name} (Vélo : ${attr.bike_id || 'Aucun'})`
                                        ) : (
                                            `ID Personne : ${attr.person_id}`
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            " Aucune personne liée"
                        )}
                    </div>

                    <div className={styles.button}>

                        <button onClick={() => setIsEditing(true)}>
                            Modifier
                        </button>

                        <button onClick={handleDelete}>
                            Supprimer
                        </button>

                    </div>

                </>

            )}

        </div>

    );
};


/* Fonction principale. Appel les composants necessaire.
Prend en paramètre toutes les infos des réservations et des persons */
export default function GestionReservations({ reservations = [], persons = [], errors }) {
/* ... = [] évite erreur .lenght */
    const [showForm, setShowForm] = useState(false);

    // Application de la bonne classe pour le thème css
    useEffect(() => {
        document.body.setAttribute('data-theme','admin');
        document.body.classList.add('theme-admin', 'admin');
        return () => {
            document.body.removeAttribute('data-theme');
            document.body.classList.remove('theme-admin', 'admin');
            document.body.classList.remove('theme-landing', 'landing');
        };
    },
    []);

    return (

        <>
            
        <header>
            <title>Gestion des réservations EVS</title>
        </header>


            <div className={styles.nav}>
                    <Link href="/" className={styles.back}>Accueil</Link>
                    <Link href="/panel" className={styles.back}>Panel</Link>
                    </div>
            <h2>Gestion des réservations</h2>
            <button className={styles.btn_add} onClick={() => setShowForm(!showForm)}>
                {showForm ? "Annuler" : "Nouvelle réservation"}
            </button>

            {showForm && (
                <AddReservationForm onCancel={() => setShowForm(false)} 
                persons={persons}
                />
            )}

            <div className={styles.users_grid}>

                {reservations.length > 0 ? (

                    reservations.map(reservation => (

                        <ReservationCard
                            key={reservation.id}
                            reservation={reservation}
                        />

                    ))

                ) : (

                    <p>Aucune réservation</p>

                )}

            </div>

        </>

    );

}