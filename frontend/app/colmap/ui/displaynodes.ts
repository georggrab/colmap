import * as Ol from 'openlayers';
import {GeoGraphNetwork, GraphEdge, CNode, Coords} from '../graph/graphnetwork';

export class DisplaySettings {
	// Todo Integrate into colmap.state.persistence
	// Todo can persistence be achieved via TS decorators?
	// Todo create Settings interface for things like this

	public HighlightDuration : number = 1000;
	public DeleteDuration : number = 1000;

	public EdgeStyleNormal : Ol.style.Style = new Ol.style.Style({
		stroke : new Ol.style.Stroke({
			color : 'rgba(200,50,20,0.6)',
			width:2,
			lineDash : [5,5]
		})
	});

	public EdgeStyleHighlight : Ol.style.Style = new Ol.style.Style({
		stroke: new Ol.style.Stroke({
			color:'rgba(150,150,5,0.6)', 
			width:2,
			lineDash : [5,5]
		})
	}); 

	public NodeStyle : Ol.style.Style = new Ol.style.Style({
		image : new Ol.style.RegularShape({
			fill : new Ol.style.Fill({
				color: 'rgba(30,50,230,0.6)'
			}),
			stroke : new Ol.style.Stroke({
				color: 'gray', width: 1
			}),
			points: 9,
			radius: 3,
			radius2: 3,
			angle: 0
		})
	});
} 

export class DisplayNodeUtils {
	static Display : DisplaySettings = new DisplaySettings();

	static setDisplaySettings(s : DisplaySettings){
		this.Display = s;
	}

	static deleteEdge(edge : GraphEdge, view: Ol.Collection<Ol.Feature>, on : GeoGraphNetwork){
		for (let edgeCanditate of on.nodes[edge.from].connections){
			if (edgeCanditate.to == edge.to){
				edgeCanditate.getView().setStyle(this.Display.EdgeStyleNormal);

				setTimeout(() => {
					// Todo: Is this too mighty? This Function shouldn't modify the graphnetworks state
					// remove injection of on : GeoGraphNetwork at some point..

					let idx = 0;
					let feature = edgeCanditate.getView();

					view.remove(feature);
					edgeCanditate.attachView(null);

					for (let e of on.nodes[edge.from].connections){
						if (edgeCanditate.to = e.to){
							on.nodes[edge.from].connections.splice(idx, 1);
						}
						idx++;
					};
				}, this.Display.DeleteDuration);
			}
		}
	}

	static animateHighlight(edge : GraphEdge, on : GeoGraphNetwork){
		for (let edgeCanditate of on.nodes[edge.from].connections){
			if (edgeCanditate.to == edge.to){
				edgeCanditate.getView().setStyle(this.Display.EdgeStyleHighlight);

				setTimeout(() => {
					edgeCanditate.getView().setStyle(null);
				}, this.Display.HighlightDuration);
			}
		}
	}

	static displayEdgeRaw(edge : GraphEdge, network: GeoGraphNetwork, pushOnto){
		let coords = edge.getLineCoords(network, Ol.proj.fromLonLat);
		let line = new Ol.geom.LineString(coords);

		// The GeoGraphNetwork is only supposed to be
		// a temporary structure, so transfer metainformation
		// in its edgenetwork to this.feature collections,
		// which is directly connected to the map view.

		// rly?

		let edgeFeature = new Ol.Feature({
			geometry : line,
			from: edge.from,
			to: edge.to
		});

		pushOnto.push(edgeFeature);
		edge.attachView(edgeFeature);
	}

	static displayEdges(node : CNode<Coords>, network : GeoGraphNetwork, pushOnto){
		for (let edge of node.connections){
			this.displayEdgeRaw(edge, network, pushOnto);
		}
	}

	static displayNode(node : CNode<Coords>, pushOnto) : any {
		let lastInsertion = node.type.getOl(Ol.proj.fromLonLat);
		let feature = new Ol.Feature(new Ol.geom.Point(lastInsertion));
		feature.setStyle(this.Display.NodeStyle);

		pushOnto.push(feature);
		return lastInsertion;
	}
}