import { useState } from "react";
import {useForm, router} from '@inertiajs/react';

const PersonCard = ({ person }) => {
    const [isEditing, setIsEditing] = useState(false)

    const { data, setData, put, processing, errors } = useForm({
        id : person.id,
        first_name : person.first_name,
		last_name : person.last_name,
		age : person.age,
		required_bike_size : person.required_bike_size,
		user_id : person.user_id,
		created_at : person.created_at,
		updated_at : person.updated_at,
    });

    const handleSave = (e) => {
        e.preventDefault();
        put(`/dashboard/persons/${person.id}`, {
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleDelete = () => {
        if (confirm(`Supprimer la personne "${person.first_name}${person.last_name}" ?`)) {
            router.delete(`/dashboard/persons/${person.id}`);
        }
    };

    return (
        <div className='PersonCardDetails'>
            {isEditing ? (
                <form onSubmit={handleSave}>
                    <input 
                        type="text" 
                        value={data.first_name} 
                        onChange={(e) => setData('first_name',e.target.value)} 
                    />
                    {errors.first_name && <p className='error'>{errors.first_name}</p>}

                    <input 
                        type="text" 
                        value={data.last_name} 
                        onChange={(e) => setData('last_name',e.target.value)} 
                    />
                    {errors.last_name && <p className='error'>{errors.last_name}</p>}

                    <input 
                        type="text" 
                        value={data.age} 
                        onChange={(e) => setData('age',e.target.value)} 
                    />
                    {errors.age && <p className='error'>{errors.age}</p>}

                    <input 
                        type="text" 
                        value={data.required_bike_size} 
                        onChange={(e) => setData('required_bike_size',e.target.value)} 
                    />
                    {errors.required_bike_size && <p className='error'>{errors.required_bike_size}</p>}
                    
                    <div className="buttons">
                        <button type="submit" disabled={processing}>
                            {processing ? "Enregistrement..." : "Enregistrer"}
                        </button>

                        <button type="button" onClick={() => setIsEditing(false)}>
                            Annuler
                        </button>
                    </div>
                </form>
            ) : (
            <>
                    <h1>{person.first_name} {person.last_name}</h1>
                    <p>Age : {person.age}</p>
                    <p>Taille vélo : {person.required_bike_size}</p>

                    <div className="buttons">
                        <button onClick={() => setIsEditing(true)}>
                            Modifier
                        </button>

                        <button onClick={handleDelete}>
                            Supprimer
                        </button>
                    </div>
                </>
        )}
        </div>
    );
}




export default function PersonDashboard({ person }) {
    return(
        <div>
            <PersonCard 
                key={person.id}
                person={person}
            />
    </div>
    )
}