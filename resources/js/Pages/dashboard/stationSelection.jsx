import { Link } from '@inertiajs/react';
import '@css/dashboard/stationSelection.css';

function StationSelection({ stations }) {
    return (
        <>
            <h1>Veuillez choisir une station : </h1>
            <Link href="/" className="back">Accueil</Link>
            <Link href="/panel" className="back">Panel</Link>
            <div id='stationCardsContainer'> 
                {stations.map((station) => (
                    <StationCard key={station.id} station={station} />
                ))}
            </div>
        </>
    );
}

function StationCard({ station }) {
    return (
        <div className="cards">
            <div className='cardTop'><h3>{station.name}</h3></div>
            <div className='cardMiddle'>
                <div className='statContainer'>
                    <p>Vélos :</p>
                    <div className='digitContainer'>
                        <img  id='bikeimg' src="/images/bike.png" alt="bike" />
                        <span className='digits blue'>{station.bikes_count}</span>
                    </div>
                </div>
                <div className='statContainer'>
                    <p>Arrivées :</p>
                    <div className='digitContainer'>
                        <img src="/images/downarrow.png" alt="downarrow" />
                        <span className='digits green'>{station.arrivals_count}</span>
                    </div>
                </div>
                <div className='statContainer'>
                    <p>Départs :</p>
                    <div className='digitContainer'>
                        <img src="/images/uparrow.png" alt="uparrow" />
                        <span className='digits orange'>{station.departures_count}</span>
                    </div>
                </div>
            </div>
            <Link className='cardBottom' href={`/dashboard/stations/${station.id}`}>Accéder</Link>
        </div>
    )
}

export default StationSelection;