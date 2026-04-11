import { useState, useEffect } from "react"
import { usePage, Link } from '@inertiajs/react';
import styles from "@css/dashboard/dashboard.module.css";
import '@css/app.css';


const StatWindow = ({data}) => {
    if (!data) return null;

    return(
        <>
        <div className={styles.statWinContainer}>

            <div className={styles.bikeContainer}>
                <h3>Vélos</h3>
            </div>

            <div className={styles.resaContainer}>
                <h3>Réservations du jour</h3>
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
    const {station, bikeStats} = usePage().props;

    return(
        <>
        <div className={styles.pageContainer}>
        <div className={styles.menu}>
        <ul>
            <li>Nom de la station</li>
            <li onClick={() => setActiveWindow('stats')}>Statistiques</li>
            <li onClick={() => setActiveWindow('departing')}>Departing</li>
            <li onClick={() => setActiveWindow('waitList')}>Liste d'attente</li>
            <li onClick={() => setActiveWindow('arriving')}>Arriving + détails</li>
            <li onClick={() => setActiveWindow('operation')}>Opération de réaprovisionnement</li>
            <li className={styles.back}> <Link href="./">Retour</Link></li>
        </ul>
        </div>
        <div className={styles.changingWindow}>
                {activeWindow === 'stats' && <StatWindow data={bikeStats} />}
                {activeWindow === 'departing' && <DepartWindow data={bikeStats} />}
                {activeWindow === 'waitlist' && <WaitWindow data={bikeStats} />}
                {activeWindow === 'arriving' && <ArriveWindow data={bikeStats} />}
                {activeWindow === 'operation' && <OpeWindow data={bikeStats} />}
        </div>
    </div>    
        </>
    )
}