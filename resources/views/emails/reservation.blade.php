<!DOCTYPE html>
<html>
    <head>
        <title>Confirmation de réservation</title>
    </head>
    <body>
        <p>Bonjour,</p>
        <p>Votre réservation du <strong>{{ \Carbon\Carbon::parse($reservation->start_date)->format('d/m/Y à H:i') }}</strong> au <strong>{{ \Carbon\Carbon::parse($reservation->end_date)->format('d/m/Y à H:i') }}</strong> a bien été enregistrée.</p>
        <a href="{{ route('profile.index') }}" style="display:inline-block; padding:10px 20px; background-color:#28a745; color:white; text-decoration:none; border-radius:5px;">
            Voir ma réservation
        </a>
        <p>L'équipe d'Electro Vélo Station</p>
    </body>
</html>