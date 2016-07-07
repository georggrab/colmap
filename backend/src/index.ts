import * as Exp from "express";
import * as Server from "http";

import * as Bodyparser from "body-parser";

import { PropagateEndpoint } from './func/propagate';
import { RegisterEndpoint } from './func/register';
import { GetEndpoint } from './func/get';
import { Endpoint } from './func/core';

let app : Exp.Express = Exp();
let route = Exp.Router();

let routeMap = [
	{"/:id/register" 	: 	new RegisterEndpoint()}
  , {"/:id/propagate"	:	new PropagateEndpoint()}
  , {"/:id/get"			:	new GetEndpoint()}
];

for (let entry of routeMap){
	for (let url in entry){
		switch (entry[url].getMethod()){
			case "GET":
				route.get(url, entry[url].getRoute);
				break;
				
			case "POST":
				route.post(url, entry[url].getRoute);
				break;
		}
	}
}

app.use('/map', route);
Server.createServer(app).listen(3001);