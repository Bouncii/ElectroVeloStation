import { Link } from '@inertiajs/react';
import styles from "@css/dashboard/stationSelection.module.css";
import '@css/app.css';

function StationSelection({ stations }) {
    return (
        <section className={styles.pageContainer}>
            <div className={styles.pageHeader}>
            <h1>Veuillez choisir une station : </h1>
            <div className={styles.navLinks}>
            <Link href="/" className={styles.back}>Accueil</Link>
            <Link href="/panel" className={styles.back}>Panel</Link>
            </div>
            </div>    

            <div className={styles.stationCardsContainer}> 
                {stations.map((station) => (
                    <StationCard key={station.id} station={station} />
                ))}
            </div>   
        </section>
    );
}

function StationCard({ station }) {
    return (
        <div className={styles.cards}>
            <div className={styles.cardTop}><h3>{station.name}</h3></div>
            <div className={styles.cardMiddle}>
                <div className={styles.statContainer}>
                    <p>Vélos :</p>
                    <div className={styles.digitContainer}>
                        <img className={styles.bikeimg} src="/images/bike.png" alt="bike" />
                        <span className={styles.digits_blue}>{station.bikes_count}</span>
                    </div>
                </div>
                <div className={styles.statSep} />
                <div className={styles.statContainer}>
                    <p>Arrivées :</p>
                    <div className={styles.digitContainer}>
                        <img src="/images/downarrow.png" alt="downarrow" />
                        <span className={styles.digits_green}>{station.arrivals_count}</span>
                    </div>
                </div>
                <div className={styles.statSep} />
                <div className={styles.statContainer}>
                    <p>Départs :</p>
                    <div className={styles.digitContainer}>
                        <img src="/images/uparrow.png" alt="uparrow" />
                        <span className={styles.digits_orange}>{station.departures_count}</span>
                    </div>
                </div>
            </div>
            <Link className={styles.cardBottom} href={`/panel/dashboard/${station.id}`}>Accéder</Link>
        </div>
    )
}

export default StationSelection;