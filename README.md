# Games

Kleine browsergames. Open `index.html` voor het overzicht.

## Structuur

```
index.html                     landingspagina met alle games
games/<naam>/index.html        één map per game
```

## Een game toevoegen

1. Zet de game in `games/<naam>/index.html`. Een link `../../` (class `home`) brengt je terug naar het overzicht; geef die `position:relative;z-index:5` zodat hij boven de pop-ups blijft.
2. Voeg een regel toe aan de lijst `GAMES` in `index.html` (titel, link, beschrijving, thumbnail, optioneel de `localStorage`-sleutel van het record).

## Versie

Het versienummer staat in `version.js` en wordt onderaan de landingspagina en op het startscherm van elke game getoond.
Verhoog het bij elke wijziging met:

```
tools/bump-version.sh 2.3
```

Dat zet de versie ook in de verwijzing naar `version.js` in elke pagina. Elke pagina kijkt bij het openen of er online
een nieuwere versie staat en laadt die dan meteen, zodat telefoons niet op een oude kopie blijven hangen.
Een nieuwe game laadt `version.js` dus met `<script src="../../version.js?v=…"></script>`.

`version.js` zet ook dubbeltik-zoom uit, omdat iPhones `user-scalable=no` negeren: een snelle tweede tik annuleert
Safari's zoom en stuurt zelf de klik door, zodat de tik gewoon telt. In de games is ook knijp-zoom geblokkeerd.
Elke pagina die `version.js` laadt, krijgt dat vanzelf.

Geluid: `version.js` zet een knop "Geluid aan/uit" op het start- en eindscherm (`.overlay .panel`) van elke game,
en koppelt elk `<button class="sndbtn">` (het luidsprekertje rechtsboven) zodat je ook tijdens het spelen kunt wisselen.
De toets M wisselt ook. De keuze geldt voor alle games. Laat een nieuwe game in zijn geluidsfunctie eerst
`if(window.SITE_SOUND&&!SITE_SOUND.on)return;` doen.
