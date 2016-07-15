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
![logo](https://raw.githubusercontent.com/talkdirty/colmap/master/assets/colmap.png)

Die Daten werden als Knoten auf einem Graphen angezeigt. Der Knoten selbst kann nähere Daten über die Information enthalten. Falls Relationen zwischen Knoten existieren, können diese ebenfalls angezeigt werden.

### Graphnetzwerk
![logo](https://raw.githubusercontent.com/talkdirty/colmap/master/assets/colmap-graph.png)

Daten können auch völlig entkoppelt von einer Karte - also auf einem rohen Graphen - angezeigt werden, falls es bei der Information nicht um die Geographische Lage geht. 

### Elemente hinzufügen
Todo hier über REST API und insbesondere propagate() labern
Hier verschiedene capabilities von propagate() auflisten.. addNode, addEdge, highlightEdge, removeNode, removeEdge,...
Bla bli blub Socket.io und so..

## Services
### Externe Services und Serviceauthentifizierung
TODO Bla bla, register, kriegst API Key, kannsch propagate() benutzen

### Self-Servicing
TODO Client=Service, gleiches Prinzip, wird an alle diggers gepusht und in neo4j geupdated

## Technische Details
### Frontend
TODO Material Design Lite, Angular 2, Socket.IO, OpenLayers 3, Typescript, SCSS, GraphNetwork services, Jasmine Tests

### Backend
TODO NodeJS, Neo4J, Socket.IO Server

### Hosting
TODO CoreOS Cluster, Jede Karte ein CoreOS Knoten bestehend aus Frontend Backend und Neo4J Instanz