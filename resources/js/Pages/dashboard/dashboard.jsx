import { useState, useEffect } from "react"
import { usePage, Link, router } from '@inertiajs/react';
import styles from "@css/dashboard/dashboard.module.css";
import '@css/app.css';

const BikeStatsTable = ({ data }) => {
        // permet de transformer un objet en tableau
    // [ ["M", {available: 5, maintenance: 1}], ["L", {...}] ]
    const statsArray = Object.entries(data);
    return (
        <table className={styles.statsTable}>
            <thead>
                <tr>
                    <th>Taille</th>
                    <th>Disponible</th>
                    <th>Maintenance</th>
                </tr>
            </thead>
            <tbody>
                {statsArray.map(([size, counts]) => (
                    <tr key={size}>
                        <td><strong>{size}</strong></td>
                        <td>{counts.available}</td>
                        <td>{counts.maintenance}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const ResaStatsTable = ({ data }) => {
    const statsArray = Object.entries(data);
    return (
        <table className={styles.statsTable}>
            <thead>
                <tr>
                    <th>Statut</th>
                    <th>Nombre</th>
                </tr>
            </thead>
            <tbody>
                {statsArray.map(([status, count]) => (
                    <tr key={status}>
                        <td><strong>{status}</strong></td>
                        <td>{count}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const StatWindow = ({bikeData, resaData}) => {
    if (!bikeData) return <p>Aucunnes données disponibles pour les vélos.</p>;
    if (!resaData) return <p>Aucunnes données disponibles pour les réservations.</p>;
    return(
        <>
        <div className={styles.statWinContainer}>

            <div className={styles.bikeContainer}>
                <h3 className={styles.subTitle}>Vélos</h3>
                <BikeStatsTable data={bikeData} />
            </div>

            <div className={styles.resaContainer}>
                <h3 className={styles.subTitle}>Réservations du jour</h3>
                 <ResaStatsTable data={resaData} />
            </div>

        </div>
        </>
    )
}

const DepartWindow = ({data, stationId}) => {
    if (!data) return <p> Pas d'informations sur la station.</p>;

    const handleCheckIn = (reservationId) => {
        if (confirm("Confirmer le départ de cette réservation ?")) {
            router.patch(`/panel/dashboard/${stationId}/reservations/${reservationId}/checkin`, {}, {
                onSuccess: (page) => alert(page.props.flash.success),
                onError: () => alert("Erreur lors du check-in.")
            });
        }
    };

    return(
        <>
        <div className={styles.departWinContainer}>

                <h3 className={styles.subTitle}>Vélos sortants</h3>
                {!(data && data.length > 0) ? (
                    <p>Aucune résa</p>
                ): (<ul>
                    {data.map((resa) => (
                        <li key={resa.id}>
                            Résa #{resa.id} - {resa.user?.first_name} {resa.user?.last_name}
                            <ul>
                                {resa.attributions.map((attr) => (
                                    <li key={attr.id}>
                                        Vélo #{attr.bike?.id} — {attr.person?.first_name} {attr.person?.last_name}
                                    </li>
                                ))}
                            </ul>

                            <div className={styles.actions}>
                                <button
                                    className={styles.btn_checkin}
                                    onClick={() => handleCheckIn(resa.id)}>
                                    Confirmer le retour (Check-In)
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                
            )}

                
        </div>
        </>
    )
}

function WaitWindow({data, stationId}){
    

    if (!data) {
        return <p>Chargement des réservations...</p>;
    }
        return (
            <>
                {data.map(res => (
                    <div key={res.id} className={styles.wait_entry}>
                        <div className={styles.div1}>
                        <p> {res.id}</p>
                        <p>{res.created_at}</p>
                        </div>

                    <h2 className={styles.titre_modale}>Détails de la demande</h2>
                <p><strong>ID :</strong> {res.id}</p>
                <p><strong>Client :</strong> {res.user?.first_name} {res.user?.last_name}</p>
                <p><strong>Email :</strong> {res.user?.email}</p>
                <p><strong>Station :</strong> {res.station?.name}</p>
                <p><strong>Date :</strong> {res.created_at}</p>
                <p><strong>Commande :</strong></p>
                <div className={styles.WaitListCommande}>                        
                        {res.attributions && res.attributions.length > 0 ? (
                            <ul className={styles.wait_liste_velos}>
                                {res.attributions.map((attr, index ) => (
                                    <li key={attr.id || index}>
                                        Vélo n°{attr.bike?.id}
                                        {attr.person && ` (Attribué à : ${attr.person.first_name})`}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <span>Aucun vélo pour le moment...</span>
                        )}
                </div> 
                


                    </div>
                ))}
                
            </>  
        );
}

const ArriveWindow = ({data, stationId}) => {
    if (!data) return <p> Pas d'informations sur la station.</p>;
    return(
        <>
        <div className={styles.departWinContainer}>

                <h3 className={styles.subTitle}>Vélos entrants</h3>
                {!(data && data.length > 0) ? (
                    <p>Aucune résa</p>
                ): (
                <ul>
                    {data.map((resa) => (
                        <li key={resa.id}>
                            Résa #{resa.id} - {resa.user?.first_name} {resa.user?.last_name}
                            <ul>
                                {resa.attributions.map((attr) => (
                                    <li key={attr.id}>
                                        Vélo #{attr.bike?.id} — {attr.person?.first_name} {attr.person?.last_name}
                                    </li>
                                ))}
                            </ul>
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </>
    )
}

const OperationForm = ({ title, description, buttonText, onSubmit }) => {
    const [size, setSize] = useState('');
    const [count, setCount] = useState(1);

    const handleSubmit = () => {
        if (!size) return alert("Sélectionnez une taille");
        onSubmit(size, count);
    };

    return (
        <div className={styles.containerGeneric}>
            <h3 className={styles.subTitle}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="">-- Taille --</option>
                <option value="140">100</option>
                <option value="160">110</option>
                <option value="180">120</option>
                <option value="140">130</option>
                <option value="160">140</option>
                <option value="180">150</option>
                <option value="140">160</option>
                <option value="160">170</option>
                <option value="180">180</option>
                <option value="140">190</option>
                <option value="160">200</option>
            </select>
            <input 
                type="number" 
                min="1" 
                value={count} 
                onChange={(e) => setCount(e.target.value)} 
            />
            <button onClick={handleSubmit}>{buttonText}</button>
        </div>
    );
};

const OpeWindow = ({stationId}) => {
    if (!stationId) return null;
    
    const handleRebalance = () => {
        router.post(`/panel/dashboard/${stationId}/rebalance`, {}, {
           onSuccess: (page) => alert(page.props.flash.success),
            onError: () => alert("Erreur lors du rééquillibrage.")
        });
    };


    const sendRequest = (endpoint, size, count) => {
        router.post(`/panel/dashboard/${stationId}/bikes/${endpoint}`, 
            {size, count},
            {
            onSuccess: (page) => {
                if (page.props.flash.success) {
                    alert(page.props.flash.success);
                }
            },
            onError: (errors) => {
                if (errors.error) {
                    alert(errors.error);
                } else {
                    alert("Une erreur est survenue lors de l'opération.");
                }
            }
        }
        );
    };

    return(
        
        <div className={styles.opeWinContainer}>
            <div className={styles.containerReequi}>
                <h3 className={styles.subTitle}>Opération de réapprovisionnement</h3>
                <p className={styles.description}>
                    Cette action va scanner les besoins de la station et rapatrier les vélos disponibles depuis d'autres stations.
                </p>
                
                <button 
                    onClick={handleRebalance} 
                    className={styles.btn_admin}>
                    Lancer le rééquilibrage
                </button>
            </div>

            <OperationForm 
                title="Maintenance"
                description="Mettre les vélos en maintenance."
                buttonText="Mettre en maintenance"
                onSubmit={(s, c) => sendRequest('maintenance', s, c)}
            />

            <OperationForm 
                title="Disponibilité"
                description="Rendre des vélos disponibles."
                buttonText="Rendre disponible"
                onSubmit={(s, c) => sendRequest('available', s, c)}
            />

            <OperationForm 
                title="Ajout"
                description="Ajouter des vélos à la station."
                buttonText="Ajouter"
                onSubmit={(s, c) => sendRequest('add', s, c)}
            />

            <OperationForm 
                title="Supression"
                description="Supprimer des vélos d'une station."
                buttonText="Supprimer"
                onSubmit={(s, c) => sendRequest('remove', s, c)}
            />
        </div>
        
    );
}

const InProgressWindow = ({ data, stationId }) => {
    if (!data) return <p>Pas d'informations sur la station.</p>;

    const handleCheckOut = (reservationId) => {
        if (confirm("Confirmer la réception de cette réservation ?")) {
            router.patch(`/panel/dashboard/${stationId}/reservations/${reservationId}/checkout`, {}, {
                onSuccess: (page) => alert(page.props.flash.success),
            onError: () => alert("Erreur lors du check-out.")
            });
        }
    };


    return (
        <div className={styles.departWinContainer}>
            <h3 className={styles.subTitle}>Réservations en cours</h3>
            {!(data && data.length > 0) ? (
                <p>Aucune réservation en cours</p>
            ) : (
                <ul>
                    {data.map((resa) => (
                        <li key={resa.id}>
                            Résa #{resa.id} - {resa.user?.first_name} {resa.user?.last_name}
                        
                    <div className={styles.actions}>
                        <button 
                            className={styles.btn_checkout}
                            onClick={() => handleCheckOut(resa.id)}>
                            Confirmer le départ (Check-Out)
                        </button>
                    </div>
                        </li>
                        
                    ))}
                    
                </ul>
            )}
        </div>
    );
};

export default function DashboardTest() {

    const [activeWindow, setActiveWindow] = useState('none');
    const {station, bikeStats, 
        departingReservations, arrivingReservations, 
        pendingReservations, inProgressReservations} = usePage().props;

    const resaStats = {
        "Départs prévus": departingReservations.length,
        "Arrivées prévues": arrivingReservations.length,
        "En attente": pendingReservations.length,
        "En cours": inProgressReservations.length,
    };

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

    return(
        <>
        <div className={styles.pageContainer}>
        <div className={styles.menu}>
        <ul>
            <li className={styles.stationTitle}>{station?.name}</li>
            <li onClick={() => setActiveWindow('stats')}>Statistiques</li>
            <li onClick={() => setActiveWindow('departing')}>Départs</li>
            <li onClick={() => setActiveWindow('waitlist')}>Liste d'attente</li>
            <li onClick={() => setActiveWindow('arriving')}>Arrivées</li>
            <li onClick={() => setActiveWindow('operation')}>Opération de réaprovisionnement</li>
            <li onClick={() => setActiveWindow('inprogress')}>En cours</li>
            <li className={styles.back}> <Link href="./">Retour</Link></li>
        </ul>
        </div>
        <div className={styles.changingWindow}>
                {activeWindow === 'stats' && <StatWindow bikeData={bikeStats} resaData={resaStats} />}
                {activeWindow === 'departing' && <DepartWindow data={departingReservations} stationId={station.id} />}
                {activeWindow === 'waitlist' && <WaitWindow data={pendingReservations} stationId={station.id}/>}
                {activeWindow === 'arriving' && <ArriveWindow data={arrivingReservations} stationId={station.id}/>}
                {activeWindow === 'operation' && <OpeWindow stationId={station.id} />}
                {activeWindow === 'inprogress' && <InProgressWindow data={inProgressReservations} stationId={station.id}  />}
        </div>
    </div>    
        </>
    )
}