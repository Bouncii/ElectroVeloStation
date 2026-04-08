import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import '@css/profile.module.css';
import { Header } from "../Pages/home.jsx";
import styles from '@css/profile.module.css';
import '@css/app.css';



function InfosProfil() {
    const [editing, setEditing] = useState(false);
    const { user } = usePage().props.auth;
    console.log(user);
    const [formData, setFormData] = useState({
        last_name: user.last_name,
        first_name: user.first_name,
        required_bike_size: user.required_bike_size,
        email: user.email,
        //people: [],
        //reservations: []
});
    
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

export function InfosPeople(){
    const { people } = usePage().props;
    console.log(people);
    const [editing, setEditing] = useState(false);
    return <><div className={styles.blocPeople}>
        <h2>Vos personnes associées : </h2>
        {people.length == 0 ? (
            <p>Aucune personne associée.</p>
        ) : (
            <ul>
                {people.map((p) => (
                    <li key={p.id}>
                        {p.first_name} {p.last_name} - {p.age} ans - {p.heigth} cm
                        {editing && (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                // Handle form submission
                            }}>
                                <input
                                    type="text"
                                    placeholder="Nom"
                                    value={p.last_name}
                                    onChange={(e) => p.last_name = e.target.value}
                                /> 
                                <input
                                    type="text"
                                    placeholder="Prénom"
                                    value={p.first_name}
                                    onChange={(e) => p.first_name = e.target.value}
                                />
                                <input
                                    type="number"
                                    placeholder="Âge"
                                    value={p.age}
                                    onChange={(e) => p.age = e.target.value}
                                />
                                <input 
                                    type="number" 
                                    placeholder="Taille (cm)" 
                                    value={p.heigth} 
                                    onChange={(e) => p.heigth = e.target.value} 
                                />
                                <button type="submit">Enregistrer</button>
                            </form>
                        )}
                        <button type="button" onClick={() => setEditing(true)}>Modifier</button>
                    </li>
                ))}
            </ul>
        )}
    </div>
    
    </>
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
    <button onClick={() => setActiveTab("people")}>
        Mes cyclistes
    </button>

    <button onClick={() => setActiveTab("reservations")}>
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