import { Endpoint } from './core';
import * as Exp from 'express';


export class GetEndpoint implements Endpoint {
	private db;

	constructor(options){
		this.db = options.database;	
	}

	getRoute(req: Exp.Request, res: Exp.Response){
		this.db.cypher({
			query : "MATCH (n) RETURN n"
		}, (err, results) => {
			if (err) throw err;
			res.json(results);
		});
	}

	getMethod() : string {
		return "GET";
	}
}