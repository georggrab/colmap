import { Injectable } from '@angular/core';
import { GeoGraphNetwork, CNode, Coords,
	COLConnectionInfo, GraphNetworkHealth,
	GraphNetworkUpdate, GraphEdge
	} from '../graph/graphnetwork';

@Injectable()
export class BackendService {
	connect(endpoint : string) : COLConnectionInfo {
		return <COLConnectionInfo> {
			connected : true,
			connectedUsers : 5,
			connectedServices : 1,
			graphnetwork : <GraphNetworkHealth> {
				nodes: 4,
				lastUpdate : 2222222222
			}
		};
	}

	downloadNetwork() : GeoGraphNetwork {
		let g = new GeoGraphNetwork();

		g.add("node1", new CNode<Coords>(new Coords(123,321)));
		g.add("node2", new CNode<Coords>(new Coords(123,123)));
		g.add("node3", new CNode<Coords>(new Coords(456,789)));
		g.add("node4", new CNode<Coords>(new Coords(975,451)));

		g.connector("node1", ["node2", "node3"], false);
		g.connector("node4", ["node3"]);

		return g;
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