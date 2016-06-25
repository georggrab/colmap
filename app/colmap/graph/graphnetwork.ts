interface ITransferOL {
	transfer(): Array<Object>;
	delta()   : Array<Object>;
}

class CNode<T>{
	connections: CNode<T>[];
    label : string;
    type: T;
    data: any;
}

class Coords {
	constructor(private longitude : number, private latitude : number){

	}
}

class GraphNetwork<T> {
	nodes: CNode<T>[];
}

export class GeoGraphNetwork extends GraphNetwork<Coords> implements ITransferOL {
	add(c: CNode<Coords>){

	}

	search(c: CNode<Coords>, criteria: (c : CNode<Coords>) => boolean) {

	}

	transfer(){
		return new Array<Object>();
	}
	delta (){
		return new Array<Object>();
	}
}
