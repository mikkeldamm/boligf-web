module Boligf {

	export class BoligfAddress {
		id: string;
		streetname: string;
		no: string;
		floor: string;
		door: string;
		zip: string;
		city: string;
		latitude: number; 
		longitude: number;
		fullAddress: string;
		
		static mapFromDawaAddress(dawaAddress: DawaAddress): BoligfAddress {
			
			var address = new BoligfAddress();
			address.id = dawaAddress.id;
			address.streetname = dawaAddress.adgangsadresse.vejstykke.navn;
			address.no = dawaAddress.adgangsadresse.husnr;
			address.floor = dawaAddress.etage;
			address.door = dawaAddress.dør;
			address.zip = dawaAddress.adgangsadresse.postnummer.nr;
			address.city = dawaAddress.adgangsadresse.postnummer.navn;
			address.latitude = dawaAddress.adgangsadresse.adgangspunkt.koordinater[0];
			address.longitude = dawaAddress.adgangsadresse.adgangspunkt.koordinater[1];
			address.fullAddress = dawaAddress.adressebetegnelse;
			
			return address;
		}
	}
	
	export class DawaAddress {
		
		adgangsadresse: {
			adgangspunkt: {
				koordinater: number[]
			},
			esrejendomsnr: string,
			href: string,
			husnr: string,
			id: string,
			matrikelnr: string,
			postnummer: {
				navn: string,
				nr: string,
			},
			region: {
				kode: string,
				navn: string
			},
			vejstykke: {
				navn: string
			}
		};
		adressebetegnelse: string;
		etage: string;
		dør: string;
		href: string
		id: string;
	}

	export class Selection {
		
		coordinates: any[];
		addresses: BoligfAddress[];
		
		constructor(coords: any[]) {
			this.coordinates = coords;
			this.addresses = [];
		}
		
		getPolygonCoordinatesAsSearchableString(): string {
			
			var searchString = "[[";
			
			for (var i = 0; i < this.coordinates.length; i++) {
				
				var coord = this.coordinates[i];
				
				searchString += "[" + coord[0]+ "," + coord[1] + "],";
			}
			
			searchString = searchString.substring(0, searchString.length-1);
			searchString += "]]";
			
			return searchString;
		}
	} 

	export interface IPolygonCreatorComponentScope extends angular.IScope {
		selections: Selection[];
		centerLat: number;
		centerLng: number;
		onAddressesFound: (callbackData: {selection: Selection}) => void;
		onMapCleaned: () => void;
	}

	export interface IPolygonCreatorComponent {
		maker: PolygonMaker;
		pointerIsCreated: boolean;
		selections: Selection[];
		clearMap(): void;
	}

	export class PolygonCreatorComponent implements IPolygonCreatorComponent {

		static $inject = ['$scope', '$http'];

		public pointerIsCreated: boolean;
		public selections: Selection[];
		public maker: PolygonMaker;

		constructor(private $scope: IPolygonCreatorComponentScope, private $http: angular.IHttpService) {
			
			this.pointerIsCreated = false;
			this.selections = [];
			this.maker = new PolygonMaker();
			
			this.maker.onSelectionCompleted = (coords) => {
				
				var selection = new Selection(coords);
				
				this.selections.push(selection);
				
				this.$scope.$apply();
				
				this.findAddressesInSelection(selection);
			};
			
			this.maker.onMapCleaned = () => {
				
				this.selections = [];
				this.pointerIsCreated = false;
				
				this.$scope.onMapCleaned();
			};
			
			this.maker.onPointerSet = () => {
			
				this.pointerIsCreated = true;
				
				this.$scope.$apply();
			};
		}
		
		clearMap(): void {
			
			this.maker.clearMap();
		}
		
		private findAddressesInSelection(selection: Selection): void {
			
			var polygon = selection.getPolygonCoordinatesAsSearchableString();
			var url = "https://dawa.aws.dk/adresser?polygon=" + polygon;
			
			this.$http.get(url).then((result: any) => {
				
				result.data.forEach((address: DawaAddress) => {
					selection.addresses.push(BoligfAddress.mapFromDawaAddress(address));
				});
				
				this.$scope.onAddressesFound({ selection: selection });

			}).catch((b) => {

				console.log(b);
			});
		}
	}

	export function polygonCreatorDirective(): angular.IDirective {
		
		function link(scope: IPolygonCreatorComponentScope, element: JQuery, attributes: angular.IAttributes, controller: IPolygonCreatorComponent): void {

			controller.maker.createMap(element.find('.map-area'), scope.centerLat, scope.centerLng);
		}
		
		var directive =  {
			restrict: 'E',
			scope: {
				selections: "=",
				centerLat: "@",
				centerLng: "@",
				onAddressesFound: "&",
				onMapCleaned: "&"
			},
			replace: true,
			template: '<div class="map-container"><div class="map-options" ng-show="polygonCreatorCtrl.pointerIsCreated" ng-click="polygonCreatorCtrl.clearMap()"><i class="fa fa-times"></i>clear all selections</div><div class="map-area"></div></div>',
			controller: ['$scope', '$http', Boligf.PolygonCreatorComponent],
			controllerAs: "polygonCreatorCtrl",
			link: link
		}

		return directive;
	}

	Boligf.App.directive("boligfPolygonCreator", [Boligf.polygonCreatorDirective]);
} 