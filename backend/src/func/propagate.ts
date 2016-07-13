import { Endpoint } from './core';
import { Utils } from '../util/utils';
import * as Exp from 'express';

/* Propagate API:
TODO update funktionen?
TODO rmNode return value, anzahl affected nodes?

POST /map/<id>/propagate
{
    "addNode" : [
            {
                "ip":"222.222.222.222", "x":123.3,"y":444.4
            },
            {
                "ip":"232.232.232.232", "x":123.3,"y":444.4
            }
        ],
    "addEdge" : [
        [35,20],[20,35]
    ],
    "rmNode" : [21]
}
Rückgabe:
(in der reihenfolge des input JSON:)
	-	pro element in addNode:
			[ {"ID(n)" : <<neue id in neo4j>> }]
	-	pro relation in addEdge:
			[ <CNode>, <CNode> ]
	-	pro element in rmNode: void

highlight funktionen erzeugen keine rückgabe, 
da die ergebnisse sofort gepusht werden.

*/

export class PropagateEndpoint implements Endpoint {
	private db;
	private io; 

	constructor(options){
		this.db = options.database;	
		this.io = options.socket;
	}

	getRoute(req: Exp.Request, res: Exp.Response){
		/* propagate ist Haupteinstiegspunkt in die COLMAP Api für Services.
           CRUD operationen sind definiert.
           Änderungen werden via socket.io direkt an die User gepusht, und, falls
           nötig, in der neo4j Graphdatenbank ergänzt.
		*/
		let btc = [];
		let iopushs = [];

		if (req.body["highlightNode"]){
			// (CNode)[] -> socket.io push to connected users
			iopushs.push({highlightNode : req.body.highlightNode});

		} if (req.body["highlightEdge"]){
			// (CNode, CNode)[] -> socket.io push to connected users
			iopushs.push({highlightEdge : req.body.highlightEdge});

		} if (req.body["addNode"]){
			// (CNode)[] -> neo4j graph addition; socket.io push to connected users
			// Todo fail gracefully
			for (let node of req.body.addNode){
				if (!Utils.defined(node, ["ip", "x", "y"])) return;
				btc.push({
					query: `CREATE (n:CNode{
						ip: {ip}, x: {x}, y: {y}}) RETURN ID(n)`,
					params: {
						ip: node.ip, x: node.x, y: node.y }
				});
			}
			iopushs.push({addNode : req.body.addNode});
			// returns (_nodeid)

		} if (req.body["addEdge"]){
			// (CNode, CNode)[] -> neo4j graph addition; socket.io push to connected users
			for (let nodes of req.body.addEdge){
				console.log(nodes);
				btc.push({
					query: `MATCH (r0:CNode), (r1:CNode) WHERE ID(r0)={firstnode} AND ID(r1)={secondnode}
						CREATE (r0)-[:HYPERLINKS]->(r1) RETURN r0,r1`,
					params: {
						"firstnode" : nodes[0], "secondnode" : nodes[1]
					}
				});
			}
			iopushs.push({addEdge : req.body.addEdge});
			// returns (CNODE, CNODE)

		} if (req.body["rmNode"]){
			// (CNode)
			for (let nodeid of req.body.rmNode){
				btc.push({
					query: `Start n=node({id}) OPTIONAL MATCH (n)-[rel]-() DELETE rel, n`,
					params : {
						id : nodeid
					}
				});
			}
			iopushs.push({rmNode : req.body.rmNode});
		}
		
		let streams = this.db.cypher({queries : btc}, (err, results) => {
			console.log("Finished propagating: " + err);
			res.json(results);
		});

		this.io.sockets.emit("networkupdate", iopushs);

	}
	getMethod() : string {
		return "POST";
	}
}