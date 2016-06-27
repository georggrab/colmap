interface ITransferOL {
	transfer(): Array<Object>;
	delta()   : Array<Object>;
}

export class CNode<T>{
	constructor (private type : T){

	}
	connections: CNode<T>[] = [];
    data: any;
}

export class Coords {
	constructor(private longitude : number, private latitude : number){

	}
}

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


export class GraphNetwork<T> {
	protected nodes = {};

	public add(label : string, c: CNode<T>) : CNode<T>{
		this.nodes[label] = c;
		return c;
	}
	public connector(node : string, to : string[], bidirectional : boolean = true){
		if (this.nodes.hasOwnProperty(node)){
			for (let connect of to){
				this.nodes[node].connections.push(connect);
				if (bidirectional){
					if (this.nodes.hasOwnProperty(connect)){
						this.nodes[connect].connections.push(node);
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
