module Boligf {

	export interface IAuthenticationControllerScope extends angular.IScope {
		
	}

	export class AuthenticationController {

		static $inject = ['$scope'];

		constructor(
			private $scope: IAuthenticationControllerScope
			) {

		}
	}

	Boligf.App.controller("AuthenticationController", Boligf.AuthenticationController);
}