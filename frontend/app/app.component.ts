import { Component, Inject, provide } from '@angular/core';
import { RouteConfig, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

// Application Components that have a Route
import { MapComponent } from './map.component';
import { CreateComponent } from './create.component';

// Storage Devices for Preferences
import { PerferenceService, CStorage } from './colmap/state/preferences';
import { LocalStorage } from './colmap/state/storage/localstorage';
import { BackendService } from './colmap/network/server'; 
import { ToolTip } from './colmap/ui/tooltip.component';
import { ServiceCards } from './colmap/ui/servicecards.component';

@Component({
	selector: 'colmap-root',
	template: `
		<router-outlet></router-outlet>
	`,
	directives: [ROUTER_DIRECTIVES],
	providers: [
		ROUTER_PROVIDERS,
		PerferenceService,
		ToolTip,
		ServiceCards,
		provide(CStorage, {useClass : LocalStorage}),
		provide(BackendService, {useClass : BackendService})
		
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
