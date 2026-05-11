import { useState, useEffect } from "react"
import { usePage, Link, router } from '@inertiajs/react';
import { Description, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FormatDate } from "@/formatDate.jsx";
import styles from "@css/dashboard/dashboard.module.css";
import '@css/app.css';

// Permet de créer une pop Up grâce à la librairie headlessui
function PopUp({isOpen,  setIsOpen, titre, subTitre, Desc, onConfirm}) {
    return (
        <>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className={styles.btnPopUp}>
                <div className={styles.containerPopUp}>
                    <DialogPanel className={styles.PanelDialog}>
                        <DialogTitle className={styles.DialogTitle}>{titre}</DialogTitle>
                        <Description>{Desc}</Description>
                        
                        <div className={styles.confirmBtn}>
                            <button onClick={() => setIsOpen(false)}>
                                {onConfirm ? "Annuler" : "Ok"}
                            </button>
                            {onConfirm && (
                            <button 
                                className={styles.btn_validate} 
                                onClick={() => {
                                    onConfirm();
                                    setIsOpen(false);
                                }}>
                                Confirmer
                            </button>
                            )}
                        </div>
                    </DialogPanel>
                </div>

            </Dialog>
            
        </>
    )
} 

// Permet de récup les stats concernant les vélos sous forme de tableau et les affcihe.
// Prend lesdites stats en paramètre
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

// Permet de récup les stats concernant les réservations sous forme de tableau et les affiches.
// Prend lesdites stats en paramètre
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

// Component qui affiche la fenêtre de stats
// Prends les stats des vélos et les stats de résa
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

// Component qui affiche la fenêtre de départs
// Prends toutes les infos sur les résa partentes, l'id de la station et onAlert qui sert a afficher la popUp
const DepartWindow = ({data, stationId, onAlert}) => {
    if (!data) return <p> Pas d'informations sur la station.</p>;

    const handleCheckIn = (reservationId) => {
        onAlert(
            "Confirmation", 
            "Voulez-vous vraiment confirmer le départ de cette réservation ?", 
            `Réservation #${reservationId}`,
            () => {
                router.patch(`/panel/dashboard/${stationId}/reservations/${reservationId}/checkin`, {}, {
                    onSuccess: (page) => onAlert("Succès", page.props.flash.success),
                    onError: () => onAlert("Erreur", "Erreur lors du check-in.")
                });
            }
        );
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

// Component qui affiche la fenêtre de départs
// Prends toutes les infos sur les résa en attentes et les infos sur la station actuelle
function WaitWindow({data, station}){
    

    if (!data) {
        return <p>Chargement des réservations...</p>;
    }
        return (
            <>
                {data.map(res => (
                    <div key={res.id} className={styles.wait_entry}>
                        <div className={styles.div1}>
                        <p> {res.id}</p>
                        <p>{FormatDate(res.created_at)}</p>  {/* Conversion format dates */}
                        </div>

                    <h2 className={styles.titre_modale}>Détails de la demande</h2>
                <p><strong>ID :</strong> {res.id}</p>
                <p><strong>Client :</strong> {res.user?.first_name} {res.user?.last_name}</p>
                <p><strong>Email :</strong> {res.user?.email}</p>
                <p><strong>Station :</strong> {station?.name}</p>
                <p><strong>Date :</strong> {FormatDate(res.created_at)}</p>
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


// Component qui affiche la fenêtre des arrivées
// Prends toutes les infos sur les résa qui arrivent
const ArriveWindow = ({data, stationId}) => {
    if (!data) return <p> Pas d'informations sur la station.</p>;
    return(
        <>
        <div className={styles.departWinContainer}>

                <h3 className={styles.subTitle}>Vélos entrants</h3>
                {!(data && data.length > 0) ? (
                    <p>Aucune réservation</p>
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

// Component qui gère un formulaire général utilisé dans les opérations de réaprovisionnement
// Prends toutes les infos sur les résa qui arrivent
const OperationForm = ({ title, description, buttonText, onSubmit, onAlert }) => {
    const [size, setSize] = useState('');
    const [count, setCount] = useState(1);

    // const availableSizes = [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];

    // envoie données
    const handleSubmit = () => {
        if (!size) return onAlert("Erreur", "Sélectionnez une taille");


        onAlert(
            "Confirmation",
            `Voulez-vous vraiment appliquer l'opération "${title}" pour ${count} vélo(s) ?`,
            `Taille : ${size}`,
            () => onSubmit(size, count)
        );
    };

    return (
        <div className={styles.containerGeneric}>
            <h3 className={styles.subTitle}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="">-- Taille --</option>
                <option value="100">100</option>
                <option value="110">110</option>
                <option value="120">120</option>
                <option value="130">130</option>
                <option value="140">140</option>
                <option value="150">150</option>
                <option value="160">160</option>
                <option value="170">170</option>
                <option value="180">180</option>
                <option value="190">190</option>
                <option value="200">200</option>
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

// Component qui affiche la fenêtre des opérations de réaprovisionnement
// Prends l'id de la startion et onAlert qui permet d'utiliser la popUp
const OpeWindow = ({stationId, onAlert}) => {
    if (!stationId) return null;
    
    // Lance le rééquilibrage
    const handleRebalance = () => {
        onAlert(
        "Rééquillibrage",
        "Lancer le scan et le rapatriement automatique des vélos ?",
        "Cette opération peut prendre quelques instants.",
        () => {
            router.post(`/panel/dashboard/${stationId}/rebalance`, {}, {
                onSuccess: (page) => onAlert("Succès", page.props.flash.success),
                onError: () => onAlert("Erreur", "Erreur lors du rééquilibrage.")
            });
        }
    );
};


    const sendRequest = (endpoint, size, count) => {
        router.post(`/panel/dashboard/${stationId}/bikes/${endpoint}`, 
            {size, count},
            {
            onSuccess: (page) => {
                if (page.props.flash.success) {
                    onAlert("Succès", page.props.flash.success);
                }
            },
            onError: (errors) => {
                if (errors.error) {
                    onAlert("Erreur", errors.error);
                } else {
                    onAlert("Erreur", "Une erreur est survenue lors de l'opération.");
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
            {/* // Maintenance */}
            <OperationForm 
                title="Maintenance"
                description="Mettre les vélos en maintenance."
                buttonText="Mettre en maintenance"
                onAlert={onAlert}
                onSubmit={(s, c) => sendRequest('maintenance', s, c)}
            />

            {/* Disponibilité */}
            <OperationForm 
                title="Disponibilité"
                description="Rendre des vélos disponibles."
                onAlert={onAlert}
                buttonText="Rendre disponible"
                onSubmit={(s, c) => sendRequest('available', s, c)}
            />

            {/* Ajout */}
            <OperationForm 
                title="Ajout"
                description="Ajouter des vélos à la station."
                onAlert={onAlert}
                buttonText="Ajouter"
                onSubmit={(s, c) => sendRequest('add', s, c)}
            />

            {/* Supression */}
            <OperationForm 
                title="Supression"
                description="Supprimer des vélos d'une station."
                onAlert={onAlert}
                buttonText="Supprimer"
                onSubmit={(s, c) => sendRequest('remove', s, c)}
            />
        </div>
        
    );
}

// Component qui affiche la fenêtre des résa en attentes
// Prends les infos des résas, l'id de la station et onAlert qui permet d'utiliser la popUp
const InProgressWindow = ({ data, stationId, onAlert }) => {
    if (!data) return <p>Pas d'informations sur la station.</p>;

    const handleCheckOut = (reservationId) => {
        onAlert(
        "Confirmation",
        "Confirmer le départ de cette réservation ?",
        `Réservation #${reservationId}`,
        () => {
            router.patch(`/panel/dashboard/${stationId}/reservations/${reservationId}/checkout`, {}, {
                onSuccess: (page) => onAlert("Succès", page.props.flash.success),
                onError: () => onAlert("Erreur", "Erreur lors du check-out.")
                });
            }
        );
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

/* Fonction principale. Appel les composants necessaire au panel. */
export default function DashboardTest() {

    const [activeWindow, setActiveWindow] = useState('stats'); // Etat pour savoir quel fenêtre afficher
    const {station, bikeStats, 
        departingReservations, arrivingReservations, 
        pendingReservations, inProgressReservations} = usePage().props;

    const resaStats = {
        "Départs prévus": departingReservations.length,
        "Arrivées prévues": arrivingReservations.length,
        "En attente": pendingReservations.length,
        "En cours": inProgressReservations.length,
    };

    const [popupConfig, setPopupConfig] = useState({ // Etat de la Pop UP
        isOpen: false,
        titre: '',
        subTitre: '',
        desc: '',
        action: null
    });

    // Permet de déclancher la pop up
    const triggerPopUp = (titre, desc, subTitre = '', action = null) => {
        setPopupConfig({ isOpen: true, titre, desc, subTitre, action });
    };

    // applcation de la bon ne classe pour le thème css
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
        {/* Menu de changement de fenêtre */}
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
        {/* changement de fenêtres */}
        <div className={styles.changingWindow}>
                {activeWindow === 'stats' && <StatWindow bikeData={bikeStats} resaData={resaStats} onAlert={triggerPopUp} />}
                {activeWindow === 'departing' && <DepartWindow data={departingReservations} stationId={station.id} onAlert={triggerPopUp}/>}
                {activeWindow === 'waitlist' && <WaitWindow data={pendingReservations} station={station} onAlert={triggerPopUp}/>}
                {activeWindow === 'arriving' && <ArriveWindow data={arrivingReservations} stationId={station.id} onAlert={triggerPopUp}/>}
                {activeWindow === 'operation' && <OpeWindow stationId={station.id} onAlert={triggerPopUp}/>}
                {activeWindow === 'inprogress' && <InProgressWindow data={inProgressReservations} stationId={station.id} onAlert={triggerPopUp} />}
        </div>
        {/* Pop Up */}
        <PopUp 
                isOpen={popupConfig.isOpen} 
                setIsOpen={(val) => setPopupConfig({...popupConfig, isOpen: val})}
                titre={popupConfig.titre}
                subTitre={popupConfig.subTitre}
                Desc={popupConfig.desc}
                onConfirm={popupConfig.action}
            />
    </div>    
    </>
    )
}