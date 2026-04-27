import { useState } from "react";
import {useForm, router, Link, usePage} from '@inertiajs/react';
import styles from '@css/gestionUsers.module.css';
import '@css/app.css';

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
        post('/panel/users', {
            onSuccess: () => onCancel(),
        });
    };
        return(

            <form onSubmit={handleSubmit} className={styles.AddUserForm}>
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
    const [showPersons, setShowPersons] = useState(false);

    const {data, setData, put, processing, errors } = useForm({
        first_name : user.first_name,
        last_name : user.last_name,
        email : user.email,
        role : user.role,
    });

    const handleSave = (e) => {
        e.preventDefault();
        put(`/panel/users/${user.id}`, {
            onSuccess: () => setIsEditing(false),
        });
    };

    const handleDelete = () => {
        if (confirm(`Supprimer l'utilisateur' "${user.first_name}${user.last_name}" ?`)) {
            router.delete(`/panel/users/${user.id}`);
        }
    };

    return (
        <div className={styles.usersCardDetails}>
            {isEditing ? (
                <form onSubmit={handleSave}>
                    <input 
                        type="text" 
                        value={data.first_name} 
                        onChange={(e) => setData('first_name',e.target.value)} 
                    />
                    {errors.first_name && <p className={styles.error}>{errors.first_name}</p>}

                    <input 
                        type="text" 
                        value={data.last_name} 
                        onChange={(e) => setData('last_name',e.target.value)} 
                    />
                    {errors.last_name && <p className={styles.error}>{errors.last_name}</p>}

                    <input 
                        type="text" 
                        value={data.email} 
                        onChange={(e) => setData('email',e.target.value)} 
                    />
                    {errors.email && <p className={styles.error}>{errors.email}</p>}
                    
                    <select
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                    >
                        <option value="client">Client</option>
                        <option value="employee">Employé</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className={styles.error}>{errors.role}</p>}
                    
                    
                    <div className={styles.button}>
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
                                {person.first_name} {person.last_name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Aucune personne associée</p>
                )}
            <div className={styles.button}>
                        <button onClick={() => setIsEditing(true)}>
                            Modifier
                        </button>
                        <button onClick={() => setShowPersons(!showPersons)}>
                            {showPersons ? "Masquer les personnes" : "Voir les personnes"}
                        </button>
                        <button onClick={handleDelete}>
                            Supprimer
                        </button>
                    </div>
                    {showPersons && (
                        <div className={styles.persons_section}>
                            {user.people && user.people.length > 0 ? (
                                user.people.map(person => 
                                <PersonRow 
                                    key={person.id} 
                                    person={person}
                                />)
                            ) : (
                                <p>Auccune personne associée</p>
                            )}
                        </div>
                    )}

                </>
            )}

        </div>
    );
}

const PersonRow = ({ person }) => {

    
    const {data, setData, put, processing, errors} = useForm({
        first_name: person.first_name,
        last_name: person.last_name,
        age: person.age,
        required_bike_size: person.required_bike_size,
    });
    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/panel/persons/${person.id}`, {
            preserveScroll: true,
        });
    };

    const handleDelete = (e) => {
        e.preventDefault();
        if (confirm(`Supprimer la personne "${person.first_name} ${person.last_name}" ?`)) {
            router.delete(`/panel/persons/${person.id}`);
        }
    };

    return (
        <>
            <form onSubmit={handleUpdate} className={styles.person_row}>
                <input type="text" 
                    value={data.first_name}
                    onChange={e => setData('first_name', e.target.value)}
                />
                {errors.first_name && <div style={{color: 'red', fontSize: '12px'}}>{errors.first_name}</div>}

                <input type="text" 
                    value={data.last_name}
                    onChange={e => setData('last_name', e.target.value)}
                />
                {errors.last_name && <div style={{color: 'red', fontSize: '12px'}}>{errors.last_name}</div>}
                
                <input type="number" 
                    value={data.age}
                    onChange={e => setData('age', e.target.value)}
                />
                {errors.age && <div style={{color: 'red', fontSize: '12px'}}>{errors.age}</div>}
                
                <input type="number" 
                    value={data.required_bike_size}
                    onChange={e => setData('required_bike_size', e.target.value)}
                />
                {errors.required_bike_size && <div style={{color: 'red', fontSize: '12px'}}>{errors.required_bike_size}</div>}

                <button type="submit" disabled={processing}>
                    {processing ? "..." : "enregistrer"}
                </button>
            </form>
            <button onClick={handleDelete}>
                            Supprimer
            </button>
        </>
    )
}

export default function GestionUsers({ users}){

    const [showForm, setShowForm] = useState(false);

    return(
    <>
    <div className={styles.nav}>
            <Link href="/" className={styles.back}>Accueil</Link>
            <Link href="/panel" className={styles.back}>Panel</Link>
            </div>
    <button className={styles.btn_add} onClick={() => setShowForm(!showForm)}>
                {showForm ? "Annuler" : "Ajouter un user"}
            </button>

    {showForm && (
                <AddUserForm
                    onCancel={() => setShowForm(false)} />
            )}

    <div className={styles.users_grid}>
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