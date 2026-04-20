import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import '@css/profile.module.css';
import { Header } from "../Pages/home.jsx";
import styles from '@css/profile.module.css';
import '@css/app.css';





function InfosProfil() {
    const [editing, setEditing] = useState(false);
    const { user } = usePage().props.auth;

    const [formData, setFormData] = useState({
        last_name: user.last_name,
        first_name: user.first_name,
        required_bike_size: user.required_bike_size,
        email: user.email,
    });

    function handleSubmit(e) {
        e.preventDefault();
        router.post('/profile/update', formData, {
            onSuccess: () => setEditing(false),
        });
    }

    return (
        <div className={styles.blocProfile}>
            <h1>Bienvenue {user.first_name} {user.last_name}</h1>
            <h2>Vos informations :</h2>
            <div className={styles.infosProfile}>
                        <p><strong>Nom :</strong> {user.last_name}</p>
                        <p><strong>Prénom :</strong> {user.first_name}</p>
                        <p><strong>Email :</strong> {user.email}</p>
                    </div>
                    <button onClick={() => setEditing(true)} className={styles.updateButton}>
                        Modifier mes informations
                    </button>
            { editing ? (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nom"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Prénom"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <button type="submit" className={styles.submitButton}>Enregistrer</button>
                    <button type="button" onClick={() => setEditing(false)}>Annuler</button>
                </form>
            ) : null}
            </div> 
        );
    }

export function InfosPeople() {
    const { people } = usePage().props;
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    function handleEdit(person) {
        setEditingId(person.id);
        setEditData({ ...person });
    }

    function handleCancel() {
        setEditingId(null);
        setEditData({});
    }

    function handleSave(e, id) {
        e.preventDefault();
        router.post(`/profile/people/${id}/update`, editData, {
            onSuccess: () => {
                setEditingId(null);
                setEditData({});
            },
        });
    }

    return (
        <div className={styles.blocPeople}>
            <h2>Vos personnes associées :</h2>

            {people.length === 0 ? (
                <p>Aucune personne associée.</p>
            ) : (
                <ul>
                    {people.map((p) => (
                        <li key={p.id}>
                            <span>
                            {p.first_name} {p.last_name} — {p.age} ans — taille(cm) : {p.required_bike_size}
                            </span>
                            <button
                            type="button" onClick={() => handleEdit(p)} className={styles.updateButton} >
                            Modifier
                            </button>
                            {editingId === p.id ? (
                                <form onSubmit={(e) => handleSave(e, p.id)}>
                                    <input
                                        type="text"
                                        placeholder="Nom"
                                        value={editData.last_name}
                                        onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Prénom"
                                        value={editData.first_name}
                                        onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Âge"
                                        value={editData.age}
                                        onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Taille(cm)"
                                        value={editData.required_bike_size}
                                        onChange={(e) => setEditData({ ...editData, required_bike_size: e.target.value })}
                                    />
                                    <button type="submit" className={styles.submitButton}>Enregistrer</button>
                                    <button type="button" onClick={handleCancel}>Annuler</button>
                                </form>
                            ) : null
                        }
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


export function AfficheReservations() {
    const { reservations } = usePage().props;
    console.log(reservations);
    const { attributions } = usePage().props;
    return <><div className={styles.blocReservations}>
        <div className={styles.historiqueReservations}>
            <h2>Historique de vos réservations :</h2>
            {reservations.length == 0 ? (
                <p>Aucune réservation effectuée.</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li className={styles[reservation.status]} key={reservation.id}>
                            Réservation du {reservation.start_date} au {reservation.end_date} pour {attributions.length} personne(s)
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>

    </div>
    </>
};

function Tabinfos(){
    const [activeTab, setActiveTab] = useState("people");
    return <>
    <div className={styles.tabs}>
    <button onClick={() => setActiveTab("people")} className={activeTab === "people" ? styles.active : styles.inactive}>
        Mes cyclistes
    </button>

    <button onClick={() => setActiveTab("reservations")} className={activeTab === "reservations" ? styles.active : styles.inactive}>
        Mes réservations
    </button>
    
    {activeTab === "people" ? <InfosPeople/> : <AfficheReservations/> }</div>
    </>


}

export default function Profile() {
    
    return <>
    <Header/>
    <div className={styles.profilePage}><InfosProfil /><Tabinfos/></div></>;
}