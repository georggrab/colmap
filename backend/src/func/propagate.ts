import { Endpoint } from './core';
import * as Exp from 'express';

export class PropagateEndpoint implements Endpoint {
	private db;

	constructor(options){
		this.db = options.database;	
	}

	getRoute(req: Exp.Request, res: Exp.Response){

	}
	getMethod() : string {
		return "GET";
	}
}