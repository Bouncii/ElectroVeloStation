/*Ne pas enlever*/
/* eslint-disable react/react-in-jsx-scope */
/* <></> */
import { useState } from "react"
import { usePage, Link } from '@inertiajs/react';
import '@css/dashboard.css';

const CardResa = (props) => {
    return (
        <div className="cardReservation">
            <div className="resaTop">
                
                <p className="stationA">{props.pickup_station_name}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#000" d="m7.089 18.5l4.653-6.5L7.09 5.5h1.219l4.654 6.5l-4.654 6.5zm5.796 0l4.654-6.5l-4.655-6.5h1.22l4.654 6.5l-4.654 6.5z" />
                </svg>
                <p className="stationB">{props.return_station_name}</p>
            </div>
            <div className="bottom">
            
            <div className="user">
                <p className="name">{props.last_name}{props.first_name}</p>
                <p className="mail">{props.email}</p>
            </div>
            <div className="hours">
                <p className="debut">Départ : {props.start_date}</p>
                <p className="fin">Rendu : {props.end_date}</p>
            </div>
            
            </div>
            <div className="commande">
                <h3>Commande</h3>
                <p>{props.order}</p>
            </div>
            <div className="status">
            <select name="pets" id="pet-select">
                <option value="">{props.status}</option>
                <option value="dog">En attente</option>
                <option value="cat">Récupérée</option>
                <option value="hamster">Rendue</option>
            </select> 
            </div>
        </div>
    )
}


const WaitListEntry = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return(
        <>
        <div className="div1">
            <p>{props.id}</p>
            <p>{props.created_at}</p>
        </div>
        <div className="div2">
            <p>{props.first_name} {props.last_name}</p>
            <p>{props.email}</p>
        </div>
        <div className="div3">
            <p>{props.pickup_station_name}</p>
        </div>
        <div className="div4">
            <button onClick={() => setIsModalOpen(true)}>Détail</button>
        </div>

        <WaitDetail
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            data={props} 
        />

        </>
    )
}

const WaitDetail = ({isOpen, onClose, data}) => {
    if (!isOpen) return null;

    return(
        <div className="modal_overlay">
            <div className="modal_content" onClick={(e) => e.stopPropagation}>
                <button className="close_btn" onClick={onClose}>X</button>
                <h2>Détails de la demande</h2>
                <p><strong>ID :</strong> {data.id}</p>
                <p><strong>Client :</strong> {data.first_name} {data.last_name}</p>
                <p><strong>Age :</strong> {data.age}</p>
                <p><strong>Taille :</strong> {data.height}</p>
                <p><strong>Email :</strong> {data.email}</p>
                <p><strong>Station :</strong> {data.pickup_station_name}</p>
                <p><strong>Date :</strong> {data.created_at}</p>
                
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


export default function Dashboard() {

    // Placeholder. A changer pendant la liaison front et back

    const reservations = [
        {
            id: 1,
            pickup_station_name: "La station A",
            return_station_name: "La station B",
            start_date: "2026-04-02 19:53:26",
            end_date: "2026-04-03 07:53:26",
            last_name:"Dupont",
            first_name:"Martin",
            age:"54",
            height:"1m76",
            email:"dmartin@gmail.com",
            order:"alors là...",
            status:"Livrée",
        },
        {
            id: 2,
            pickup_station_name: "La station C",
            return_station_name: "La station A",
            start_date: "2026-03-01 10:00:00",
            end_date: "2026-04-01 10:00:00",
            last_name:"Truc",
            first_name:"Bidule",
            age:"27",
            height:"1m68",
            email:"truc@gmail.com",
            order:"ouais ouais ouais...",
            status:"Récupérée",
        }
    ];
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
                {reservations.map(resa => (
                    <CardResa key={resa.id} {...resa} />
                ))}
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
                    <button id="btnTri" onClick={trierListeAttente}>Tri</button>

                    {waitingEntries.map((entry) => (
                        <WaitListEntry key={entry.id} {...entry} />
                    ))}
                </div>

            </div>

        </div>
        </>
    );
}