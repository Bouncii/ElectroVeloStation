import { useState, useEffect } from "react"
import { usePage, Link } from '@inertiajs/react';
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
                <h3>Vélos</h3>
                <BikeStatsTable data={bikeData} />
            </div>

            <div className={styles.resaContainer}>
                <h3>Réservations du jour</h3>
                 <ResaStatsTable data={resaData} />
            </div>

        </div>
        </>
    )
}

const DepartWindow = ({data}) => {
    if (!data) return null;

    return(
        <>
        <div className={styles.departWinContainer}>

                <h3>Les vélos qui se taillent</h3>
        </div>
        </>
    )
}

const WaitWindow = ({data}) => {
    if (!data) return null;

    return(
        <>
        <div className={styles.waitWinContainer}>

                <h3>La liste d'attente</h3>
        </div>
        </>
    )
}

const ArriveWindow = ({data}) => {
    if (!data) return null;

    return(
        <>
        <div className={styles.arriveWinContainer}>

                <h3>Les vélos qui viennent squater</h3>
        </div>
        </>
    )
}

const OpeWindow = ({data}) => {
    if (!data) return null;

    return(
        <>
        <div className={styles.opeWinContainer}>

                <h3>Opération de monétisation (si seulement)</h3>
        </div>
        </>
    )
}

export default function DashboardTest() {
    const [activeWindow, setActiveWindow] = useState('none');
    const {station, bikeStats, 
        departingReservations, arrivingReservations, 
        pendingReservations} = usePage().props;

    const resaStats = {
        "Départs prévus": departingReservations.length,
        "Arrivées prévues": arrivingReservations.length,
        "En attente": pendingReservations.length
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
            <li onClick={() => setActiveWindow('departing')}>Departing</li>
            <li onClick={() => setActiveWindow('waitlist')}>Liste d'attente</li>
            <li onClick={() => setActiveWindow('arriving')}>Arriving + détails</li>
            <li onClick={() => setActiveWindow('operation')}>Opération de réaprovisionnement</li>
            <li className={styles.back}> <Link href="./">Retour</Link></li>
        </ul>
        </div>
        <div className={styles.changingWindow}>
                {activeWindow === 'stats' && <StatWindow bikeData={bikeStats} resaData={resaStats} />}
                {activeWindow === 'departing' && <DepartWindow data={bikeStats} />}
                {activeWindow === 'waitlist' && <WaitWindow data={bikeStats} />}
                {activeWindow === 'arriving' && <ArriveWindow data={bikeStats} />}
                {activeWindow === 'operation' && <OpeWindow data={bikeStats} />}
        </div>
    </div>    
        </>
    )
}