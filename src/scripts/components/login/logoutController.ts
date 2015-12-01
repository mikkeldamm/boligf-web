module Boligf {

	export interface ILogoutController extends angular.IScope {
		
	}

	export class LogoutController {

		static $inject = ['$state', 'IAuthenticationService'];

		constructor(state: angular.ui.IStateService, authenticationService: IAuthenticationService) {
			
			authenticationService.logout();
			state.go(Boligf.States.Authentication.Login, {}, { reload: true });
		}
	}

	Boligf.App.controller("LogoutController", Boligf.LogoutController);
} 