import { Injectable } from '@angular/core';
import { GeoGraphNetwork, CNode, Coords,
	COLConnectionInfo, GraphNetworkHealth,
	GraphNetworkUpdate, GraphEdge
	} from '../graph/graphnetwork';

import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class BackendService {
	conn : any;
	serviceMap : Map<string, Object> = new Map<string, Object>();


	connect(endpoint : string) : Observable<COLConnectionInfo> {
		this.conn = io.connect('http://127.0.0.1:3001');

		this.conn.on('connect', () => {
			console.log("Socket.IO: Connected to server!");
		})

		return Observable.create((observer) => {
			this.conn.on('connect', () => {
				observer.next(<COLConnectionInfo> {
					connected : true
				});	
			});

			this.conn.on('connectioninfo', (things) => {
				observer.next(<COLConnectionInfo> {
					connectedUsers : things.users
				});
			});

			this.conn.on('servicepropagating', (serviceInfo) => {
				console.log(serviceInfo);
				this.serviceMap.set(serviceInfo.s._id, serviceInfo.s);
				observer.next(<COLConnectionInfo> {
					connectedServices : this.serviceMap.size,
					allServices : this.serviceMap
				})
			})
		});
	}

	downloadNetwork() : Observable<GeoGraphNetwork> {
		this.conn.emit('wantNetwork');
		return Observable.create((observer) => {
			this.conn.on('getNetwork', (network) => {
				let g = new GeoGraphNetwork();
				g.constructFrom(network);

				observer.next(g);
			});
		});
	}

	activateDelta(since : number) : Observable<GraphNetworkUpdate> {
		return Observable.create((observer) => {
			this.conn.on('networkupdate', (update) => {
				let nodesUpdated = 0, additiveNodes = [], additions = [], deletions = [], highlight = [];
				for (let entry of update) {
					for (let updateType in entry){
						switch(updateType){
							case "addNode": 
								for (let el of entry[updateType]){
									let node = {};
									node[el.ip] = new CNode<Coords>(new Coords(el.x,el.y));
									additiveNodes.push(node);
								}
							break;
							case "highlightNode":
								// todo highlightnode
							break;
							case "highlightEdge":
								for (let el of entry[updateType]){
									highlight.push(<GraphEdge> {from : el[0], to: el[1]});
								}	
							break;
							case "addEdge":
								for (let el of entry[updateType]){
									additions.push(new GraphEdge(el[0], el[1], false, null));
								}

							break;
							case "rmNode":
							//rmNode not yet implemented!
								/*for (let el of entry[updateType]){
							//todo bug in here
									console.log("in rmNode");
									console.log(el);
									deletions.push(<GraphEdge> { from : el[0], to: el[1]});
								}*/
							break;
						}
					}
				}
				observer.next(<GraphNetworkUpdate> {
					additiveNodes : additiveNodes, nodesUpdated: nodesUpdated,
					additions:additions, deletions:deletions, highlight:highlight });
			});
		});
		/*return <GraphNetworkUpdate> {
			nodesUpdated: 3,
			additiveNodes : [{"SanFrancisco" : new CNode<Coords>(new Coords(37.543589,-123.1674184))}],
			additions: [
				new GraphEdge("NY", "SanFrancisco", true, null),
				new GraphEdge("NY", "Stuttgart", false, null)
			],
			deletions: [
				<GraphEdge> {
					from: "London", to : "Berlin"
				}
			],
			highlight: [
				<GraphEdge> {
					from: "London", to: "Stuttgart"
				}
			]
		}*/
	}
}

