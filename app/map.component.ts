import { Component, OnInit, ReflectiveInjector, Inject } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { MaterialTemplate } from './material';

import { GeoGraphNetwork } from './colmap/graph/graphnetwork';
import { PerferenceService } from './colmap/state/preferences';

declare var ol : any;
declare var document: any;
declare var navigator: any;

@Component({
	selector: 'map',
	templateUrl: 'app/map.component.html'
})
export class MapComponent extends MaterialTemplate implements OnInit {
	// URL MAP id
	mapid : string;

	// Window height & width
	bw: number; bh: number;

	// Openlayers Library
	ol: any = ol;

	// Openlayers3 Map Controller
	map: any;

	// Notification container
	snackbarContainer: any;


	constructor(private routeParams: RouteParams, private preferences : PerferenceService){
		super();
	}

	connect(){
		// socket connection logic here..
		this.notification('connected to ' + this.mapid);
	}

	notification(of){
		this.snackbarContainer.MaterialSnackbar.showSnackbar({
			message: of
		  , timeout: 2000
		  , actionHandler: function(event){}
		  , actionText: 'OK'
		});

	}

	// TODO remove debug function
	btnDebug(){
		document.map = this;
		this.notification('Exposed Component to: document.map');
	}

	mapAddCoords(position){
		debugger;
		var pos = ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]);
		this.notification('LON='+position.coords.longitude);
		var marker = new ol.Overlay({
			position: pos
		  , positioning: 'center-center'
			, element: document.getElementById('marker-own-location')		
			, stopEvent: false
		});
		this.map.addOverlay(marker);
	}

	btnAddLocation(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				this.mapAddCoords.bind(this));
		} else {

		}
	}

	provider(olSource){
		var layer: any;
		switch (olSource) {
			case this.ol.source.Stamen:
				layer = new this.ol.layer.Tile({
					source: new this.ol.source.Stamen({ layer: 'toner' })
				}); break;
			case this.ol.source.OSM:
				layer = new this.ol.layer.Tile({
					source: new this.ol.source.OSM({})
				}); break;
			case this.ol.source.BingMaps:
				layer = new this.ol.layer.Tile({
					source: new this.ol.source.BingMaps({
						key: 'AnOpGK0vuwH0a2tPUKih1RPmu6REVRH7SqP8jhSNFKeDORF7cCXGkhxY1wzbF7ul'
						// TODO leverage usage of this
					  , imagerySet: 'AerialWithLabels'
					})
				}); break;
			default: break;
		}
		// if layer == currentLayer bleh TODO
		this.map.getLayers().clear();
		this.map.addLayer(layer);
	}

	onResize(event){
		this.bw = window.innerWidth;
		this.bh = window.innerHeight;

		this.map.updateSize();
	};

	ngAfterViewInit(){
		super.ngAfterViewInit();
		this.snackbarContainer = document.querySelector('#map-snackbar');
		this.connect();
	}

	ngOnInit(){
		let gotId = this.routeParams.get('mapid');
		this.bw = window.innerWidth;
		this.bh = window.innerHeight;
		this.mapid = gotId;


		this.map = new this.ol.Map({
			target: 'mmap',
			layers: [
				new this.ol.layer.Tile({
					source: new this.ol.source.Stamen({layer:'toner'}),
					preload:4
				})
			],
			view: new this.ol.View({
				center: this.ol.proj.fromLonLat([37.41, 8.82]),
				zoom: 4
			}),
			controls: new this.ol.Collection()
		});
	}
}