import { Component, Input, Pipe } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { MaterialTemplate } from './../../material';
import { MapComponent } from './../../map.component';

@Pipe({ name : "toCard" }) export class ToCard {
	transform(map : Map<string, Object>) : Array<Object>{
		let ret = [];
		if (!map) { 
			return [];
		}
		map.forEach((value : Object) => { 
			ret.push(value); 
		})
		console.log(ret);
		return ret;
	}
}

@Component({
	selector: 'servicecards',
	templateUrl: 'app/colmap/ui/servicecards.component.html',
	pipes : [ToCard]
}) export class ServiceCards extends MaterialTemplate {
	private __services : Map<string, Object>;
	@Input() set services(services: Map<string, Object>){
		this.__services = services;
	}

	delete(serviceid : string){
		this.__services.delete(serviceid);
	}

	constructor() { super(); }
}
