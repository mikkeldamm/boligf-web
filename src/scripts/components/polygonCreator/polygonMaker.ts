module Boligf {
	
	export class PolygonMaker {
		
		map: google.maps.Map;
		selections: PolygonMakerSelection[];
		dots: PolygonMakerDot[];
		
		constructor() {
			
			this.selections = [];
			this.dots = [];
		}
		
		createMap(element: JQuery, lat: number, lng: number): void {
			
			var rawElement = element[0];
			
			var centerOfMap = new google.maps.LatLng(
				lat,
				lng
			);
			
			var myOptions = {
				zoom: 17,
				center: centerOfMap,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
			 
			this.map = new google.maps.Map(rawElement, myOptions);
			
			this.listenOnMapClick();
		}
		
		private listenOnMapClick(): void {
			
			google.maps.event.addListener(this.map, 'click', (event: google.maps.KmlMouseEvent) => { 
				
				var selection = this.findOrCreateSelection();
				
				selection.addDot(event.latLng);
			});
		}
		
		private findOrCreateSelection(): PolygonMakerSelection {
			
			for (var i = 0; i < this.selections.length; i++) {
				
				var selection = this.selections[i];
				if (!selection.isDone) {
					return selection;
				}
			}
			
			var newSelection = new PolygonMakerSelection(this.map);
			
			this.selections.push(newSelection);
			
			return newSelection;
		}
	}
	
	export class PolygonMakerSelection {
		
		isDone: boolean;
		dots: PolygonMakerDot[];
		map: google.maps.Map;
		
		constructor(map: google.maps.Map) {
			
			this.map = map;
			this.dots = [];
		}
		
		addDot(latLng: google.maps.LatLng): void {
			
			var newDot = new PolygonMakerDot(latLng, this.map);
			
			newDot.onDotClicked = (_latLng) => { this.addDot(_latLng); };
			
			this.dots.push(newDot); 
		}
	}
	
	export class PolygonMakerDot {
		
		onDotClicked: Function;
		
		private latLng: google.maps.LatLng;
		private map: google.maps.Map;
		
		private markerObj: google.maps.Marker;
		
		constructor(latLng: google.maps.LatLng, map: google.maps.Map) {
			
			this.latLng = latLng;
			this.map = map;
			
			this.drawDot();
		}
		
		private drawDot(): void {
			
			this.markerObj = new google.maps.Marker({
				position: this.latLng, 
				map: this.map
			});	
		}
		
		private addClickListener(): void {
			
			google.maps.event.addListener(this.markerObj, 'click', () => { 
				
				this.onDotClicked(this.markerObj.getPosition());
			});
		}
	}
}