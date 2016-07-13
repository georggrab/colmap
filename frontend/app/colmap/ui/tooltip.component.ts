import { Component, Input } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { MaterialTemplate } from './../../material';
import { MapComponent } from './../../map.component';

@Component({
	selector: 'tooltip',
	templateUrl: 'app/colmap/ui/tooltip.component.html'
})
export class ToolTip extends MaterialTemplate {
	private _display:Object;

	@Input()
	set display(display : Object){
		console.log("Tooltip got something!");
		this._display = display;
	}

	constructor(){
		super();
	}

}