import { Endpoint } from './core';
import { Utils } from '../util/utils';
import * as Exp from 'express';

export class RegisterEndpoint implements Endpoint {
	private db;

	constructor(options){
		this.db = options.database;	
	}

	getRoute(req: Exp.Request, res: Exp.Response){
		// Todo fail gracefully
		if (!Utils.defined(req.body, ["trigger", "type"])) return;

		this.db.cypher({
			query : "CREATE (n:Service{trigger: {trg}, type: {typ}})",
			params : {
				trg : req.body.trigger,
				typ : req.body.type
			}
		}, (err, results) => {
			if (err) throw err;
			res.json(results);
		});
	}
	
	getMethod() : string {
		return "POST";
	}
}