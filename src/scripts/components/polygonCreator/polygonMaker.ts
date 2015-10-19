module Boligf {
	
	export class PolygonMaker {
		
		map: google.maps.Map;
		selections: PolygonMakerSelection[];
		onSelectionCompleted: Function;
		onMapCleaned: Function;
		
		constructor() {
			
			this.selections = [];
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
		
		clearMap(): void {
			
			this.clearMapSelections();
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
			
			newSelection.onCompleted = (coords) => {
				
				if (this.onSelectionCompleted) {
					this.onSelectionCompleted(coords);
				}
			};
			
			this.selections.push(newSelection);
			
			return newSelection;
		}
		
		private clearMapSelections(): void {
			
			for (var i = 0; i < this.selections.length; i++) {
				
				this.selections[i].remove();
			}
			
			this.selections = [];
			
			if (this.onMapCleaned) {
				this.onMapCleaned();
			}
		}
	}
	
	export class PolygonMakerSelection {
		
		isDone: boolean;
		dots: PolygonMakerDot[];
		lines: PolygonMakerLine[];
		map: google.maps.Map;
		
		onCompleted: Function;
		
		private area:PolygonMakerArea;
		
		constructor(map: google.maps.Map) {
			
			this.map = map;
			this.dots = [];
			this.lines = [];
		}
		
		addDot(latLng: google.maps.LatLng): void {
			
			var newDot = new PolygonMakerDot(latLng, this.map);
			
			newDot.onDotClicked = (dot) => { this.finishSelection(dot); };
			
			this.dots.push(newDot); 
			
			this.addLineBetweenDots();
		}
		
		finishSelection(clickedDot: PolygonMakerDot): void {
			
			if (this.dots.length < 3) {
				// You cannot have less than 3 dots added
			}
			
			for (var i = 0; i < this.dots.length; i++) {
				var dot = this.dots[i];
				if (dot.equals(clickedDot)) {
					// You cannot end a line on the same dot
				}
			}
			
			this.createPolygonArea();
		}
		
		remove(): void {
			
			if (this.area)
			{
				this.area.remove();
			}
			
			this.removeAllDots();
			this.removeAllLines();
		}
		
		private addLineBetweenDots(): void {
			
			if (this.dots.length > 1) {
				
				this.removeAllLines();
				
				var coordinates = this.getDotsCoordinates();
				var newLine = new PolygonMakerLine(coordinates, this.map);
				
				this.lines.push(newLine);
			}
		}
		
		private removeAllLines(): void {
			
			for (var i = 0; i < this.lines.length; i++) {
				
				this.lines[i].remove();
			}
			
			this.lines = [];
		}
		
		private removeAllDots(): void {
			
			for (var i = 0; i < this.dots.length; i++) {
				
				this.dots[i].remove();
			}
			
			this.dots = [];
		}
		
		private createPolygonArea(): void {
			
			var coordinates = this.getDotsCoordinates();
			
			this.removeAllDots();
			this.removeAllLines();
			
			this.area = new PolygonMakerArea(coordinates, this.map);
			
			this.isDone = true;
			
			if (this.onCompleted) {
				
				var data = [];
				var paths = this.area.getPlots();
				
				paths.getAt(0).forEach(function(xy, index) {
					data.push([xy.lng(), xy.lat()]);
				});
				
				data.unshift(data[data.length-1]);
				
				this.onCompleted(data);
			}
		}
		
		private getDotsCoordinates(): google.maps.LatLng[] {
			
			var dotsCoordinates: google.maps.LatLng[] = [];
			
			for (var i = 0; i < this.dots.length; i++) {
				
				dotsCoordinates.push(this.dots[i].getLatLng());
			}
			
			return dotsCoordinates;
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
		
		getLatLng(): google.maps.LatLng {
			
			return this.latLng;
		}
		
		equals(dot: PolygonMakerDot): boolean {
			
			return (this.latLng.lat() === dot.getLatLng().lat() 
				&& this.latLng.lng() === dot.getLatLng().lng());
		}
		
		remove(): void {
			
			this.markerObj.setMap(null);
		}
		
		private drawDot(): void {
			
			this.markerObj = new google.maps.Marker({
				position: this.latLng, 
				map: this.map
			});	
			
			this.addClickListener();
		}
		
		private addClickListener(): void {
			
			google.maps.event.addListener(this.markerObj, 'click', () => { 
				
				this.onDotClicked(this);
			});
		}
	}
	
	export class PolygonMakerLine {
		
		private lineObj: google.maps.Polyline;
		
		constructor(coordinates: google.maps.LatLng[], map: google.maps.Map) {
			
			this.lineObj= new google.maps.Polyline({
				path: coordinates,
				strokeColor: "#e6c400",
				strokeOpacity: 1.0,
				strokeWeight: 2,
				map: map
	  		});
		}
		
		remove(): void {
			
			this.lineObj.setMap(null);
		}
	}
	
	export class PolygonMakerArea {
		
		private areaObj: google.maps.Polygon;
		
		constructor(coordinates: google.maps.LatLng[], map: google.maps.Map) {
			
			this.areaObj= new google.maps.Polygon({
				paths: coordinates,
				strokeColor: "#e6c400",
				strokeOpacity: 0.9,
				strokeWeight: 2,
				fillColor: "#ffda00",
				fillOpacity: 0.40,
				map: map
	  		});
		}
		
		remove(): void {
			
			this.areaObj.setMap(null);
		}
		
		getPlots(): google.maps.MVCArray {
			
			return this.areaObj.getPaths();
		}
	}
}