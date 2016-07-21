import { Component } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { MaterialTemplate } from './material';
import { MapComponent } from './map.component';

@Component({
	selector: 'create',
	templateUrl: 'app/create.component.html'
})
export class CreateComponent extends MaterialTemplate {
	mapID: string;
	hl: any;

	constructor(private router: Router){
		super();
		this.hl = require("highlightjs");
	}
	ngOnInit(){
		this.mapID = Math.random().toString(16).slice(2);
	}
	ngAfterViewInit(){
		let code = document.getElementById("apicode");
		this.hl.highlightBlock(code);
	}

	toMap(mapID : string){
		location.href = "/map/" + mapID;
	}
}