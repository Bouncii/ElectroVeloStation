import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import '@css/reservation.css';
import { Header } from "../Pages/home.jsx";

export default function Reservation({ 
    schedules = [], // Horaires des stations récupérés depuis le backend
    peopleDb = [], // Cyclistes enregistrés dans la base de données
    allStations = [] // Liste de toutes les stations récupérée depuis le backend
 }) {

    const { errors, flash } = usePage().props;

    // -----------------------------
    // STATE RESERVATION
    // -----------------------------

    const [reservation, setReservation] = useState({
        pickup_station_id: "",
        return_station_id: "",
        dateDebut: "",
        dateFin: "",
        heureDebut: "",
        heureFin: "",
        start_date: "",
        end_date: ""
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
        }
    };



    // -----------------------------
    // SCHEDULE STATION
    // -----------------------------

    const scheduleStation = schedules.find(
        s => s.station_id == reservation.pickup_station_id
    );



    // -----------------------------
    // STATION DEPART
    // -----------------------------

    // const pickup_station_id = allStations.find(
    //     s => s.id == reservation.pickup_station_id
    // );



    // -----------------------------
    // VERIFICATION STOCK
    // -----------------------------

    // const stockDisponible = () => {

    //     if(!pickup_station_id) return false;

    //     return people.length <= pickup_station_id.bike_stock;

    // };



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
            pickup_station_id: reservation.pickup_station_id,
            return_station_id: reservation.return_station_id,
            start_date: `${reservation.dateDebut} ${reservation.heureDebut}:00`,
            end_date: `${reservation.dateFin} ${reservation.heureFin}:00`,
            attributions: people,
        });
    };



    return (

        <>
        <div className="reservationPage">
        <header>
            <Header/>
        </header>


        <div className="messages-container" style={{ margin: "20px auto", maxWidth: "800px", textAlign: "center" }}>
            
            {flash?.success && (
                <div className="success">
                    {flash.success}
                </div>
            )}
            {errors?.error && (
                <div className="failure">
                    {errors.error}
                </div>
            )}
        </div>

        <h1>Réserver un vélo</h1>

        <div className="infoReservation">


        {/* ------------------ */}
        {/* FORM RESERVATION */}
        {/* ------------------ */}

        <div className="champ">

        <h3>Choix de la réservation</h3>

        <label>Station départ</label>

        <select
        name="pickup_station_id"
        value={reservation.pickup_station_id}
        onChange={handleReservationChange}
        >

        <option value="">Choisir</option>

        {allStations.map(station => (

            <option key={station.id} value={station.id}>
                {station.name}
            </option>

        ))}

        </select>


        <label>Station arrivée</label>

        <select
        name="return_station_id"
        value={reservation.return_station_id}
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
        onChange={handleReservationChange}
        />



        <label>Date fin</label>

        <input
        type="date"
        name="dateFin"
        min={reservation.dateDebut}
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
        onChange={handleReservationChange}
        />

        </div>

    

        {/* ------------------ */}
        {/* PEOPLE */}
        {/* ------------------ */}

        {people.map((person,index)=>(

        <div key={index} className="champ">

        <h3>Cycliste {index+1}</h3>


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
        <button id="bAjout"onClick={addPerson}>
        ➕ Ajouter un cycliste
        </button>
        



        {/* ------------------ */}
        {/* FOOTER */}
        {/* ------------------ */}

        <footer className="champ">

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