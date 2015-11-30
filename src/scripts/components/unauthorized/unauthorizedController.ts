module Boligf {

	export interface IUnAuthorizedControllerScope extends angular.IScope {
		
	}

	export class UnAuthorizedController {

		static $inject = ['$scope'];

		constructor(
			private $scope: IAuthenticationControllerScope
			) {

		}
	}

	Boligf.App.controller("UnAuthorizedController", Boligf.UnAuthorizedController);
}