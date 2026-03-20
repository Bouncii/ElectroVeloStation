import { useState } from "react";
import { useForm, router, Link } from '@inertiajs/react';

const AddReservationForm = ({ onCancel }) => {

    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        pickup_station_id: '',
        return_station_id: '',
        start_date: '',
        end_date: '',
        attributions: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/panel/reservations', {
            onSuccess: () => onCancel(),
        });
    };

    const handleIdsChange = (e) => {
    const input = e.target.value;
    const ids = input.split(',')
        .map(id => id.trim())
        .filter(id => id !== "") // On enlève les entrées vides
        .map(id => ({ person_id: parseInt(id) }));

    setData('attributions', ids);
};

    return (

        <form onSubmit={handleSubmit} className='addUserForm'>
            <h3>Nouvelle Réservation</h3>
            
            {errors.attributions && <p style={{color: 'red'}}>Erreur : {errors.attributions}</p>}

            <input
                type="number"
                placeholder="User ID"
                value={data.user_id}
                onChange={(e) => setData('user_id', e.target.value)}
            />

            <input
                type="number"
                placeholder="Station départ ID"
                value={data.pickup_station_id}
                onChange={(e) => setData('pickup_station_id', e.target.value)}
            />

            <input
                type="number"
                placeholder="Station retour ID"
                value={data.return_station_id}
                onChange={(e) => setData('return_station_id', e.target.value)}
            />

            <input 
                type="datetime-local" 
                value={data.start_date} 
                onChange={e => setData('start_date', e.target.value)} 
            />

            <input 
                type="datetime-local" 
                value={data.end_date} 
                onChange={e => setData('end_date', e.target.value)} 
            />
            
            <div>
                <label>IDs des personnes (séparés par des virgules) :</label>
                <input 
                    type="text" 
                    placeholder="Id personne"
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

            <button type="submit" disabled={processing}>
                {processing ? "Création..." : "Créer réservation"}
            </button>

        </form>
    );
};


const ReservationCard = ({ reservation }) => {

    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        user_id: reservation.user_id,
        pickup_station_id: reservation.pickup_station_id,
        return_station_id: reservation.return_station_id,
        start_date: reservation.start_date || '',
        end_date: reservation.end_date || '',
        attributions: reservation.attributions?.map(attr => ({ person_id: attr.person_id })) || [],
    });

    const handleIdsChange = (e) => {
        const input = e.target.value;
        const ids = input.split(',')
            .map(id => id.trim())
            .filter(id => id !== "")
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

        <div className="usersCardDetails">

            {isEditing ? (

                <form onSubmit={handleSave}>

                    <input
                        type="number"
                        value={data.user_id}
                        onChange={(e) => setData('user_id', e.target.value)}
                    />

                    <input
                        type="number"
                        value={data.pickup_station_id}
                        onChange={(e) => setData('pickup_station_id', e.target.value)}
                    />

                    <input
                        type="number"
                        value={data.return_station_id}
                        onChange={(e) => setData('return_station_id', e.target.value)}
                    />

                    <input 
                        type="datetime-local" 
                        value={data.start_date} 
                        onChange={e => setData('start_date', e.target.value)} 
                    />

                    <input 
                        type="datetime-local" 
                        value={data.end_date} 
                        onChange={e => setData('end_date', e.target.value)} 
                    />
                    
                    <div>
                        <label>IDs des personnes (séparés par des virgules) :</label>
                        <input 
                            type="text" 
                            value={data.attributions.map(a => a.person_id).join(', ')}
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

                    <div className="button">

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

                    <Link href="/dashboard">Réservation #{reservation.id}</Link>

                    <p>User : {reservation.user?.first_name} {reservation.user?.last_name}</p>

                    <p>
                        Station départ : {reservation.pickup_station?.name}
                    </p>

                    <p>
                        Station retour : {reservation.return_station?.name}
                    </p>

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

                    <div className="button">

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


export default function GestionReservations({ reservations = [], persons = [], errors }) {
/* ... = [] évite erreur .lenght */
    const [showForm, setShowForm] = useState(false);

    return (

        <>
            
            <button className='btn_add' onClick={() => setShowForm(!showForm)}>
                {showForm ? "Annuler" : "Nouvelle réservation"}
            </button>

            {showForm && (
                <AddReservationForm onCancel={() => setShowForm(false)} 
                persons={persons}
                />
            )}

            <h2>Liste des réservations</h2>

            <div className="users_grid">

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