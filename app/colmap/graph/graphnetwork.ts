interface ITransferOL {
	transfer(): Array<Object>;
	delta()   : Array<Object>;
}

export class CNode<T>{
	constructor (public type : T){

	}
	connections: GraphEdge[] = [];
    data: any;
}

export class Coords {
	getOl() : Array<number> {
		return [this.latitude, this.longitude];
	}
	constructor(public longitude : number, public latitude : number){
	}
}

export class COLConnectionInfo {
	connected : boolean;
	connectedUsers : number;
	connectedServices : number;
	networkHealth : GraphNetworkHealth;
}

export class GraphNetworkHealth {
	nodes : number;
	lastUpdate : number;
}

export class GraphNetworkUpdate {
	nodesUpdated : number;
	additions : GraphEdge[];
	additiveNodes : CNode<Coords>[];
	deletions : GraphEdge[];
	highlight : GraphEdge[];
}

export class GraphEdge {
	constructor(public from : string,
		public to: string,
		public bidirectional: boolean,
		public meta: any){}

	getLineCoords(on : GeoGraphNetwork): Array<Coords>{
		let points = new Array<Coords>();
		points.push(
			on.nodes[this.from].type);
		points.push(
			on.nodes[this.to].type);
		return points;
	}
}


export class GraphNetwork<T> {
	public nodes = {};

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
	public connector(node : string, to : string[], bidirectional : boolean = true){
		if (this.nodes.hasOwnProperty(node)){
			for (let connect of to){
				let g: GraphEdge = new GraphEdge(node, connect, bidirectional, null);
				this.nodes[node].connections.push(g);
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
	}
	public directConnection(node1 : string, node2 : string) : boolean{
		return this.nodes[node1].connections.indexOf(node2) != -1;
	}
}

export class GeoGraphNetwork extends GraphNetwork<Coords> implements ITransferOL {

	search(c: CNode<Coords>, criteria: (c : CNode<Coords>) => boolean) {

	}

	transfer(){
		return new Array<Object>();
	}
	delta (){
		return new Array<Object>();
	}
}
