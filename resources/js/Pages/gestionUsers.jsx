import '@css/gestionUsers.css';
import { useState } from "react";
import {useForm, router, Link} from '@inertiajs/react';

const AddUserForm = ({ onCancel}) => {
    const { data, setData, post, processing, errors } = useForm({
        first_name:'',
        last_name:'',
        email:'',
        password:'',
        role:'client',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/dashboard/users', {
            onSuccess: () => onCancel(),
        });
    };
        return(

            <form onSubmit={handleSubmit} className='addUserForm'>
                <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} placeholder="Prénom" />
                {errors.first_name && <div>{errors.first_name}</div>}

                <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} placeholder="Nom" />
                
                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="Email" />
                {errors.email && <div>{errors.email}</div>}

                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="Mot de passe" />

                <select value={data.role} onChange={e => setData('role', e.target.value)}>
                    <option value="client">Client</option>
                    <option value="employee">Employé</option>
                    <option value="admin">Admin</option>
                </select>

                <button type="submit" disabled={processing}>
                    {processing ? "Chargement..." : "Créer l'utilisateur"}
                </button>
            </form>
        );
    };

const UserCard = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);

    const {data, setData, put, processing, errors } = useForm({
        first_name : user.first_name,
        last_name : user.last_name,
        email : user.email,
        role : user.role,
    });

    const handleSave = (e) => {
        e.preventDefault();
        put(`/dashboard/users/${user.id}`, {
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleDelete = () => {
        if (confirm(`Supprimer l'utilisateur' "${user.first_name}${user.last_name}" ?`)) {
            router.delete(`/dashboard/users/${user.id}`);
        }
    };

    return (
        <div className='usersCardDetails'>
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
                        value={data.email} 
                        onChange={(e) => setData('email',e.target.value)} 
                    />
                    {errors.email && <p className='error'>{errors.email}</p>}
                    
                    <select
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                    >
                        <option value="client">Client</option>
                        <option value="employee">Employé</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className='error'>{errors.role}</p>}
                    
                    
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
                <h3>{user.first_name} {user.last_name}</h3>
                <p>{user.age}</p>
                <p>{user.email}</p>
                <p>{user.role}</p>
                <p>Personnes associées :</p>

                {user.people && user.people.length > 0 ? (
                    <ul>
                        {user.people.map(person => (
                            <li key={person.id}>
                                <Link href={`/dashboard/persons/${person.id}`} className="personLink">
                                    {person.first_name} {person.last_name} ({person.age} ans)
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune personne</p>
                )}
            <div className="button">
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


export default function gestionUsers({ users}){

    const [showForm, setShowForm] = useState(false);

    return(
    <>
    <button className='btn_add' onClick={() => setShowForm(!showForm)}>
                {showForm ? "Annuler" : "Ajouter un user"}
            </button>

    {showForm && (
                <AddUserForm
                    onCancel={() => setShowForm(false)} />
            )}

    <div className='users_grid'>
        {users.length > 0 ? (
            users.map((user) => (
                <UserCard 
                    key={user.id}
                    user={user}
                />
            ))
        ) : (
            <p>Pas d'user trouvé</p>
        )}
    </div>
    </>)

};