

import '@css/gestionStations.css';
import { useState } from "react";
import {useForm, router, Link} from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

export default function gestionReservations({ reservations }){
    

    return (
        {reservations}
    );
}