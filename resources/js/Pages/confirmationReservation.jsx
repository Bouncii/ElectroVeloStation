import { useForm, Link } from '@inertiajs/react';
import styles from '@css/confirmationReservation.module.css';
import { Header } from "./home.jsx";
import '@css/app.css';

export default function ConfirmationReservation() {


    return <><div className={styles.confirmationPage}><Header />
    <div className={styles.confirmationMessage}>
    <h1>
    Votre réservation a bien été prise en compte ! </h1>
    <button className={styles.btn}><Link href="/">Retour à l'accueil</Link></button>
    <button className={styles.btn}><Link href="/profile">Voir mon profil</Link></button></div></div>
    </>
}