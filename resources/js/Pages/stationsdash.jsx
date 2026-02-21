

import '@css/StationsDash.css';
import { useState, useForm } from "react";

/* WIP - Attente CRUD stations
function FormAddStation(){
    const { data, setData, post, processing, errors} = useForm({
        name:'',
        created_at:'',
        updated_at:'',
    })
    let texteBoutons;
    if (processing) {
        texteBoutons = 'Ajout en cours...';
    } else {
        texteBoutons = 'Créer une station';
    }

    function submit(e) {
        e.preventDefault();
        post('')
    }
} */


const AddStationForm = ({ onAdd, onCancel }) => {
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return;

        const newStation = {
            id: Date.now(), // Placeholder
            name: name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        onAdd(newStation);
        setName("");
    };

    return (
        
        


        <form onSubmit={handleSubmit} className="addStationForm">
            <input 
                type="text" 
                placeholder="Nom de la station" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
            <button type="submit">Confirmer l'ajout</button>
            <button type="button" onClick={onCancel}>Annuler</button>
        </form>
    );
};

const StationDetails = (props) => {
    const [name, setName] = useState(props.name);
    const [updatedAt, setUpdatedAt] = useState(props.updated_at);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        const currentDate = new Date().toISOString();
        setUpdatedAt(currentDate);

        setIsEditing(false);
    };

    
    return (
        <div className="stationsCardDetails">
            {isEditing ? (
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                />
            ) : (
                <h2>{name}</h2>
            )}
            
            <p>Créée le : {new Date(props.created_at).toLocaleString('fr-FR')}</p>
            <p>Edité le : {new Date(updatedAt).toLocaleString('fr-FR')}</p>
            <div className="button">
                {isEditing ? (
                    <button onClick={handleSave}>Enregistrer</button>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Modifier</button>
                )}
                <button onClick={props.onDelete}>Supprimer la station</button>
            </div>
        </div>
    );
};



export default function StationsDash (){
    
    const [showForm, setShowForm] = useState(false);
    const [stations, setStations] = useState([ // Palceholder
        {
            id:5,
            name:"Olson Prairie Station",
            created_at:"2026-02-17T15:29:05.000000Z",
            updated_at:"2026-02-17T15:29:05.000000Z",
        
        },
        
        {
            id:1,
            name:"Eino Plains Station",
            created_at:"2026-02-17T15:29:05.000000Z",
            updated_at:"2026-02-17T15:29:05.000000Z",
        
        }
    ]);

    const deleteStationDetails = (id) => {
        const updatedStations = stations.filter(station => station.id !== id);
        setStations(updatedStations);
    }

    const addStation = (newStation) => {
        setStations([...stations, newStation]);
        setShowForm(false);
    };

    return (
        <>
        <h1>Gestion des stations</h1>
        
            {showForm ? (
                <AddStationForm
                    onAdd={addStation}
                    onCancel={() => setShowForm(false)} />
            ) : (
                <button onClick={() => setShowForm(true)}>Ajouter une station</button>
            )}
            <button id='back' onClick={() => window.location.href = '/dashboard'}>Dashboard</button>
            <div className="stationsList">
            <div className='stationDetails'>
                {stations.map(station => (
                    <StationDetails
                        key={station.id}
                        {...station}
                        onDelete={() => deleteStationDetails(station.id)} />
                ))}
            </div>
        </div>
        </>
    );
}