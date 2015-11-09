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
		registerUserWithAddress(user: IRegisterUser, association: IRegisterAssociation): ng.IPromise<void>;
	}

	export class RegisterService implements IRegisterService {

		static $inject = ['$q', 'localStorageService', 'IUserService', 'IAssociationService'];

		constructor(
			private $q: ng.IQService,
			private localStorageService: ng.local.storage.ILocalStorageService,
			private userService: IUserService,
			private associationService: IAssociationService
		) {
			
		}
		
		public get isReadyForAddAddresses() {
			
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

			var defer = this.$q.defer<void>();
			
			var internalUser = user as UserRegisterViewModel;
			var internalAssociation = association as AssociationRegisterViewModel;

			this.userService.post(user).then((userId: string) => {

				internalUser.id = userId;
				internalAssociation.userId = userId;
				
				this.associationService.post(internalAssociation).then((associationId: string) => {
					
					internalAssociation.id = associationId;
					
					this.localStorageService.set("register_user", internalUser);
					this.localStorageService.set("register_association", internalAssociation);
					
					defer.resolve();

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
		
		private getAssociationFromStorage(): AssociationRegisterViewModel {
			
			return this.localStorageService.get<AssociationRegisterViewModel>("register_association");
		}
	}

	Boligf.App.service('IRegisterService', Boligf.RegisterService);
} 