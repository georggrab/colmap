import { Component, OnInit, ReflectiveInjector, Inject } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { MaterialTemplate } from './material';

import { GeoGraphNetwork, COLConnectionInfo, GraphNetworkHealth, Coords, CNode, GraphEdge } from './colmap/graph/graphnetwork';
import { PerferenceService } from './colmap/state/preferences';
import { BackendService } from './colmap/network/server';

import { Observable } from 'rxjs/Observable';

declare var ol : any;
declare var document: any;
declare var navigator: any;

@Component({
	selector: 'map',
	templateUrl: 'app/map.component.html'
})
export class MapComponent extends MaterialTemplate implements OnInit {
	/* Databound Attributes: */
	mapid : string;
	connectedUsers : number = 0;
	connectedServices : number = 0;

	// Notification container TODO make this a service/component
	snackbarContainer: any;

	/* Things we need for OpenLayers */
	ol: any = ol;
	bw: number; bh: number;
	map: any;

	/* Things we need for the GraphNetwork */
	lastNetworkHealth : GraphNetworkHealth = null;
	nodeFeatures : any = new ol.Collection();
	edgeFeatures : any = new ol.Collection();
	graphLayer : any = new ol.layer.Vector({
		source : new ol.source.Vector({
			features: this.nodeFeatures
		})
	});
	edgeLayer : any = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: this.edgeFeatures
		}),
		style: new ol.style.Style({
			stroke: new ol.style.Stroke({
				color:'rgba(10,50,200,0.3)', 
				width:2,
				lineDash : [5,5]
			}),
		})
	});

	constructor(private routeParams: RouteParams, 
		private preferences : PerferenceService,
		private backendService : BackendService){
		super();
	}

	buildNetworkInitial(graphNetwork : Observable<GeoGraphNetwork>){
		this.notification("buildNetworkInitial()..");
		// Step 1: Place Nodes on Map
		graphNetwork.forEach(network => {
			network.nodeIterator((node : CNode<Coords>, key, n) => {
				console.log("adding feature");
				let pos = ol.proj.fromLonLat(node.type.getOl());
				let feature = new ol.Feature(new ol.geom.Point(pos));
				feature.setStyle(new ol.style.Style({
					image : new ol.style.RegularShape({
						fill : new ol.style.Fill({color: 'red'}),
						stroke : new ol.style.Stroke({color: 'black', width: 2}),
						points: 4,
						radius: 10,
						radius2: 0,
						angle: 0
					})
				}));
				for (let edge of node.connections){
					let coords = edge.getLineCoords(network);
					let line = new ol.geom.LineString(new Array(
							ol.proj.fromLonLat(coords[0].getOl()),
							ol.proj.fromLonLat(coords[1].getOl())
						));
					let edgeFeature = new ol.Feature({
						geometry : line,
						name: "line"
					});
					this.edgeFeatures.push(edgeFeature);
				}
				this.nodeFeatures.push(feature);
			}, () => {
				//this.graphLayer.changed();
			});
		});

		// Step 2: Connect Nodes
	}

	connect(){
		// socket connection logic here..
		let source : Observable<COLConnectionInfo> = this.backendService.connect(this.mapid);
		source.forEach(connectionInfo => {
			if (connectionInfo.connected){
				this.notification('connected to ' + this.mapid);
				this.connectedUsers = connectionInfo.connectedUsers;
				this.connectedServices = connectionInfo.connectedServices;

				if (this.lastNetworkHealth === null){
					this.lastNetworkHealth = connectionInfo.networkHealth;
					this.buildNetworkInitial(this.backendService.downloadNetwork());
				}

			} else {
				this.notification('connection failed');
			}
		});
	}

	notification(of){
		this.snackbarContainer.MaterialSnackbar.showSnackbar({
			message: of
		  , timeout: 2000
		  , actionHandler: function(event){}
		  , actionText: 'OK'
		});

	}


	mapAddCoords(position){
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

	// TODO remove debug function
	btnDebug(){
		document.map = this;
		this.notification('Exposed Component to: document.map');
	}

	btnAddLocation(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				this.mapAddCoords.bind(this));
		} else {

		}
	}

	provider(olSource : string, apply : boolean = true) : string {
		var layer: any;
		switch (olSource) {
			case 'ol.source.Stamen':
				layer = new this.ol.layer.Tile({
					source: new this.ol.source.Stamen({ layer: 'toner' })
				}); break;
			case 'ol.source.OSM':
				layer = new this.ol.layer.Tile({
					source: new this.ol.source.OSM({})
				}); break;
			case 'ol.source.BingMaps':
				layer = new this.ol.layer.Tile({
					source: new this.ol.source.BingMaps({
						key: 'AnOpGK0vuwH0a2tPUKih1RPmu6REVRH7SqP8jhSNFKeDORF7cCXGkhxY1wzbF7ul'
						// TODO leverage usage of this
					  , imagerySet: 'AerialWithLabels'
					})
				}); break;
		}
		if (apply) {
			this.map.getLayers().clear();
			this.map.addLayer(layer);
		}
		this.preferences.setPreference("ChosenMap", olSource)
		return layer;
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
				this.provider(this.preferences.getPreferences().ChosenMap, false),
				this.graphLayer, this.edgeLayer
			],
			view: new this.ol.View({
				center: this.ol.proj.fromLonLat([37.41, 8.82]),
				zoom: 4
			}),
			controls: new this.ol.Collection()
		});
	}
}