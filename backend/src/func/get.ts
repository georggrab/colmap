import { Endpoint } from './core';
import * as Exp from 'express';



export class GetEndpoint implements Endpoint {
	getRoute(req: Exp.Request, res: Exp.Response){
		res.json({ohai : "stub"});
	}

	getMethod() : string {
		return "GET";
	}
}