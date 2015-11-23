module Boligf {

	export interface AssociationRegisterViewModel extends IRegisterAssociation {
		id: string;
	}
	export interface UserRegisterViewModel extends IRegisterUser {
		id: string;
	}

	export interface IRegisterService {
		isReadyForAddAddresses: boolean;
		isReadyForVerifyAddresses: boolean;
		registerUserWithAddress(user: IRegisterUser, association: IRegisterAssociation): angular.IPromise<void>;
	}

	export class RegisterService implements IRegisterService {

		static $inject = ['$q', '$http', 'localStorageService', 'IUserService', 'IAssociationService'];

		constructor(
			private $q: angular.IQService,
			private $http: angular.IHttpService,
			private localStorageService: angular.local.storage.ILocalStorageService,
			private userService: IUserService,
			private associationService: IAssociationService
		) {
			
		}
		
		public get isReadyForAddAddresses() {
			
			// TODO: Remove! its only for testings
			return true;
			
			var data = this.getAssociationFromStorage();
			if (data && data.id !== "" && data.id !== undefined && data.id !== null) {
				return true;
			}
			
			return false;
		}
		
		public get isReadyForVerifyAddresses() {
			
			return true;
		}
		
		registerUserWithAddress(user: IRegisterUser, association: IRegisterAssociation) {

			var defer = this.$q.defer<any>();
			
			var internalUser = user as UserRegisterViewModel;
			var internalAssociation = association as AssociationRegisterViewModel;

			this.userService.post(user).then((userId: string) => {

				internalUser.id = userId;
				internalAssociation.userId = userId;
				
				this.associationService.post(internalAssociation).then((associationId: string) => {
					
					internalAssociation.id = associationId;
					
					var url = "https://dawa.aws.dk/adresser?id=" + internalAssociation.addressId;
			
					this.$http.get(url).then((result: any) => {
						
						var lat = 0;
						var lng = 0;
						
						result.data.forEach((address: DawaAddress) => {
							
							lat = address.adgangsadresse.adgangspunkt.koordinater[1];
							lng = address.adgangsadresse.adgangspunkt.koordinater[0];
						});
						
						this.saveRegisteredUser(internalUser);
						this.saveRegisteredAssociation(internalAssociation);
						
						defer.resolve([lat, lng]);
		
					}).catch((b) => {
						
						this.saveRegisteredUser(internalUser);
						this.saveRegisteredAssociation(internalAssociation);
						
						defer.resolve([0, 0]);
					});

				}).catch(() => {

					this.userService.delete(userId).then((isDeleted:boolean) => {
						if (isDeleted) {
							
							defer.reject();
						}
					});
				});
			});
			
			return defer.promise;
		}
		
		private saveRegisteredUser(user: UserRegisterViewModel) {
			this.localStorageService.set("register_user", user);
		}
		
		private saveRegisteredAssociation(assocation: AssociationRegisterViewModel) {
			this.localStorageService.set("register_association", assocation);
		}
		
		private getAssociationFromStorage(): AssociationRegisterViewModel {
			
			return this.localStorageService.get<AssociationRegisterViewModel>("register_association");
		}
	}

	Boligf.App.service('IRegisterService', Boligf.RegisterService);
} 