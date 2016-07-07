import * as Exp from "express";
import * as Server from "http";

import * as Bodyparser from "body-parser";

import { PropagateEndpoint } from './func/propagate';
import { RegisterEndpoint } from './func/register';
import { GetEndpoint } from './func/get';
import { Endpoint } from './func/core';

let neo4j = require("neo4j");
let db = new neo4j.GraphDatabase("http://neo4j:admin@localhost:7474");

let app : Exp.Express = Exp();
let route = Exp.Router();

let routeMap = [
	{"/:id/register" 	: 	new RegisterEndpoint({
		database : db
	})}
  , {"/:id/propagate"	:	new PropagateEndpoint({
  		database : db
  	})}
  , {"/:id/get"			:	new GetEndpoint({
  		database : db
  	})}
];

for (let entry of routeMap){
	for (let url in entry){
		switch (entry[url].getMethod()){
			case "GET":
				route.get(url, entry[url].getRoute.bind(entry[url]));
				break;

			case "POST":
				route.post(url, entry[url].getRoute);
				break;
		}
	}
}

app.use('/map', route);
Server.createServer(app).listen(3001);