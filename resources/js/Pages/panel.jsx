/*Ne pas enlever*/
/* eslint-disable react/react-in-jsx-scope */
/* <></> */
import { useState, useEffect } from "react"
import { usePage, Link } from '@inertiajs/react';
import { FormatDate } from "@/formatDate.jsx";
import styles from "@css/panel.module.css";
import '@css/app.css';

// Fonction qui permet l'affichage de la liste d'attente.
// Pend en paramètre toutes les infos des de toutes les pendingReservations
function AfficherWaitList({pendingReservations}){

    const [selectedRes, setSelectedRes] = useState(null);

    // Protection si on n'arrive pas à charger les réservations
    if (!pendingReservations) {
        return <p>Chargement des réservations...</p>
    }
        return (
            <>
                {/* map pour récupérer les informations des réservations */}
                {pendingReservations.map(res => (
                    <div key={res.id} className={styles.wait_entry}>
                        <div className={styles.div1}>
                        <p> {res.id}</p>
                        <p>{FormatDate(res.created_at)}</p> 
                        </div>

                        <div className={styles.div2}>
                            <p> 
                                {res.user?.first_name ? `${res.user.first_name} ${res.user.last_name}` : "Client Anonyme"}
                            </p>
                            <p> {res.user?.email || "Aucun email"}</p>
                        </div>

                        <div className={styles.div3}>
                            <p>{res.station.name}</p>
                        </div>

                        <div className={styles.div4}>
                            <button className={styles.btn_details} onClick={() => setSelectedRes(res)}>Détails</button>
                        </div>
                    </div>
                ))}
                {/* Component qui affiche les détails de la demande en attente dans une fenêtre modale. */}
                <WaitDetail
                    isOpen={!!selectedRes} 
                    onClose={() => setSelectedRes(null)} 
                    data={selectedRes} 
                />
            </>  
        );
}


// Component qui affiche les détails de la demande en attente dans une fenêtre modale.
// isOpen : état de la fenêtre modale
// onClose : action à la fermeture de la modale
// data : les informations de la réservation en attente
const WaitDetail = ({isOpen, onClose, data}) => {
    if (!isOpen || !data) return null;

    return(
        <div className={styles.modal_overlay}>
            <div className={styles.modal_content} onClick={(e) => e.stopPropagation}>
                <button className={styles.close_btn} onClick={onClose}>X</button>
                <h2 className={styles.titre_modale}>Détails de la demande</h2>
                <p><strong>ID :</strong> {data.id}</p>
                <p><strong>Client :</strong> {data.user?.first_name} {data.user?.last_name}</p>
                {/*<p><strong>Age :</strong> {data.user?.age}</p>
                <p><strong>Taille :</strong> {data.user?.height}</p>*/}
                <p><strong>Email :</strong> {data.user?.email}</p>
                <p><strong>Station :</strong> {data.station.name}</p>
                <p><strong>Date :</strong>{FormatDate(data.created_at)}</p>
                <p><strong>Commande :</strong></p>
                <div className={styles.WaitListCommande}>   
                    {/* map pour récupérer les infos                      */}
                        {data.attributions && data.attributions.length > 0 ? (
                            <ul className={styles.wait_liste_velos}>
                                {data.attributions.map((attr, index ) => (
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
        </div>
    )
}

// Component qui permet de renvoyer vers une autre page admin ou employé
// Props : - link, un lien de redirection
//         - name, un texte qui donne du contexte dur la redirection
const RedirectBox = (props) => {
    return (
    <div className={styles.box}>
        {/* Logo svg */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="8" fill="url(#paint0_linear_116_450)"/>
            <path d="M37.9565 24.1739H25.0435V24.8913C25.0435 32.0652 20.0217 34.2174 20.0217 34.2174M30.7826 33.5C30.7826 32.5579 30.5971 31.625 30.2365 30.7547C29.876 29.8843 29.3476 29.0934 28.6814 28.4273C28.0153 27.7611 27.2244 27.2327 26.354 26.8722C25.4837 26.5116 24.5508 26.3261 23.6087 26.3261C21.3255 26.3261 19.1359 27.2331 17.5214 28.8475C15.907 30.462 15 32.6516 15 34.9348C15 38.3595 16.3605 41.644 18.7821 44.0657C21.2038 46.4873 24.4883 47.8478 27.913 47.8478H28.6304M28.6304 47.8478C28.6304 49.2826 29.3478 50 29.3478 50H32.9348M28.6304 47.8478C28.6304 46.413 29.3478 45.6957 29.3478 45.6957H32.9348M32.9348 50V45.6957M32.9348 50H35.8043M32.9348 45.6957H35.8043M30.7797 33.5C30.7797 35.4026 30.0239 37.2274 28.6785 38.5727C27.3332 39.9181 25.5085 40.6739 23.6058 40.6739M23.6058 40.6739C22.0533 40.676 20.5423 40.1723 19.3015 39.2391M23.6058 40.6739C22.5665 40.6746 21.5394 40.4494 20.5957 40.0139M21.4565 20.587H27.1957M42.9783 17H37.9565V24.8913C37.9565 32.0652 42.9783 34.2174 42.9783 34.2174M40.8261 40.6739C38.9234 40.6739 37.0987 39.9181 35.7534 38.5727C34.408 37.2274 33.6522 35.4026 33.6522 33.5C33.6522 31.5974 34.408 29.7726 35.7534 28.4273C37.0987 27.0819 38.9234 26.3261 40.8261 26.3261C42.7287 26.3261 44.5534 27.0819 45.8988 28.4273C47.2442 29.7726 48 31.5974 48 33.5C48 35.4026 47.2442 37.2274 45.8988 38.5727C44.5534 39.9181 42.7287 40.6739 40.8261 40.6739Z" stroke="white"/>
            <defs>
            <linearGradient id="paint0_linear_116_450" x1="32" y1="0" x2="32" y2="64" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E93B77"/>
            <stop offset="1" stopColor="#DA1F63"/>
            </linearGradient>
            </defs>
        </svg>

        <Link href={props.link}>{props.name}</Link>
    
    </div>
    )
}

// Fonction qui permet d'afficher les réservations.
// Prend en paramètre toutes les informations de toutes les réservations.

function AfficherReservations({ allReservations }){

    // protection si on a pas de réservations à charger
    if (!allReservations) {
        return <p>Chargement des réservations...</p>
    }
        return (
            <>
            <div className={styles.liste_reservations}>
                {/* map pour récupérer les infos */}
                {allReservations.map(res => (
                    <div key={res.id} className={styles.reservation_card}>
                        <div className={styles.stations}>
                        <p> {res.station?.name || res.station_name}</p>
                        </div>
                        {/* Heures */}
                        <div className={styles.hours}>
                            <div className={styles.depart_line}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#7B809A" d="M11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4M11 7h1v5.42l4.7 2.71l-.5.87l-5.2-3z" />
                            </svg>
                            <p>Départ : {res.start_date}</p>
                            </div>
                        {/* Rendu */}
                        <p className={styles.rendu}>Rendu : {res.end_date}</p>
                        </div>
                        {/* User */}
                        <div className={styles.user}>
                           <p> {res.user?.first_name} {res.user?.last_name}</p>
                           <p> {res.user?.email}</p>
                        </div>
                        {/* Commande */}
                        <div className={styles.commande}>                        
                        {res.attributions && res.attributions.length > 0 ? (
                            <ul className={styles.liste_velos}>
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
                        {/* Statut */}
                        <div className={styles.status}>{res.status}</div>
                    </div>
                ))}

            </div>
            </>
        )
    }


/* Fonction principale. Appel les composants necessaire au panel. */
export default function Panel() {
    
    const { pendingReservations, allReservations } = usePage().props;

    // Obsolète pour l'instant --------------------------------
    const trierListeAttente = () => {
        const sorted = [...waitingEntries].sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });
        setWaitingEntries(sorted);
    };
    // --------------------------------------------------------

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
    return(
    <>
        <header>
            <title>Panel admin EVS</title>
        </header>
        <div className={styles.dash}>
        <Link href="/" className={styles.back}>Accueil</Link>  
           <div className={styles.containerResa}>
            {/* Component qui affiche les réservations */}
                <AfficherReservations allReservations={allReservations}/>
            </div> 
                
            <div className={styles.redirectBoxes}>
                {/* Redirections */}
                <RedirectBox 
                className={styles.boxSta}
                link = 'panel/stations'
                name = "Gestion des stations"/>
                <RedirectBox
                className={styles.boxUser}
                link = '/panel/users'
                name = "Gestion des users"
                />
                <RedirectBox
                className={styles.boxRes}
                link = 'panel/reservations/'
                name = "Gestion des réservations"
                />
                <RedirectBox
                className={styles.BoxDash}
                link = 'panel/dashboard/'
                name = "Dashbaord"
                />
            </div>
                 
            {/* Liste d'attente */}
            <div className={styles.waitList}>
                <h2>Liste d'attente</h2>
                <div className={styles.waitGrid}>
                    <div className={styles.headWaitGrid}>
                    <h3>Réservation</h3>
                    <h3>Client</h3>
                    <h3>Station </h3>
                    </div>
                    <AfficherWaitList pendingReservations={pendingReservations}/>
                </div>

            </div>
                       
        </div>
    </>
)}