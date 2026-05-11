import { useState, useEffect } from "react"
import { Link } from '@inertiajs/react';
import styles from "@css/dashboard/stationSelection.module.css";
import '@css/app.css';

// Permet d'afficher les stations avec les bonnes infos.
// Prend toutes les infos de toutes les stations.
function StationSelection({ stations }) {
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
    return (
    <>
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
                    // Component qui affiche la station
                    <StationCard key={station.id} station={station} />
                ))}
            </div>   
        </section>
    </>
    );
}

// Component qui gère l'affichage d'UNE station
// Prend les infos de ladite station en paramètre
function StationCard({ station }) {
    return (
        <div className={styles.cards}>
            <div className={styles.cardTop}><h3>{station.name}</h3></div>
            <div className={styles.cardMiddle}>
                <div className={styles.statContainer}>
                    <p>Vélos :</p>
                    <div className={styles.digitContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#3b70aa" fillRule="evenodd" d="m35.745 12.17l-4.925 1.48l3.28 8.578a8 8 0 1 1-1.868.715l-1.648-4.31l-5.682 11.802A1 1 0 0 1 24 31h-4.062A8.001 8.001 0 0 1 4 30a8 8 0 0 1 15.938-1h2.5l-4.88-13.664A1 1 0 0 1 17.5 15H16a1 1 0 1 1 0-2h4.5a1 1 0 1 1 0 2h-.938l1.842 5.157l8.127-4.277l-.965-2.523a1 1 0 0 1 .647-1.315l5.957-1.787zm-13.662 9.89l1.972 5.52l4.23-8.784zm12.983 8.297l-2.113-5.527a6 6 0 1 0 1.868-.715l2.113 5.528a1 1 0 0 1-1.868.714M17.917 29H12a1 1 0 1 0 0 2h5.917A6.002 6.002 0 0 1 6 30a6 6 0 0 1 11.917-1" clipRule="evenodd"/></svg>
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