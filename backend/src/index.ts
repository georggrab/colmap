import * as Bodyparser from "body-parser";

import { PropagateEndpoint } from './func/propagate';
import { RegisterEndpoint } from './func/register';
import { GetEndpoint } from './func/get';
import { Endpoint } from './func/core';


// Non typings supported libs:
let express = require("express");
let app = express();

let neo4j = require("neo4j");
let http = require("http").Server(app);
let io = require("socket.io")(http);

let db = new neo4j.GraphDatabase("http://neo4j:admin@localhost:7474");
let route = express.Router();

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
				route.post(url, entry[url].getRoute.bind(entry[url]));
				break;
		}
	}
}

let users = 0;
io.on('connection', (socket) => {
	users++;
	io.sockets.emit('connectioninfo', {
		users: users,
	});
	socket.on('disconnect', () => { 
		users--;
		io.sockets.emit('connectioninfo', {
			users: users,
		});
	})
});

app.use(Bodyparser.json());
app.use('/map', route);

http.listen(3001, () => {
	console.log("Listening on http://127.0.0.1:3001");
});