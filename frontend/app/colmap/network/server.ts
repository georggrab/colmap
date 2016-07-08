import { Injectable } from '@angular/core';
import { GeoGraphNetwork, CNode, Coords,
	COLConnectionInfo, GraphNetworkHealth,
	GraphNetworkUpdate, GraphEdge
	} from '../graph/graphnetwork';

import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class BackendService {
	conn : any;

	connect(endpoint : string) : Observable<COLConnectionInfo> {
		this.conn = io.connect('http://127.0.0.1:3001');

		this.conn.on('connect', () => {
			console.log("Socket.IO: Connected to server!");
		})

		return Observable.create((observer) => {
			this.conn.on('connect', () => {
				observer.next(<COLConnectionInfo> {
					connected : true
				});	
			});
			
			this.conn.on('connectioninfo', (things) => {
				observer.next(<COLConnectionInfo> {
					connected : true,
					connectedUsers : things.users
				});
			});
		});
	}

	downloadNetwork() : Observable<GeoGraphNetwork> {
		return Observable.create((observer) => {
			// TODO Stub for Network things!	
			setTimeout(() => {
				let g = new GeoGraphNetwork();

				g.add("Berlin", new CNode<Coords>(new Coords(52.5062185,12.8647592)));
				g.add("Stuttgart", new CNode<Coords>(new Coords(48.7791242,9.0371341)));
				g.add("London", new CNode<Coords>(new Coords(51.528308,-0.3817701)));
				g.add("NY", new CNode<Coords>(new Coords(43.9957508,-72.7008926)));

				g.connector("London", ["Berlin"], false);
				g.connector("NY", ["London"]);
				g.connector("London", ["Stuttgart"]);

				observer.next(g);

			} , 400);
		});
	}

	retrieveDelta(since : number) : GraphNetworkUpdate {
		return <GraphNetworkUpdate> {
			nodesUpdated: 3,
			additiveNodes : [{"SanFrancisco" : new CNode<Coords>(new Coords(37.543589,-123.1674184))}],
			additions: [
				new GraphEdge("NY", "SanFrancisco", true, null),
				new GraphEdge("NY", "Stuttgart", false, null)
			],
			deletions: [
				<GraphEdge> {
					from: "London", to : "Berlin"
				}
			],
			highlight: [
				<GraphEdge> {
					from: "London", to: "Stuttgart"
				}
			]
		}
	}
}

