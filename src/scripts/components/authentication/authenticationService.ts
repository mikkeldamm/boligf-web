module Boligf {

	export interface IAuthenticationService {
		isAuthenticated: boolean;
		login(email: string, password: string): angular.IPromise<boolean>;
		logout(): void;
	}

	export class AuthenticationService implements IAuthenticationService {

		static $inject = ['$http', '$q', 'IStoreBearerToken', 'IStoreUserData', 'IStoreAssociationData'];

		private _isAuthenticated: boolean;

		public get isAuthenticated() {
			return this._isAuthenticated;
		}

		constructor(
			private $http: angular.IHttpService,
			private $q: angular.IQService,
			private bearerTokenStore: Boligf.IStoreBearerToken,
			private userDataStore: Boligf.IStoreUserData,
			private associationDataStore: Boligf.IStoreAssociationData
			) {

			if (this.bearerTokenStore.anyToken()) {
				this._isAuthenticated = true;
			} else {
				this._isAuthenticated = false;
			}
		}

		public login(email: string, password: string): angular.IPromise<boolean> {

			var defer = this.$q.defer();
			var data: string = "grant_type=password&username=" + email + "&password=" + password;

			this.$http.post(Boligf.Config.ApiAccess(true) + '/token', data).success((response: IAuthorizationResponse) => {
				
				this.bearerTokenStore.token = response.access_token;
				this.userDataStore.userId = response.userId;
				this.userDataStore.userName = response.userName;
				this.associationDataStore.associationId = response.associationId;
				this._isAuthenticated = true;

				defer.resolve(true);

			}).error((err, status)  => {

				defer.resolve(false);
			});

			return defer.promise;
		}
		
		public logout(): void {
			
			this.bearerTokenStore.deleteToken();
			this.userDataStore.clear();
			this.associationDataStore.clear();
			this._isAuthenticated = false;
		}
	}

	interface IAuthorizationResponse {
		".expires": string;
		".issued": string;
		access_token: string;
		expires_in: number;
		roles: any[];
		token_type: string;
		userId: string;
		userName: string;
		associationId: string;
	}

	Boligf.App.service("IAuthenticationService", Boligf.AuthenticationService);
} 