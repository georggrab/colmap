import { Endpoint } from './core';
import * as Exp from 'express';


export class GetEndpoint implements Endpoint {
	private db;

	constructor(options){
		this.db = options.database;	
	}

	get(callback) : void {
		this.db.cypher({
			//query : "MATCH (n:CNode)-[r:HYPERLINKS*0..]-(m:CNode) RETURN n,r,m"
			query : `MATCH (n:CNode)-[r:HYPERLINKS]-() RETURN n,r`
		}, (err, results) => {
			if (err) throw err;
			debugger;
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