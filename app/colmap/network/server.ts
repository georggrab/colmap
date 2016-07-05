import { Injectable } from '@angular/core';
import { GeoGraphNetwork, CNode, Coords,
	COLConnectionInfo, GraphNetworkHealth,
	GraphNetworkUpdate, GraphEdge
	} from '../graph/graphnetwork';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class BackendService {
	connect(endpoint : string) : Observable<COLConnectionInfo> {
		return Observable.create((observer) => {
			// TODO Stub for Network things!
			setTimeout(() => {
				let c = <COLConnectionInfo> {
					connected : true,
					connectedUsers : 5,
					connectedServices : 1,
					networkHealth : <GraphNetworkHealth> {
						nodes: 4,
						lastUpdate : 2222222222
					}
				};
				observer.next(c);
			} , 1000);
		});
	}

	downloadNetwork() : Observable<GeoGraphNetwork> {
		return Observable.create((observer) => {
			// TODO Stub for Network things!	
			setTimeout(() => {
				let g = new GeoGraphNetwork();

				g.add("NY", new CNode<Coords>(new Coords(52.5062185,12.8647592)));
				g.add("Berlin", new CNode<Coords>(new Coords(48.7791242,9.0371341)));
				g.add("London", new CNode<Coords>(new Coords(51.528308,-0.3817701)));
				g.add("Stuttgart", new CNode<Coords>(new Coords(43.9957508,-72.7008926)));

				g.connector("London", ["Berlin"], false);
				g.connector("NY", ["London"]);
				g.connector("London", ["Stuttgart"]);

				observer.next(g);

			} , 2000);
		});
	}

	retrieveDelta(since : number) : GraphNetworkUpdate {
		return <GraphNetworkUpdate> {
			nodesUpdated: 3,
			additions: [
				<GraphEdge> {
					from: "node1", to : "node4", bidirectional : true
				}
			],
			deletions: [
				<GraphEdge> {
					from: "node1", to : "node2"
				}
			],
			highlight: [
				<GraphEdge> {
					from: "node4", to: "node3"
				}
			]
		}
	}
}

