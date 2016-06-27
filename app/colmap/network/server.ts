import { Injectable } from '@angular/core';
import { GeoGraphNetwork, CNode, Coords } from '../graph/graphnetwork';

export class COLConnectionInfo {
	connected : boolean;
	connectedUsers : number;
	connectedServices : number;
	graphnetwork : GraphNetworkHealth;
}

export class GraphNetworkHealth {
	nodes : number;
}

export class GraphNetworkUpdate {
	nodesUpdated : number;
	additions : GraphEdge[];
	deletions : GraphEdge[];
	highlight : GraphEdge[];
}

export class GraphEdge {
	from : string;
	to : string;
	bidirectional : boolean;
	meta : any;
}

@Injectable()
export class BackendService {
	connect(endpoint : string) : COLConnectionInfo {
		return <COLConnectionInfo> {
			connected : true,
			connectedUsers : 5,
			connectedServices : 1,
			graphnetwork : <GraphNetworkHealth> {
				nodes: 4
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
}