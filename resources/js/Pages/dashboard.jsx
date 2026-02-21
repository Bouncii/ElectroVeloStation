/*Ne pas enlever*/
/* eslint-disable react/react-in-jsx-scope */
/* <></> */
import { useState } from "react"
import { usePage, Link } from '@inertiajs/react';
import '@css/dashboard.css';


function AfficherWaitList({pendingReservations}){

    const [selectedRes, setSelectedRes] = useState(null);

    if (!pendingReservations) {
        return <p>Chargement des réservations...</p>
    }
        return (
            <>
                {pendingReservations.map(res => (
                    <div key={res.id} className="wait_entry">
                        <div className="div1">
                        <p> {res.id}</p>
                        <p>{res.created_at}</p>
                        </div>

                        <div className="div2">
                            <p> {res.user.first_name} {res.last_name}</p>
                            <p> {res.user.email}</p>
                        </div>

                        <div className="div3">
                            <p>{res.pickup_station.name}</p>
                        </div>

                        <div className="div4">
                            <button onClick={() => setSelectedRes(res)}>Détails</button>
                        </div>
                    </div>
                ))}
                <WaitDetail
                    isOpen={!!selectedRes} 
                    onClose={() => setSelectedRes(null)} 
                    data={selectedRes} 
                />
            </>  
        );
}

const WaitDetail = ({isOpen, onClose, data}) => {
    if (!isOpen || !data) return null;

    return(
        <div className="modal_overlay">
            <div className="modal_content" onClick={(e) => e.stopPropagation}>
                <button className="close_btn" onClick={onClose}>X</button>
                <h2 className="titre_modale">Détails de la demande</h2>
                <p><strong>ID :</strong> {data.id}</p>
                <p><strong>Client :</strong> {data.user?.first_name} {data.user?.last_name}</p>
                {/*<p><strong>Age :</strong> {data.user?.age}</p>
                <p><strong>Taille :</strong> {data.user?.height}</p>*/}
                <p><strong>Email :</strong> {data.user?.email}</p>
                <p><strong>Départ :</strong> {data.pickup_station.name}</p>
                <p><strong>Arrivée :</strong>   {data.return_station.name}</p>
                <p><strong>Date :</strong> {data.created_at}</p>
                <p><strong>Commande :</strong></p>
                <div className="WaitListCommande">                        
                        {data.attributions && data.attributions.length > 0 ? (
                            <ul className="wait_liste_velos">
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

const RedirectBox = (props) => {
    return (
    <div className="box">
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

        <a href={props.link}>Gestion des stations</a>
    
    </div>
    )
}

function AfficherReservations({ allReservations }){

    if (!allReservations) {
        return <p>Chargement des réservations...</p>
    }
        return (
            <>
            <div id="liste_reservations">
                {allReservations.map(res => (
                    <div key={res.id} className="reservation_card">
                        <div className="stations">
                        <p> {res.pickup_station?.name || res.pickup_station_name}</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="#000" d="m7.089 18.5l4.653-6.5L7.09 5.5h1.219l4.654 6.5l-4.654 6.5zm5.796 0l4.654-6.5l-4.655-6.5h1.22l4.654 6.5l-4.654 6.5z" />
                        </svg>
                        <p> {res.return_station?.name || res.return_station_name}</p>
                        </div>

                        <div className="hours">
                            <div className="depart_line">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path fill="#7B809A" d="M11.5 3a9.5 9.5 0 0 1 9.5 9.5a9.5 9.5 0 0 1-9.5 9.5A9.5 9.5 0 0 1 2 12.5A9.5 9.5 0 0 1 11.5 3m0 1A8.5 8.5 0 0 0 3 12.5a8.5 8.5 0 0 0 8.5 8.5a8.5 8.5 0 0 0 8.5-8.5A8.5 8.5 0 0 0 11.5 4M11 7h1v5.42l4.7 2.71l-.5.87l-5.2-3z" />
                            </svg>
                            <p>Départ : {res.start_date}</p>
                            </div>
                        <p className="rendu">Rendu : {res.end_date}</p>
                        </div>
                        <div className="user">
                           <p> {res.user?.first_name} {res.user?.last_name}</p>
                           <p> {res.user?.email}</p>
                        </div>
                        <div className="commande">                        
                        {res.attributions && res.attributions.length > 0 ? (
                            <ul className="liste_velos">
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
                        <div className="status">{res.status}</div>
                    </div>
                ))}

            </div>
            </>
        )
    }

export default function Dashboard() {
    
    const { pendingReservations, allReservations } = usePage().props;
    
    const [waitingEntries, setWaitingEntries] = useState([
        { id: "1", created_at: "2026-04-02 19:53:26", first_name: "Martin", last_name: "Dupont", age:"54", height:"1m76", email: "m.dupont@gmail.com", pickup_station_name: "Station A" },
        { id: "2", created_at: "2026-01-15 10:20:00", first_name: "Julie", last_name: "Durand", age:"27", height:"1m68", email: "j.durand@gmail.com", pickup_station_name: "Station C" },
        { id: "3", created_at: "2026-03-20 14:05:12", first_name: "Le", last_name: "Bernard", age:"119", height:"2m28", email: "l.bernard@gmail.com", pickup_station_name: "Station B" }
    ]);

    const trierListeAttente = () => {
        const sorted = [...waitingEntries].sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });
        setWaitingEntries(sorted);
    };

    return(
        <>
        <Link href="/" id="back">Accueil</Link>
        <div className="dash">
        
           <div id="containerResa">
                <AfficherReservations allReservations={allReservations}/>
            </div> 
                
            <div id="redirectBoxes">
                <RedirectBox 
                link = '/stationsdash'/>
            </div>
            
            <div id="waitList">
                <h2>Liste d'attente</h2>
                <div id="waitGrid">
                    <h3>Réservation</h3>
                    <h3>Client</h3>
                    <h3>Station départ</h3>
                    <button id="btnTri" onClick={trierListeAttente}>  </button> {/* Boutton de tri qu'on remettra après*/ }

                    <AfficherWaitList pendingReservations={pendingReservations}/>
                </div>

            </div>

        </div>
        </>
    );
}