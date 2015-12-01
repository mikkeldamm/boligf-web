module Boligf {

	export interface ILoginController extends angular.IScope {
		email: string;
		password: string;
		login(): void;
	}

	export class LoginController {

		static $inject = ['$state', 'IAuthenticationService', 'stateLoading'];

		email: string;
		password: string;

		constructor(
			private $state: angular.ui.IStateService,
			private authenticationService: IAuthenticationService,
			private stateLoading: IStateLoading
			) {

			// Redirect user to home if is logged in
			if (this.authenticationService.isAuthenticated) {
				this.$state.go(Boligf.States.Default.Home);
			}
		}

		login(): void {

			this.stateLoading.start();

			this
				.authenticationService
				.login(this.email, this.password)
				.then((isSuccedded: boolean) => {
					
					if (isSuccedded) {
						this.$state.go(Boligf.States.Default.Home);
					} else {

						// TODO: Instead of redirect on failure, then just show error for user
						this.$state.go(Boligf.States.Errors.E403);
					}
				})
				.finally(() => {
					
					this.stateLoading.stop();
				});
		}
	}

	Boligf.App.controller("LoginController", Boligf.LoginController);
} 