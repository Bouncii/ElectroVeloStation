<!DOCTYPE html>
<html>
    <head>
        <title>Mise à jour de votre réservation</title>
    </head>
    <body>
        <h1>Information concernant votre réservation</h1>
        <p>Bonjour,</p>
        <p>En raison d'une opération de maintenance imprévue sur notre flotte, nous avons dû retirer de la circulation des vélos qui vous étaient initialement destinés à la station <strong>{{ $reservation->station->name }}</strong>.</p>
        <p>Par conséquent, votre réservation du <strong>{{ \Carbon\Carbon::parse($reservation->start_date)->format('d/m/Y à H:i') }}</strong> au <strong>{{ \Carbon\Carbon::parse($reservation->end_date)->format('d/m/Y à H:i') }}</strong> a été temporairement replacée <strong>en liste d'attente</strong>.</p>
        <p><strong>Ne vous inquiétez pas !</strong> Notre système recherche activement de nouveaux vélos pour couvrir votre demande. Dès que de nouveaux vélos seront rapatriés ou rendus disponibles à votre station, vous recevrez immédiatement une nouvelle proposition par e-mail.</p>
        <a href="{{ route('profile.index') }}" style="display:inline-block; padding:10px 20px; background-color:#f0ad4e; color:white; text-decoration:none; border-radius:5px;">
            Consulter le statut de ma réservation
        </a>
        <p><em>Nous vous prions de nous excuser pour ce désagrément et vous remercions de votre patience.</em></p>
        <p>L'équipe d'Electro Vélo Station</p>
    </body>
</html>