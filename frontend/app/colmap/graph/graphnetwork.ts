import {Coordinate} from 'openlayers';

interface ITransferOL {
	transfer(): Array<Object>;
	delta()   : Array<Object>;
}

export class CNode<T>{
	constructor (public __parentNetwork : GraphNetwork<T>,
		public type : T){
	}
	connections: GraphEdge[] = [];
    data: any;
}

export class Host {
	constructor (private host : string) { }
	toString() : string {
		return `<a target="_blank" 
			href="https://who.is/whois-ip/ip-address/${this.host}">
				whois://${this.host}
			</a>`;
	}
}

export class Coords {
	toString() : string {
		/* toString() wird beim anzeigen der internen Knoteninformationen benutzt.
		daher wird hier ein link zu gmaps ausgegeben (requirement von Dozenten)
		*/
		// http://stackoverflow.com/questions/6582834/use-a-url-to-link-to-a-google-map-with-a-marker-on-it
		// TODO external gmaps zoom level könnte ein setting sein
		return `<a target="_blank" href="http://maps.google.com/maps/place/${this.latitude}+${this.longitude}/
				@${this.latitude},${this.longitude},8z">
				Coords<[${this.latitude}, ${this.longitude}]>
			</a>`;
	}

	getOl(mapFunc?:any) : Coordinate {
		let things = [this.latitude, this.longitude];
		if (mapFunc !== undefined) things = mapFunc(things);
		return things;
	}
	constructor(public longitude : number, public latitude : number){
	}
}

export class COLConnectionInfo {
	connected : boolean;
	connectedUsers : number;
	connectedServices : number;
	allServices : Map<string, Object>;
	networkHealth : GraphNetworkHealth;
}

export class GraphNetworkHealth {
	nodes : number;
	lastUpdate : number;
}

export class GraphNetworkUpdate {
	nodesUpdated : number;
	additions : GraphEdge[];
	additiveNodes : { [key:string]:CNode<Coords> }[];
	deletions : GraphEdge[];
	highlight : GraphEdge[];
}

export class GraphEdge {
	view : any;

	toString() : string {
		return `[${this.from}]-[${this.to}]`;
	}

	constructor(public from : string,
		public to: string,
		public bidirectional: boolean,
		public meta: any){}

	getLineCoords(on : GeoGraphNetwork, mapFunc?): Coordinate[]{
		let coords : Coordinate[] = [
			on.nodes[this.from].type.getOl(), 
			on.nodes[this.to].type.getOl()
		]
		if (mapFunc !== undefined) {
			for (let coord in coords){
				coords[coord] = mapFunc(coords[coord]);
			}
		}
		return coords;
	}

	attachView(f : any){
		this.view = f;
	}

	getView(){
		return this.view;
	}
}


export class GraphNetwork<T> {
	public nodes = {};

	public edgeExists(e : GraphEdge) : boolean {
		return this.findEdge(e) !== null;
	}

	// Todo this type shall be a intermediate one:
	// findEdge(e: GraphEdgeCriteria) : Maybe GraphEdge
	public findEdge(e: GraphEdge){
		let edgeStartNode = this.nodes[e.from];
		for (let connection of edgeStartNode.connections){
			if (connection.to == e.to) return connection;
		}
		return null;
	}

	public nodeExists(name : string) : boolean {
		return this.nodes.hasOwnProperty(name);
	}

	public nodeIterator(iterator : (node : CNode<T>, key?: string, n? : number) => void, after? : () => void) : void {
		// replace this with smartass graph traversal function
		let n = 0;
		for (var key in this.nodes){
			iterator(this.nodes[key], key, n);
			n++;
		}
		after();
	}

	public add(label : string, c: CNode<T>) : CNode<T>{
		this.nodes[label] = c;
		return c;
	}
	public connector(node : string, to : string[], bidirectional : boolean = true) : GraphEdge {
		let lastAddedEdge : GraphEdge;
		if (this.nodes.hasOwnProperty(node)){
			for (let connect of to){
				for (let connection of this.nodes[node].connections){
					if (connection.to == connect){
						console.log("Warning: Edge already exists! Ignoring this.");
						return;
					}
				}


				lastAddedEdge = new GraphEdge(node, connect, bidirectional, null);
				this.nodes[node].connections.push(lastAddedEdge);

				// TODO i'm not happy with this. Somehow, there must be a O(1) link between
				// both directions of the GraphEdge. Cross Referencing properties maybe.
				if (bidirectional){
					if (this.nodes.hasOwnProperty(connect)){
						// TODO Minimal spannender Baum?
						let g_obsolete : GraphEdge = new GraphEdge(connect, node, bidirectional, null);
						this.nodes[connect].connections.push(g_obsolete);
					} else {
						throw `No such node in Network: ${connect} (while connecting to: ${node})`;
					}
				}
			}
		} else {
			throw `No such node in Network: ${node}`;
		}
		return lastAddedEdge;
	}
	public directConnection(node1 : string, node2 : string) : boolean{
		return this.nodes[node1].connections.indexOf(node2) != -1;
	}
}

export class GeoGraphNetwork extends GraphNetwork<Coords> implements ITransferOL {

	constructFrom(socketObject : Array<any>){
		for (let genericNode of socketObject){
			if (genericNode.n.labels.length < 1) {
				console.log("Warning: node has no labels:");
				console.log(genericNode);
				continue;
			}
			switch (genericNode.n.labels[0]) {
				case "CNode" : 
					let node = new CNode<Coords>(this,
						new Coords(genericNode.n.properties.x, genericNode.n.properties.y));
					node["<id>"] = genericNode.n._id;
					node["<host>"] = new Host(genericNode.n.properties.ip);
					this.add(genericNode.n._id, node);
					break;
				case "Service":
					break;
				case "User":
					break;
			}
		}
		for (let node of socketObject){
			//for (let relationship of node.r){
				if (node.r){
					this.connector(node.r._fromId, [node.r._toId], false);
				}
			//}
		}
		return;
	}

	transfer(){
		return new Array<Object>();
	}
	delta (){
		return new Array<Object>();
	}
}
