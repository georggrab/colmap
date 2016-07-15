import { Endpoint } from './core';
import { Utils } from '../util/utils';
import * as Exp from 'express';

export class RegisterEndpoint implements Endpoint {
	private db;

	constructor(options){
		this.db = options.database;	
	}

	generateAccessKey() : string{
		// Courtesy of:
		// http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
		return Math.random().toString(36).substr(2, 5);
	}

	getRoute(req: Exp.Request, res: Exp.Response){
		// Todo fail gracefully
		if (!Utils.defined(req.body, ["trigger", "type"])) return;

		let key = this.generateAccessKey();

		this.db.cypher({
			query : "CREATE (n:Service{trigger: {trg}, type: {typ}, key : {key}})",
			params : {
				trg : req.body.trigger,
				typ : req.body.type,
				key : key
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