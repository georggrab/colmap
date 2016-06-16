import { Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { MaterialTemplate } from './material';

declare var ol : any;

@Component({
	selector: 'map',
	templateUrl: 'app/map.component.html'
})
export class MapComponent extends MaterialTemplate implements OnInit {
	mapid : string;
	bw: number; bh: number;
	ol: any = ol;
	map: any;
	cards: any = {};


	constructor(private routeParams: RouteParams){
		super();
		this.cards[0] = true;
	}

	showInitial(idk){
		return this.cards[0];
	}

	toggle(idk){
		this.cards[0] = false;
		document.getElementById('mmap').focus();
	}

	onResize(event){
		this.bw = window.innerWidth;
		this.bh = window.innerHeight;

		this.map.updateSize();
	};

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
			})
		});
	}
}