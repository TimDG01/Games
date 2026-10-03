# Games

Kleine browsergames. Open `index.html` voor het overzicht.

## Structuur

```
index.html                     landingspagina met alle games
games/<naam>/index.html        één map per game
```

## Een game toevoegen

1. Zet de game in `games/<naam>/index.html`. Een link `../../` brengt je terug naar het overzicht.
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

`version.js` zet ook dubbeltik-zoom uit (`touch-action: manipulation`) en blokkeert knijp-zoom in de games,
omdat iPhones `user-scalable=no` negeren. Elke pagina die `version.js` laadt, krijgt dat vanzelf.
