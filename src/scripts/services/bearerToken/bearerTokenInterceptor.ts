module Boligf {

	export interface IInterceptHttpProvider {
		request(config: angular.IRequestConfig): angular.IRequestConfig;
		requestError(rejection: angular.IHttpPromiseCallback<any>): angular.IPromise<any>;
		responseError(rejection: angular.IHttpPromiseCallbackArg<any>): angular.IPromise<any>;
	}

	export class BearerTokenInterceptor implements IInterceptHttpProvider {

		static $inject = ['$q', 'IStoreBearerToken'];

		constructor(private $q: angular.IQService, private bearerTokenStorageService: Boligf.IStoreBearerToken) {

		}

		public request = (config: angular.IRequestConfig): angular.IRequestConfig => {

			config.headers = config.headers || {};
			
			if (config.url.indexOf(Boligf.Config.ApiAccess()) > -1) {

				if (this.bearerTokenStorageService.anyToken()) {
	
					config.headers["Authorization"] = 'Bearer ' + this.bearerTokenStorageService.token;
					config.headers["ContentType"] = 'application/x-www-form-urlencoded';
				}
			}

			return config;
		};

		public requestError = (rejection: angular.IHttpPromiseCallback<any>): angular.IPromise<any> => {

			return this.$q.reject(rejection);
		};

		public responseError = (rejection: angular.IHttpPromiseCallbackArg<any>): angular.IPromise<any> => {

			if (rejection != null && rejection.status === 401 && this.bearerTokenStorageService.anyToken()) {

				this.bearerTokenStorageService.deleteToken();

				//this.$state.go(common.States); // TODO: Find a way to redirect here
			}

			return this.$q.reject(rejection);

		};
	}

	Boligf.App.service('IInterceptHttpProvider', Boligf.BearerTokenInterceptor);
} 