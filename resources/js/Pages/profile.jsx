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
        email: user.email,
    });

    function handleSubmit(e) {
        e.preventDefault();
        router.patch('/profile/update', formData, {
            onSuccess: () => setEditing(false),
        });
    }

    return (
        <div className={styles.blocProfile}>
        <div className={styles.profileHeader}>
            <h1>Bonjour, {user.first_name} {user.last_name}</h1>
            <p>Mon compte</p>
            <div className={styles.profileAvatar}>
                {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
        </div>
        <div className={styles.profileBody}>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Nom</div>
                    <div className={styles.infoValue}>{user.last_name}</div>
                </div>
                <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Prénom</div>
                    <div className={styles.infoValue}>{user.first_name}</div>
                </div>
                <div className={`${styles.infoItem} ${styles.full}`}>
                    <div className={styles.infoLabel}>Email</div>
                    <div className={styles.infoValue}>{user.email}</div>
                </div>
            </div>
            <button onClick={() => setEditing(true)} className={styles.updateButton}>
                Modifier mes informations
            </button>
            {editing && (
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Nom" value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
                    <input type="text" placeholder="Prénom" value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
                    <input type="email" placeholder="Email" value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <div className={styles.formActions}>
                        <button type="submit" className={styles.bnt}>Enregistrer</button>
                        <button type="button" onClick={() => setEditing(false)} className={styles.cancelButton}>Annuler</button>
                    </div>
                </form>
            )}
        </div>
    </div>
);
}

export function InfosPeople() {
    const { user } = usePage().props;
    const people = user.people;

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
        router.patch(`/profile/persons/${id}`, editData, {
            onSuccess: () => {
                setEditingId(null);
                setEditData({});
            },
        });
    }

    function handleDelete(id) {
        router.delete(`/profile/persons/${id}`);
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
                            type="button" onClick={() => handleEdit(p)} className={styles.bnt} >
                            Modifier
                            </button>
                            <button type="button" onClick={() => handleDelete(p.id)} className={styles.cancelButton}>
                                Supprimer
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
                                    <div className={styles.formActions}>
                                        <button type="submit" className={styles.bnt}>Enregistrer</button>
                                        <button type="button" onClick={handleCancel} className={styles.bnt}>Annuler</button>
                                    </div>
                                </form>
                            ) : null}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export function AfficheReservations() {
    const { user, stations, schedules } = usePage().props;
    const reservations = user.reservations;

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [suggestion, setSuggestion] = useState({}); // { [reservationId]: { available, station, distance_km } }

    async function handleSuggestTransfer(reservationId) {
        const res = await fetch(`/profile/reservations/${reservationId}/suggest-transfer`);
        const data = await res.json();
        setSuggestion((prev) => ({ ...prev, [reservationId]: data }));
    }

    function handleTransfer(reservationId) {
        router.post(`/profile/reservations/${reservationId}/transfer`, {}, {
            onSuccess: () => setSuggestion((prev) => ({ ...prev, [reservationId]: null })),
        });
    }

    function handleEdit(reservation) {
        setEditingId(reservation.id);
        setEditData({ ...reservation,
            start_date: reservation.start_date?.split('T')[0] ?? reservation.start_date?.split(' ')[0],
            start_time: reservation.start_date?.split('T')[1]?.slice(0, 5) ?? reservation.start_date?.split(' ')[1]?.slice(0, 5),
            end_date: reservation.end_date?.split('T')[0] ?? reservation.end_date?.split(' ')[0],
            end_time: reservation.end_date?.split('T')[1]?.slice(0, 5) ?? reservation.end_date?.split(' ')[1]?.slice(0, 5),
        });
    }

    function handleCancel() {
        setEditingId(null);
        setEditData({});
    }

    function handleSave(e, id) {
        e.preventDefault();
        router.post(`/profile/reservations/${id}/transfer`, editData, {
            onSuccess: () => {
                setEditingId(null);
                setEditData({});
            },
        });
    }

    function handleCancelReservation(id) {
        router.patch(`/profile/reservations/${id}/cancel`, {}, {
            onSuccess: () => setEditingId(null),
        });
    }

    function handleAcceptProposition(propositionId) {
        router.patch(`/profile/propositions/${propositionId}/accept`);
    }

    function handleRejectProposition(propositionId) {
        router.patch(`/profile/propositions/${propositionId}/reject`);
    }

    return (
        <div className={styles.blocReservations}>
            <h2>Historique de vos réservations :</h2>
            {reservations.length === 0 ? (
                <p>Aucune réservation effectuée.</p>
            ) : (
                <ul>
                    {reservations.map((reservation) => {
                        const scheduleStation = schedules.find(s => s.station_id === reservation.station_id);

                        return (
                            <li key={reservation.id}>
                                <span>
                                    Réservation du {reservation.start_date} au {reservation.end_date}
                                    {" "}pour {reservation.attributions.length} personne(s)
                                    {" — "}statut : 
                                    <span className={styles[reservation.status]}>
                                    {reservation.status}
                                    </span>
                                </span>

                                <ul>
                                    {reservation.attributions.map((attribution) => (
                                        <li key={attribution.id}>
                                            Vélo : {attribution.bike ? attribution.bike.id : "Non attribué"}
                                        </li>
                                    ))}
                                </ul>

                                {reservation.propositions?.length > 0 && (
                                    <ul>
                                        {reservation.propositions.map((proposition) => (
                                            <li key={proposition.id}>
                                                Proposition — statut : {proposition.status}
                                                {proposition.status === 'pending' && (
                                                    <>
                                                        <button type="button" onClick={() => handleAcceptProposition(proposition.id)} className={styles.submitButton}>
                                                            Accepter
                                                        </button>
                                                        <button type="button" onClick={() => handleRejectProposition(proposition.id)} className={styles.updateButton}>
                                                            Refuser
                                                        </button>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                                 <>
                                 <button className={styles.updateButton} onClick={() => handleEdit(reservation)}>
                                      Modifier
                                </button>
                                <button className={styles.cancelButton} onClick={() => handleCancelReservation(reservation.id)}>
                                    Annuler la réservation
                                </button>
                                {reservation.status === 'pending' && (
    <div>
        <button
            type="button"
            className={styles.updateButton}
            onClick={() => handleSuggestTransfer(reservation.id)}
        >
            Trouver une station disponible
        </button>

        {suggestion[reservation.id] && (
            suggestion[reservation.id].available ? (
                <div className={styles.suggestion}>
                    <p>
                        Station la plus proche disponible :{' '}
                        <strong>{suggestion[reservation.id].station.name}</strong>
                        {' '}— à {suggestion[reservation.id].distance_km} km
                    </p>
                    <button
                        type="button"
                        className={styles.submitButton}
                        onClick={() => handleTransfer(reservation.id)}
                    >
                        Confirmer le transfert
                    </button>
                </div>
            ) : (
                <p>Aucune station disponible pour ces dates.</p>
            )
        )}
    </div>
)}
                                  </>
                                 )}


                                {editingId === reservation.id ? (
                                    <form className={styles.updateFormResa} onSubmit={(e) => handleSave(e, reservation.id)}>
                                        <label>Station :</label>
                                        <select
                                            value={editData.station_id}
                                            onChange={(e) => setEditData({ ...editData, station_id: e.target.value })}
                                        >
                                            <option value="">Sélectionnez une station</option>
                                            {stations.map((station) => (
                                                <option key={station.id} value={station.id}>
                                                    {station.name}
                                                </option>
                                            ))}
                                        </select>
                                        <label>Date de début :</label>
                                        <input
                                            type="date"
                                            value={editData.start_date}
                                            onChange={(e) => setEditData({ ...editData, start_date: e.target.value })}
                                        />
                                        <label>Heure de début :</label>
                                        <input
                                            type="time"
                                            min={scheduleStation?.open_time}
                                            max={scheduleStation?.close_time}
                                            value={editData.start_time ?? ""}
                                            step="1800"
                                            onChange={(e) => setEditData({ ...editData, start_time: e.target.value })}
                                        />
                                        <label>Date de fin :</label>
                                        <input
                                            type="date"
                                            value={editData.end_date}
                                            onChange={(e) => setEditData({ ...editData, end_date: e.target.value })}
                                        />
                                        <label>Heure de fin :</label>
                                        <input
                                            type="time"
                                            min={scheduleStation?.open_time}
                                            max={scheduleStation?.close_time}
                                            value={editData.end_time ?? ""}
                                            step="1800"
                                            onChange={(e) => setEditData({ ...editData, end_time: e.target.value })}
                                        />
                                        <button type="submit" className={styles.submitButton}>Enregistrer</button>
                                        <button type="button" onClick={handleCancel}>Annuler</button>
                                    </form>
                                ) : null}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

function Tabinfos() {
    const [activeTab, setActiveTab] = useState("people");
    return (
    <div className={styles.tabs}>
        <div className={styles.tabNav}>
            <button onClick={() => setActiveTab("people")}
                className={`${styles.btn_infos} ${activeTab === "people" ? styles.active : styles.inactive}`}>
                Mes cyclistes
            </button>
            <button onClick={() => setActiveTab("reservations")}
                className={`${styles.btn_infos} ${activeTab === "reservations" ? styles.active : styles.inactive}`}>
                Mes réservations
            </button>
        </div>
        <div className={styles.tabContent}>
            {activeTab === "people" ? <InfosPeople /> : <AfficheReservations />}
        </div>
    </div>
    );
}

export default function Profile() {
    return (
        <>
            <Header />
            <div className={styles.profilePage}>
                <InfosProfil />
                <Tabinfos />
            </div>
        </>
    );
}