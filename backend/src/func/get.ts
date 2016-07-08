import { Endpoint } from './core';
import * as Exp from 'express';


export class GetEndpoint implements Endpoint {
	private db;

	constructor(options){
		this.db = options.database;	
	}

	get(callback) : void {
		this.db.cypher({
			query : "OPTIONAL MATCH (n:CNode)-[r:HYPERLINKS]-(m:CNode) RETURN n,r,m"
		}, (err, results) => {
			if (err) throw err;
			callback(results);
		});

	}

	getRoute(req: Exp.Request, res: Exp.Response){
		this.get((result) => res.json(result));
	}

	getMethod() : string {
		return "GET";
	}
}