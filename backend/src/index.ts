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

class Backend {
	db = new neo4j.GraphDatabase("http://neo4j:admin@localhost:7474");
	route = express.Router();

	registerEndpoint 	= new RegisterEndpoint({ database : this.db });
	propagateEndpoint 	= new PropagateEndpoint({ database : this.db, socket: io });
	getEndpoint 		= new GetEndpoint({ database : this.db });

	routeMap = [
		{"/:id/register"	: this.registerEndpoint		}
	  , {"/:id/propagate"	: this.propagateEndpoint	}
	  , {"/:id/get"			: this.getEndpoint			}
	];

	users = 0;
	beginSocketServe(){
		io.on('connection', (socket) => {
			this.users++;
			io.sockets.emit('connectioninfo', {
				users: this.users,
			});
			socket.on('wantNetwork', () => {
				this.getEndpoint.get((network) => {
					socket.emit('getNetwork', network);
				});
			});
			socket.on('disconnect', () => { 
				this.users--;
				io.sockets.emit('connectioninfo', {
					users: this.users,
				});
			})
		});

	}

	getRoute() : any {
		for (let entry of this.routeMap){
			for (let url in entry){
				switch (entry[url].getMethod()){
					case "GET":
						this.route.get(url, entry[url].getRoute.bind(entry[url]));
						break;

					case "POST":
						this.route.post(url, entry[url].getRoute.bind(entry[url]));
						break;
				}
			}
		}

		return this.route;

	}

}


(function main(){
	let b : Backend = new Backend();
	b.beginSocketServe();

	app.use(Bodyparser.json());
	app.use('/map', b.getRoute());

	http.listen(3001, () => {
		console.log("Listening on http://127.0.0.1:3001");
	});

	process.on('uncaughtException', (err) => {
		console.warn("Something terrible happened! Exception:");
		console.warn(err);
		console.warn("Attempting to recover from Error...");
		return main();
	});
})();
