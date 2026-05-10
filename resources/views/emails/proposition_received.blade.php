<!DOCTYPE html>
<html>
    <head>
        <title>Proposition de Vélos</title>
    </head>
    <body>
        <h1>Bonne nouvelle !</h1>
        <p>Bonjour,</p>
        <p>Nous avons le plaisir de vous annoncer que nous avons trouvé des vélos correspondant à votre demande pour la station <strong>{{ $reservation->station->name }}</strong>.</p>
        <p>Votre réservation du <strong>{{ \Carbon\Carbon::parse($reservation->start_date)->format('d/m/Y à H:i') }}</strong> au <strong>{{ \Carbon\Carbon::parse($reservation->end_date)->format('d/m/Y à H:i') }}</strong> peut maintenant être confirmée.</p>
        <p>Vous avez reçu une proposition d'attribution. Merci de vous connecter ou d'accéder à votre profil pour l'accepter ou la refuser.</p>
        <a href="{{ route('profile.index') }}" style="display:inline-block; padding:10px 20px; background-color:#28a745; color:white; text-decoration:none; border-radius:5px;">
            Voir ma proposition
        </a>
        <p><em>Attention : cette proposition expire dans 24 heures.</em></p>
        <p>L'équipe d'Electro Vélo Station</p>
    </body>
</html>