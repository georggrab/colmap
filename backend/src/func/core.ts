import * as Exp from "express";

export interface Endpoint {
	getRoute: (req:Exp.Request, res:Exp.Response) => void;
	getMethod : () => string;
}