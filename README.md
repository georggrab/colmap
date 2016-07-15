# COLMAP - Collaborative Mapping platform

## Einleitung
Hey! 
COLMAP ist mein Projekt für die Vorlesung Webengineering I an der DHBW Stuttgart.

## Zweck
Das Projekt ist im weiten Sinne von sog. Internet Pads inspiriert, in denen verschiedene anonyme User gemeinsam Dokumente editieren können. Ein bekanntes Pad ist bspw: [piratenpad.de](https://www.piratenpad.de/).
Das selbe Prinzip (verschiedene User können anonym zusammenkommen und gemeinsam an etwas arbeiten) findet auch hier Anwendung - nur in einem Geographischen Kontext.

## Wie?
Das Projekt ist bewusst sehr generell gehalten - es wird von COLMAP nicht näher spezifiziert, was genau an einer Karte angezeigt werden soll. Das übernimmt der Benutzer selbst.

### GeoGraphnetzwerk
[logo]: https://raw.githubusercontent.com/talkdirty/colmap/master/assets/colmap.png "Colmap"
Die Daten werden als Knoten auf einem Graphen angezeigt. Der Knoten selbst kann nähere Daten über die Information enthalten. Falls Relationen zwischen Knoten existieren, können diese ebenfalls angezeigt werden.

### Graphnetzwerk
[logo]: https://raw.githubusercontent.com/talkdirty/colmap/master/assets/colmap-graph.png "Colmap Graph"
Daten können auch völlig entkoppelt von einer Karte - also auf einem rohen Graphen - angezeigt werden, falls es bei der Information nicht um die Geographische Lage geht. 