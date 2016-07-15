import { Component, Input, Pipe } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { MaterialTemplate } from './../../material';
import { MapComponent } from './../../map.component';

@Pipe({ name : 'toIterable' }) export class ToIterable {
	transform(dict : Object) : Array<Object> {
		var a = [];
		for (let key in dict){
			if (dict.hasOwnProperty(key)){
				a.push({key : key, val : dict[key]});
			}
		}
		return a;
	}
}

@Pipe({ name: 'toConnections'}) export class ToConnections {
	transform(node : Object) : Array<Object> {
		if (node && node.hasOwnProperty("connections")){
			return node["connections"];
		} else {
			return [];
		}
	}
}

@Component({
	selector: 'tooltip',
	templateUrl: 'app/colmap/ui/tooltip.component.html',
	pipes : [ToIterable, ToConnections]
})
export class ToolTip extends MaterialTemplate {
	private _display:Object;
	public show : boolean = false;
	public left : number;
	public top : number;
	public underlyingNode;

	@Input() public map; 

	@Input()
	set display(display : any){
		this._display = display;
		if ( display && this.map) {
			let coords = display.getGeometry().getCoordinates();
			let pixel = this.map.getPixelFromCoordinate(coords);

			// -64px: Header.
			this.left = pixel[0], this.top = pixel[1];
			if (window.innerWidth > 1020){
				this.top -= 64;
			}

			let cnode = display.get("DataLink");
			if (cnode){
				this.underlyingNode = cnode;
			}

			this.show = true;
		}

	}

	constructor(){
		super();
	}

}