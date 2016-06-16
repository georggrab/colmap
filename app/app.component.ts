import { Component } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';
import { MapComponent } from './map.component';
import { CreateComponent } from './create.component';

@Component({
	selector: 'colmap-root',
	template: `
		<router-outlet></router-outlet>
	`,
	directives: [ROUTER_DIRECTIVES],
	providers: [
		ROUTER_PROVIDERS,
	]
}) @RouteConfig([ {
		path: '/create',
		name: "Create",
		useAsDefault: true,
		component: CreateComponent
	}, {
		path: '/map/:mapid',
		name: 'Map',
		component: MapComponent
	}
]) export class AppComponent {
}
