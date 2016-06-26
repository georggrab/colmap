import { Component, Inject, provide } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

// Application Components that have a Route
import { MapComponent } from './map.component';
import { CreateComponent } from './create.component';

// Storage Devices for Preferences
import { PerferenceService, CStorage } from './colmap/state/preferences';
import { LocalStorage } from './colmap/state/storage/localstorage';

@Component({
	selector: 'colmap-root',
	template: `
		<router-outlet></router-outlet>
	`,
	directives: [ROUTER_DIRECTIVES],
	providers: [
		ROUTER_PROVIDERS,
		PerferenceService,
		provide("StorageDevice", {useClass : LocalStorage})
		
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
