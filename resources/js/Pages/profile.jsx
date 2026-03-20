import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import '@css/profile.module.css';
import { Header } from "../Pages/home.jsx";
import styles from '@css/profile.module.css';
import '@css/app.css';

function infosProfil() {
    const { user } = usePage().props;
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        last_name: user.last_name,
        first_name: user.first_name,
        heigth: user.heigth,
        email: user.email,
        peoples: [],
        reservations: []
    })
    
    return <>
    <div className={styles.blocProfile}>
        <h1>Bienvenue {user.first_name} {user.last_name}</h1>
        <h2>Vos informations : </h2>
        <div className={styles.infosProfile}>
            <p><strong>Nom :</strong> {user.last_name}</p>
            <p><strong>Prénom :</strong> {user.first_name}</p>
            <p><strong>Email :</strong> {user.email}</p>
            <p><strong>Taille :</strong> {user.heigth} cm</p>
        </div>
        <button onClick={() => setEditing(true)}>Modifier mes informations</button>
        {editing && (
            <form onSubmit={(e) => {
                e.preventDefault();
                // Handle form submission
            }}>
                <input
                    type="text"
                    placeholder="Nom"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
                <input
                    type="text"
                    placeholder="Prénom"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input
                    type="number"
                    placeholder="Taille (cm)"
                    value={formData.heigth}
                    onChange={(e) => setFormData({...formData, heigth: e.target.value})}
                />
                <button type="submit">Enregistrer</button>
            </form>
        )}
        </div></>
        }
function infosPeople(){
    const { peoples } = usePage().props;
    const [editing, setEditing] = useState(false);
    return <><div className={styles.blocPeople}>
        <h2>Vos personnes associées : </h2>
        {peoples.length === 0 ? (
            <p>Aucune personne associée.</p>
        ) : (
            <ul>
                {peoples.map((people) => (
                    <li key={people.id}>
                        {people.first_name} {people.last_name} - {people.age} ans
                    </li>
                ))}
            </ul>
        )}
    </div>
    if (editing) {
        <form onSubmit={(e) => {
            e.preventDefault();
            // Handle form submission
        }}>
            <input
                type="text"
                placeholder="Nom"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            /> 
            <input
                type="text"
                placeholder="Prénom"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            />
            <input
                type="number"
                placeholder="Âge"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
            <input type="number" placeholder="Taille (cm)" value={formData.heigth} onChange={(e) => setFormData({...formData, heigth: e.target.value})} />
            <button type="submit">Enregistrer</button>
        </form>
    }
    </>
}
function afficheReservations() {
    
    const { reservations } = usePage().props;

    return <><div className={styles.blocReservations}>
        <div className={styles.historiqueReservations}>
            <h2>Historique de vos réservations :</h2>
            {reservations.length === 0 ? (
                <p>Aucune réservation effectuée.</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => (
                        <li className={styles[reservation.status]} key={reservation.id}>
                            Réservation du {reservation.start_date} au {reservation.end_date} pour {reservation.peoples.length} personne(s)
                        </li>
                    ))}
                </ul>
            )}
        </div>

    </div>
    </>
};

export default function Profile() {
    return <><div className={styles.profilePage}><infosProfil /><infosPeople /><afficheReservations /></div></>;
}