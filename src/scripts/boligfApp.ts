/// <reference path="../typings/t.d.ts"/>

declare module Boligf {
	var Config: Boligf.IConfig;
}

module Boligf {

	export interface IBoligfApp extends angular.IModule { }
	export interface IConfig {
		ApiAccess(hideApi?: boolean): string;
	}

	export interface IRootScope extends angular.IRootScopeService {
		isLoading: boolean;
	}

	export var App: IBoligfApp;

	export class Startup {

		constructor() {

			App = angular.module('BoligfApp', [
				'ui.router',
				'ngResource',
				'ngCookies',
				'pascalprecht.translate',
				'LocalStorageModule'
			]);
		}

		public Run() {

			this.setupConfiguration();
		}

		private setupConfiguration() {

			var providerInjects: any[] = [
				'$stateProvider',
				'$urlRouterProvider',
				'$httpProvider',
				'$translateProvider',
				'$locationProvider'
			];

			var configFunc = (
				stateProvider: angular.ui.IStateProvider,
				urlRouterProvider: angular.ui.IUrlRouterProvider,
				httpProvider: angular.IHttpProvider,
				translateProvider: angular.translate.ITranslateProvider,
				locationProvider: angular.ILocationProvider
			) => {

				this.setupTranslations(translateProvider);

				this.setupDefaultRouting(urlRouterProvider, locationProvider);

				this.setupStates(stateProvider);

				this.setupHttpInterceptors(httpProvider);

			};

			providerInjects.push(configFunc);

			App.config(providerInjects);
			
			
			var runProviderInjects: any[] = [
				'$rootScope', 
				'$state', 
				'IAuthenticationService'
			];
			
			var runFunc = (
				rootScope: IRootScope, 
				state: angular.ui.IStateService, 
				authenticationService: IAuthenticationService
			) => {
				
				rootScope.$on("$stateChangeStart", (event, toState, toParams, fromState, fromParams) => {
					
					if (toState.data && toState.data.authenticate && !authenticationService.isAuthenticated) {
						
						state.transitionTo(Boligf.States.Authentication.UnAuthorized);
						event.preventDefault(); 
					}
				});
			}
			
			runProviderInjects.push(runFunc);
			
			App.run(runProviderInjects);
		}

		private setupTranslations(translateProvider: angular.translate.ITranslateProvider) {

			translateProvider.useStaticFilesLoader({
				prefix: '/assets/locales/locale-',
				suffix: '.json'
			});

			translateProvider.useMissingTranslationHandlerLog();

			translateProvider.preferredLanguage('en');
		}

		private setupDefaultRouting(urlRouterProvider: angular.ui.IUrlRouterProvider, locationProvider: angular.ILocationProvider) {

			urlRouterProvider.otherwise("/404");
			urlRouterProvider.when("/association/registermember", "/association/registermember/");

			locationProvider.html5Mode(false);
		}

		private setupStates(stateProvider: angular.ui.IStateProvider) {

			stateProvider
				.state(Boligf.States.Default.Home, {
					url: '/',
					templateUrl: "/views/components/home/home.html",
					data: { authenticate: true }
				})
				.state(Boligf.States.Default.News, {
					url: '/news',
					templateUrl: "/views/",
					data: { authenticate: true }
				})
				.state(Boligf.States.Default.Documents, {
					url: '/documents',
					templateUrl: "/views/",
					data: { authenticate: true }
				})
				.state(Boligf.States.Default.Board, {
					url: '/board',
					templateUrl: "/views/",
					data: { authenticate: true }
				})
				.state(Boligf.States.Residents.Base, {
					url: '/residents',
					templateUrl: "/views/components/residents/residents.html",
					controller: "ResidentsController",
					controllerAs: "residentsCtrl",
					data: { authenticate: true }
				})
				.state(Boligf.States.Address.Codes, {
					url: '/address/codes',
					templateUrl: "/views/components/addressCodes/addressCodes.html",
					controller: "AddressCodesController",
					controllerAs: "addressCodesCtrl",
					data: { authenticate: true }
				})
				.state(Boligf.States.Authentication.Base, {
					url: '/authentication',
					templateUrl: "/views/components/authentication/authentication.html",
					controller: "AuthenticationController",
					controllerAs: "authentication",
					data: { authenticate: false }
				})
				.state(Boligf.States.Authentication.UnAuthorized, {
					url: '/start',
					templateUrl: "/views/components/unauthorized/unauthorized.html",
					controller: "UnAuthorizedController",
					controllerAs: "unauthorizedCtrl",
					data: { authenticate: false }
				})
				.state(Boligf.States.Authentication.Login, {
					url: '/login',
					templateUrl: "/views/components/login/login.html",
					controller: "LoginController",
					controllerAs: "loginCtrl",
					data: { authenticate: false }
				})
				.state(Boligf.States.Authentication.Logout, {
					url: '/logout',
					controller: "LogoutController",
					controllerAs: "logoutCtrl",
					data: { authenticate: false }
				})
				.state(Boligf.States.Association.Base, {
					url: '/association',
					templateUrl: "/views/components/association/association.html",
					controller: "AssociationController",
					controllerAs: "associationCtrl",
					data: { authenticate: false }
				})
				.state(Boligf.States.Association.Register, {
					url: '/register',
					templateUrl: "/views/components/associationRegister/register.html",
					controller: "Association_RegisterController",
					controllerAs: "registerCtrl",
					data: { authenticate: false }
				})
				.state(Boligf.States.Association.RegisterMember, {
					url: '/registermember/:code',
					templateUrl: "/views/components/registerMember/registerMember.html",
					controller: "Association_RegisterMemberController",
					controllerAs: "registerMemberCtrl",
					data: { authenticate: false }
				})
				.state(Boligf.States.Association.AddAddresses, {
					url: '/add-addresses?lat&lng',
					templateUrl: "/views/components/associationAddAddresses/associationAddAddresses.html",
					controller: "Association_AddAddressesController",
					controllerAs: "addAddressesCtrl",
					data: { authenticate: true }
				})
				.state(Boligf.States.Association.VerifyAddresses, {
					url: '/verify-addresses',
					templateUrl: "/views/components/associationVerifyAddresses/associationVerifyAddresses.html",
					controller: "Association_VerifyAddressesController",
					controllerAs: "verifyAddressesCtrl",
					data: { authenticate: true }
				})
				.state(Boligf.States.Errors.E404, {
					url: '/404',
					templateUrl: "/views/components/errors/404.html",
					data: { authenticate: false }
				})
				.state(Boligf.States.Errors.E403, {
					url: '/403',
					template: "<span>403 page</span>",
					data: { authenticate: false }
				});
		}

		private setupHttpInterceptors(httpProvider: angular.IHttpProvider) {

			httpProvider.interceptors.push("IInterceptHttpProvider");
		}

		public static Initialize() {

			return new Startup();
		}
	}
}

// TODO: Find better way to do this
var app = Boligf.Startup.Initialize();