module Boligf {

	export interface IPolygonCreatorComponentScope extends ng.IScope {
	
	}

	export interface IPolygonCreatorComponent {
		maker: PolygonMaker;
	}

	export class PolygonCreatorComponent implements IPolygonCreatorComponent {

		static $inject = [];

		public maker: PolygonMaker;

		constructor() {
			
			this.maker = new PolygonMaker();
		}
	}

	export function polygonCreatorDirective(): ng.IDirective {
		
		function link(scope: IPolygonCreatorComponentScope, element: JQuery, attributes: ng.IAttributes, controller: IPolygonCreatorComponent): void {

			controller.maker.createMap(element, 55.666497957037, 12.5784855910966);
		}
		
		var directive =  {
			restrict: 'E',
			scope: {},
			replace: true,
			template: '<div class="map-area"></div>',
			controller: [Boligf.PolygonCreatorComponent],
			controllerAs: "polygonCreatorCtrl",
			link: link
		}

		return directive;
	}

	Boligf.App.directive("boligfPolygonCreator", [Boligf.polygonCreatorDirective]);
} 