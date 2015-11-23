module Boligf {

	export interface IIsAuthorizedDirectiveScope extends angular.IScope {
		isProtected: boolean;
	}

	export interface IIsAuthorizedDirective extends angular.IDirective {
		restrict: string;
		scope: any;
		link(scope: angular.IScope, element: JQuery, attributes: angular.IAttributes): void;
	}

	export function isAuthorizedDirective(authenticationService: Boligf.IAuthenticationService): angular.IDirective {

		var directive = <IIsAuthorizedDirective> {
			restrict: 'A',
			scope: {
				isProtected: "=boligfIsAuthorized"
			},
			link: link
		}

		function link(scope: IIsAuthorizedDirectiveScope, element: JQuery, attributes: angular.IAttributes): void {

			scope.$watch(
				() => {
					return authenticationService.isAuthenticated;
				},
				(newValue, oldValue) => {
					if (newValue) {
						if (scope.isProtected) {
							element.show();
						} else {
							element.hide();
						}
					} else {
						if (!scope.isProtected) {
							element.show();
						} else {
							element.hide();
						}
					}
				}
			);
		}

		return directive;
	}

	Boligf.App.directive("boligfIsAuthorized", ['IAuthenticationService', Boligf.isAuthorizedDirective]);
} 