import { useState, useEffect } from "react";
import {useForm, router, Link} from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import styles from '@css/gestionStations.module.css';
import '@css/app.css';

const AddStationForm = ({ onCancel }) => {
    const { data, setData, post, processing, errors } = useForm({
        name:'',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/panel/stations', {
            onSuccess: () => onCancel(),
        });
    };

    return (
    
        <form onSubmit={handleSubmit} className={styles.addStationForm}>
            <input 
                type="text" 
                placeholder="Nom de la station" 
                value={data.name} 
                onChange={(e) => setData('name', e.target.value)} 
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
            <button type="submit" disabled={processing}>
                {processing ? "Ajout en cours..." : "Confirmer l'ajout"}</button>
            <button type="button" onClick={onCancel}>Annuler</button>
        </form>
    );
};

const StationCard = ({ station }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showHours, setShowHours] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: station.name,
    });

    const handleSave = (e) => {
        e.preventDefault();
        put(`/panel/stations/${station.id}`, {
            onSuccess: () => setIsEditing(false),
        });
    };

    const handelDelete = () => {
        if (confirm(`Supprimer la station "${station.name}" ?`)) {
            router.delete(`/panel/stations/${station.id}`);
        }
    };
    return (
        <div className={styles.stationsCardDetails}>
            {isEditing ? (
                <form onSubmit={handleSave}>
                    <input 
                        type="text" 
                        value={data.name} 
                        onChange={(e) => setData('name',e.target.value)} 
                    />
                    {errors.name && <p className={styles.error}>{errors.name}</p>}
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
                    <h3>{station.name}</h3>
                    <p>Créée le : {new Date(station.created_at).toLocaleString('fr-FR')}</p>
                    <p>Modifiée le : {new Date(station.updated_at).toLocaleString('fr-FR')}</p>
                
                    <div className={styles.button}>
                                                
                        <button onClick={() => setIsEditing(true)}>Modifier</button>   
                        <button onClick={() => setShowHours(!showHours)}>{showHours ? "Masquer horaires" : "Voir horaires"}</button>
                        <button onClick={handelDelete}>Supprimer</button>
                    </div>
                    {showHours && (
                        <div className={styles.schedules_section}>
                            <h4>Horaires d'ouverture</h4>
                            {station.schedules && station.schedules.length > 0 ? (
                                station.schedules.map(schedule => <ScheduleRow key={schedule.id} schedule={schedule} />)
                            ) : (
                                <p>Aucun horaire généré.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const ScheduleRow = ({ schedule }) => {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi","Dimanche"];

    const { flash } = usePage().props;

    const { data, setData, put, processing, recentlySuccessful } = useForm({
        open_time: schedule.open_time,
        close_time: schedule.close_time,
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/panel/schedules/${schedule.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <form onSubmit={handleUpdate} className={styles.schedule_row}>
                <span className={styles.day_label}>{days[schedule.day_of_week]}</span>
                <input 
                    type="time" 
                    value={data.open_time} 
                    onChange={e => setData('open_time', e.target.value)} 
                />
                <span>à</span>
                <input 
                    type="time" 
                    value={data.close_time} 
                    onChange={e => setData('close_time', e.target.value)} 
                />
                <button type="submit" disabled={processing}>
                    {processing ? "..." : "enregistrer"}
                </button>
            </form>
            {recentlySuccessful && flash.success && (<p className={styles.success_text_mini}>{flash.success}</p>)}
        </>
    );
};




export default function gestionStations({ stations }){
    
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        document.body.setAttribute('data-theme','admin');
        document.body.classList.add('theme-admin', 'admin');
        return () => {
            document.body.removeAttribute('data-theme');
            document.body.classList.remove('theme-admin', 'admin');
            document.body.classList.remove('theme-landing', 'landing');
        };
    },
    []);
    return (
        <> 
        <div className={styles.nav}>
        <Link href="/" className={styles.back}>Accueil</Link>
        <Link href="/panel" className={styles.back}>Panel</Link>
        </div> 
        <h1>Gestion des stations</h1>

            <button className={styles.btn_add} onClick={() => setShowForm(!showForm)}>
                {showForm ? "Annuler" : "Ajouter une station"}
            </button>

            {showForm && (
                <AddStationForm
                    onCancel={() => setShowForm(false)} />
            )}
            <div className={styles.stations_grid}>
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