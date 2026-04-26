import { useForm, Link } from '@inertiajs/react';
import styles from '@css/confirmationReservation.module.css';
import { Header } from "./home.jsx";
import '@css/app.css';

export default function ConfirmationReservation() {


    return <>Votre réservation a bien été prise en compte ! 
    <button><Link href="/">Retour à l'accueil</Link></button>
    <button><Link href="/profile">Voir mon profil</Link></button>
    </>
}