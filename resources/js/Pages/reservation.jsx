import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Header } from "../Pages/home.jsx";
import styles from '@css/reservation.module.css';
import '@css/app.css';

export default function Reservation({ 
    schedules = [], // Horaires des stations récupérés depuis le backend
    peopleDb = [], // Cyclistes enregistrés dans la base de données
    allStations = [] // Liste de toutes les stations récupérée depuis le backend
 }) {

    const { errors, flash, auth } = usePage().props;

    // -----------------------------
    // STATE RESERVATION
    // -----------------------------

    const [reservation, setReservation] = useState({
        station_id: "",
        dateDebut: "",
        dateFin: "",
        heureDebut: "",
        heureFin: "",
        start_date: "",
        end_date: "",
        email: auth?.user?.email || ""
    });

    // -----------------------------
    // STATE PEOPLE
    // -----------------------------

    const [people, setPeople] = useState([
        { nom:"", prenom:"", age:"", taille:"" }
    ]);



    // -----------------------------
    // CHANGE RESERVATION
    // -----------------------------

    const handleReservationChange = (e) => {
        if(e.target.name === "heureDebut" || e.target.name === "heureFin" ){
            if(e.target.value < e.target.min || e.target.value > e.target.max){
                e.target.value = "";
            }
        }
        setReservation({
            ...reservation,
            [e.target.name]: e.target.value
        });

    };



    // -----------------------------
    // CHANGE PEOPLE
    // -----------------------------

    const handlePeopleChange = (index, e) => {
        const newPeople = [...people];
        newPeople[index] = { 
            ...newPeople[index], 
            [e.target.name]: e.target.value 
        };
        setPeople(newPeople);
    };



    // -----------------------------
    // ADD PERSON
    // -----------------------------

    const addPerson = () => {

        setPeople([
            ...people,
            { nom:"", prenom:"", age:"", taille:"" }
        ]);

    };



    // -----------------------------
    // REMOVE PERSON
    // -----------------------------

    const removePerson = (index) => {

        const newPeople = people.filter((_,i)=> i!==index);

        setPeople(newPeople);

    };



    // -----------------------------
    // SELECT EXISTING PERSON
    // -----------------------------

    const selectExistingPerson = (index, id) => {

        const person = peopleDb.find(p => p.id == id);

        if(person){

            const newPeople = [...people];

            newPeople[index] = {
                id: person.id,
                nom: person.last_name,
                prenom: person.first_name,
                age: person.age,
                taille: person.required_bike_size
            };
            setPeople(newPeople);
        } else if (id == 0) {
            const newPeople = [...people];

            newPeople[index] = {
                nom: "",
                prenom: "",
                age: "",
                taille: ""
            }
            setPeople(newPeople);
        }
    };



    // -----------------------------
    // SCHEDULE STATION
    // -----------------------------

    const scheduleStation = schedules.find(
        s => s.station_id == reservation.station_id
    );



    // -----------------------------
    // CALCUL DUREE
    // -----------------------------

    const calculDuree = () => {

        if(!reservation.dateDebut || !reservation.dateFin || !reservation.heureDebut || !reservation.heureFin)
            return 0;

        const debut = new Date(`${reservation.dateDebut}T${reservation.heureDebut}`);
        const fin = new Date(`${reservation.dateFin}T${reservation.heureFin}`);

        const diff = fin - debut;

        if(diff <= 0) return 0;

        return Math.floor(diff / (1000*60*60));
    };



    // -----------------------------
    // CALCUL PRIX
    // -----------------------------

    const calculPrix = () => {

        const heures = calculDuree();

        const tarifHoraire = 5;
        const tarifJournalier = 20;

        let prix = 0;

        if(heures >= 24){

            const jours = Math.floor(heures/24);
            const reste = heures % 24;

            prix += jours * tarifJournalier;
            prix += reste * tarifHoraire;

        }
        else{

            prix += heures * tarifHoraire;

        }

        return prix * people.length;

    };



    // -----------------------------
    // SUBMIT RESERVATION
    // -----------------------------

    const handleSubmit = () => {
        router.post("/reservation", {
            station_id: reservation.station_id,
            start_date: `${reservation.dateDebut} ${reservation.heureDebut}:00`,
            end_date: `${reservation.dateFin} ${reservation.heureFin}:00`,
            email: reservation.email,
            attributions: people,
        });
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (

        <>
        <div className={styles.reservationPage}>
        <header>
            <Header/>
        </header>


        <div className={styles.messagesContainer} style={{ margin: "20px auto", maxWidth: "800px", textAlign: "center" }}>
            
            {flash?.success && (
                <div className={styles.success}>
                    {flash.success}
                </div>
            )}
            {errors?.error && (
                <div className={styles.failure}>
                    {errors.error}
                </div>
            )}
        </div>

        <h1>Réserver un vélo</h1>

        <div className={styles.infoReservation}>


        {/* ------------------ */}
        {/* FORM RESERVATION */}
        {/* ------------------ */}

        <div className={styles.reservationContainer}>
            

        <h3>Choix de la réservation</h3>
        <div className={styles.infosResaGlobal}>
        <div className={styles.infosResa1}>
        <label>Station</label>

        <select
        name="station_id"
        value={reservation.station_id}
        onChange={handleReservationChange}
        >

        <option value="">Choisir</option>

        {allStations.map(station => (

            <option key={station.id} value={station.id}>
                {station.name}
            </option>

        ))}

        </select>



        <label>Date début</label>

        <input
        type="date"
        name="dateDebut"
        min={minDate}
        value={reservation.dateDebut}
        onChange={handleReservationChange}
        />



        <label>Heure début</label>

        <input
        type="time"
        name="heureDebut"
        min={scheduleStation?.open_time}
        max={scheduleStation?.close_time}
        value={reservation.heureDebut}
        step={"1800"}
        onChange={handleReservationChange}
        />
        </div>
        <div className={styles.infosResa2}>

        <label>Date fin</label>

        <input
        type="date"
        name="dateFin"
        min={reservation.dateDebut || minDate}
        value={reservation.dateFin}
        onChange={handleReservationChange}
        />



        <label>Heure fin</label>

        <input
        type="time"
        name="heureFin"
        min={scheduleStation?.open_time}
        max={scheduleStation?.close_time}
        value={reservation.heureFin}
        step={"1800"}
        onChange={handleReservationChange}
        />


        <label>Adresse mail du responsable</label>
        <input
            type="email"
            name="email"
            value={reservation.email}
            onChange={handleReservationChange}
        />
        {errors?.email && <div style={{color: 'red', fontSize: '12px'}}>{errors.email}</div>}

        </div>
        </div>
        </div>
    

        {/* ------------------ */}
        {/* PEOPLE */}
        {/* ------------------ */}

        {people.map((person,index)=>(

        <div key={index} className={styles.userInfoContainer}>

        <h3>Cycliste {index+1}</h3>

        {auth?.user && (
            <>

                <label>Cycliste enregistré</label>

                <select
                onChange={(e)=>selectExistingPerson(index,e.target.value)}
                >

                <option value="">Nouveau</option>

                {peopleDb.map(p=>(
                    <option key={p.id} value={p.id}>
                        {p.first_name} {p.last_name}
                    </option>
                ))}

                </select>
            </>
        )}

        <label>Nom</label>

        <input
        name="nom"
        value={person.nom}
        onChange={(e)=>handlePeopleChange(index,e)}
        />


        <label>Prénom</label>

        <input
        name="prenom"
        value={person.prenom}
        onChange={(e)=>handlePeopleChange(index,e)}
        />


        <label>Age</label>

        <input
        type="number"
        name="age"
        value={person.age}
        onChange={(e)=>handlePeopleChange(index,e)}
        />


        <label>Taille</label>

        <input
        type="number"
        name="taille"
        value={person.taille}
        onChange={(e)=>handlePeopleChange(index,e)}
        />

        {index>0 && (

        <button onClick={()=>removePerson(index)}>
        ❌ Supprimer
        </button>

        )}

        </div>

        ))}


</div>
        <button className={styles.bAjout} onClick={addPerson}>
        ➕ Ajouter un cycliste
        </button>
        



        {/* ------------------ */}
        {/* FOOTER */}
        {/* ------------------ */}

        <footer className={styles.champ}>

        <p>Nombre de vélos : {people.length}</p>

        <p>Durée : {calculDuree()} heure(s)</p>

        <p>Prix total : {calculPrix()} €</p>


        {/*{!stockDisponible() &&

        <p style={{color:"red"}}>
        Pas assez de vélos disponibles
        </p>

        }*/}


        <button onClick={handleSubmit}>
        Confirmer la réservation
        </button>

        </footer>

        </div>

        </>
    );
}