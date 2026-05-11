import { useForm, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import styles from '@css/confirmationReservation.module.css';
import { Header } from "./home.jsx";
import '@css/app.css';

export default function ConfirmationReservation() {

    useEffect(() => {
                        document.body.setAttribute('data-theme','landing');
                        document.body.classList.add('theme-landing', 'landing');
                        return () => {
                            document.body.removeAttribute('data-theme');
                            document.body.classList.remove('theme-landing', 'landing');
                            document.body.classList.remove('theme-admin', 'admin');
                        };
                    }, []);

    return <>

    <header>
        <title>Merci d'avoir réservé avec EVS</title>
    </header>
    <div className={styles.confirmationPage}><Header />
    <div className={styles.confirmationMessage}>
    <h1>
    Votre réservation a bien été prise en compte ! </h1>
    <button className={styles.btn}><Link href="/">Retour à l'accueil</Link></button>
    <button className={styles.btn}><Link href="/profile">Voir mon profil</Link></button></div></div>
    </>
}