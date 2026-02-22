

import '@css/StationsDash.css';
import { useState } from "react";
import {useForm, router} from '@inertiajs/react';

const AddStationForm = ({ onCancel }) => {
    const { data, setData, post, processing, errors } = useForm({
        name:'',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/dashboard/stations', {
            onSuccess: () => onCancel(),
        });
    };

    return (
    
        <form onSubmit={handleSubmit} className="addStationForm">
            <input 
                type="text" 
                placeholder="Nom de la station" 
                value={data.name} 
                onChange={(e) => setData('name', e.target.value)} 
            />
            {errors.name && <p className="error">{errors.name}</p>}
            <button type="submit" disabled={processing}>
                {processing ? "Ajout en cours..." : "Confirmer l'ajout"}</button>
            <button type="button" onClick={onCancel}>Annuler</button>
        </form>
    );
};

const StationCard = ({ station }) => {
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: station.name,
    });

    const handleSave = (e) => {
        e.preventDefault();
        put(`/dashboard/stations/${station.id}`, {
            onSuccess: () => setIsEditing(false),
        });
    };

    const handelDelete = () => {
        if (confirm(`Supprimer la station "${station.name}" ?`)) {
            router.delete(`/dashboard/stations/${station.id}`);
        }
    };
    return (
        <div className="stationsCardDetails">
            {isEditing ? (
                <form onSubmit={handleSave}>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                    {errors.name && <p className='error'>{errors.name}</p>}
                    <div className='button'>
                        <button type='submit' disabled={processing}>
                            {processing ? 'Enregistrement en cours...' : 'Enregistrer'}
                        </button>
                        <button type='button' onClick={() => setIsEditing(false)}>
                            Annuler
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <h3>{station.name}</h3>
                    <p>Créée le : {new Date(station.created_at).toLocaleString('fr-FR')}</p>
                    <p>Modifiée le : {new Date(station.updated_at).toLocaleString('fr-FR')}</p>
                
                    <div className="button">
                                                
                        <button onClick={() => setIsEditing(true)}>Modifier</button>                        
                        <button onClick={handelDelete}>Supprimer</button>
                    </div>                
                </>
            )}
        </div>
    );
};

export default function StationsDash({ stations }){
    
    const [showForm, setShowForm] = useState(false);

    return (
        <>
        <h1>Gestion des stations</h1>

            <button className='btn_add' onClick={() => setShowForm(!showForm)}>
                {showForm ? "Annuler" : "Ajouter une station"}
            </button>

            {showForm && (
                <AddStationForm
                    onCancel={() => setShowForm(false)} />
            )}
            <div className='stations_grid'>
                {stations.length > 0 ? (
                    stations.map((station) => (
                        <StationCard
                            key={station.id}
                            station={station} />
                    ))
                ) : (
                    <p>Aucunne station trouvée</p>
                )}
            </div>
        </>
    );
}