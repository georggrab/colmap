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
	constructor(private router: Router){
		super();
	}
	ngOnInit(){
		this.mapID = Math.random().toString(16).slice(2);
	}

	toMap(mapID : string){
		// TODO warum funktioniert router.navigate nicht?
		location.href = "/map/" + mapID;
	}
}