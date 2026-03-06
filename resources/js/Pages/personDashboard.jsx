export default function PersonDashboard({ person }) {
    return (
        <div>
            <h1>{person.first_name} {person.last_name}</h1>
            <p>Age : {person.age}</p>
            <p>Taille vélo : {person.required_bike_size}</p>
        </div>
    );
}