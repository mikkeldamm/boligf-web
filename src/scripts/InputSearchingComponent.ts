/// <reference path="../typings/t.d.ts"/>

module Boligf {
	
	export interface IInputSearchingComponentScope extends angular.IScope {
		eventStatus: number;
	}

	export interface IInputSearchingDirective extends angular.IDirective {
		restrict: string;
		scope: any;
		replace: boolean;
		link(scope: angular.IScope, element: JQuery, attributes: angular.IAttributes): void;
	}
	
	export function inputSearchingDirective(): angular.IDirective {

		function link(scope: IInputSearchingComponentScope, element: JQuery, attributes: angular.IAttributes): void {
			
			element.addClass('searching-status');

			function clearClasses() {
				element.removeClass('searching');
				element.removeClass('succedded');
				element.removeClass('failed');
			}

			scope.$watch(() => {
				return scope.eventStatus;
			}, (newValue, oldValue) => {

				clearClasses();
				
				if (newValue === 0) {
					element.addClass('searching');
				} else if (newValue === 1) {
					element.addClass('succedded');
				} else if (newValue === 2) {
					element.addClass('failed');
				}
			});
		}

		var directive = <IInputSearchingDirective> {
			restrict: 'A',
			scope: {
				eventStatus: "=boligfInputSearching"
			},
			replace: false,
			link: link
		}

		return directive;
	}

	Boligf.App.directive("boligfInputSearching", [Boligf.inputSearchingDirective]);
} 