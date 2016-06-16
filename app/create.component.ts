import { Component } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { MaterialTemplate } from './material';
import { MapComponent } from './map.component';

@Component({
	selector: 'create',
	template: `
		<h1>COLMAP</h1>
		<p>Anonymous, collaborative geographic intelligence platform</p>
		<form action="#">
		<div class="mdl-textfield mdl-js-textfield">
		<input value="{{mapID}}" class="mdl-textfield__input" type="text" id="sample1">
		<label class="mdl-textfield__label" for="sample1">Text...</label>
		</div>
		<button (click)="toMap(mapID)" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
		create
		</button>
		</form>
	`
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