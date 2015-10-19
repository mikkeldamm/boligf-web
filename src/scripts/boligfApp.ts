declare module Boligf {
	var Config: Boligf.IConfig;
}

module Boligf {

	export interface IBoligfApp extends ng.IModule { }
	export interface IConfig {
		ApiAccess(hideApi?: boolean): string;
	}

	export interface IRootScope extends ng.IRootScopeService {
		isLoading: boolean;
	}

	export var App: IBoligfApp;

	export class Startup {

		constructor() {

			App = angular.module('BoligfApp', [
				'ui.router',
				'ngResource',
				'ngCookies',
				'pascalprecht.translate'
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
				stateProvider: ng.ui.IStateProvider,
				urlRouterProvider: ng.ui.IUrlRouterProvider,
				httpProvider: ng.IHttpProvider,
				translateProvider: ng.translate.ITranslateProvider,
				locationProvider: ng.ILocationProvider
			) => {

				this.setupTranslations(translateProvider);

				this.setupDefaultRouting(urlRouterProvider, locationProvider);

				this.setupStates(stateProvider);

				this.setupHttpInterceptors(httpProvider);

			};

			providerInjects.push(configFunc);

			App.config(providerInjects);
		}

		private setupTranslations(translateProvider: ng.translate.ITranslateProvider) {

			translateProvider.useStaticFilesLoader({
				prefix: '/assets/locales/locale-',
				suffix: '.json'
			});

			translateProvider.useMissingTranslationHandlerLog();

			translateProvider.preferredLanguage('en');

		}

		private setupDefaultRouting(urlRouterProvider: ng.ui.IUrlRouterProvider, locationProvider: ng.ILocationProvider) {

			urlRouterProvider.otherwise("/");
			urlRouterProvider.when("/association/registermember", "/association/registermember/");

			locationProvider.html5Mode(false);
		}

		private setupStates(stateProvider: ng.ui.IStateProvider) {

			stateProvider
				.state(Boligf.States.Default.Home, {
					url: '/',
					templateUrl: "/views/components/home/home.html"
				})
				.state(Boligf.States.Default.News, {
					url: '/news',
					templateUrl: "/views/"
				})
				.state(Boligf.States.Default.Documents, {
					url: '/documents',
					templateUrl: "/views/"
				})
				.state(Boligf.States.Default.Board, {
					url: '/board',
					templateUrl: "/views/"
				})
				.state(Boligf.States.Default.Residents, {
					url: '/residents',
					templateUrl: "/views/"
				})
				.state(Boligf.States.Authentication.Base, {
					url: '/authentication',
					templateUrl: "/views/components/authentication/authentication.html",
					controller: "AuthenticationController",
					controllerAs: "authentication"
				})
				.state(Boligf.States.Authentication.Login, {
					url: '/login',
					templateUrl: "/views/components/login/login.html",
					controller: "LoginController",
					controllerAs: "loginCtrl"
				})
				.state(Boligf.States.Association.Base, {
					url: '/association',
					templateUrl: "/views/components/association/association.html",
					controller: "AssociationController",
					controllerAs: "associationCtrl"
				})
				.state(Boligf.States.Association.Register, {
					url: '/register',
					templateUrl: "/views/components/associationRegister/register.html",
					controller: "Association_RegisterController",
					controllerAs: "registerCtrl"
				})
				.state(Boligf.States.Association.RegisterMember, {
					url: '/registermember/:code',
					templateUrl: "/views/components/registerMember/registerMember.html",
					controller: "Association_RegisterMemberController",
					controllerAs: "registerMemberCtrl"
				})
				.state(Boligf.States.Association.AddAddresses, {
					url: '/add-addresses',
					templateUrl: "/views/components/associationAddAddresses/associationAddAddresses.html",
					controller: "Association_AddAddressesController",
					controllerAs: "addAddressesCtrl"
				})
				.state(Boligf.States.Association.VerifyAddresses, {
					url: '/verify-addresses',
					templateUrl: "/views/components/associationVerifyAddresses/associationVerifyAddresses.html",
					controller: "Association_VerifyAddressesController",
					controllerAs: "verifyAddressesCtrl"
				})
				.state(Boligf.States.Errors.E404, {
					url: '/404',
					template: "<span>404 page</span>"
				})
				.state(Boligf.States.Errors.E403, {
					url: '/403',
					template: "<span>403 page</span>"
				});
		}

		private setupHttpInterceptors(httpProvider: ng.IHttpProvider) {

			httpProvider.interceptors.push("IInterceptHttpProvider");
		}

		public static Initialize() {

			return new Startup();
		}
	}
}

// TODO: Find better way to do this
var app = Boligf.Startup.Initialize();