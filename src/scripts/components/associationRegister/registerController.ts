module Boligf {
	
	export interface IRegisterController {

		association: IRegisterAssociation;
		register(): void;
		addressSelected(address: any): void;
	}

	export class RegisterController implements IRegisterController {

		static $inject = ['$rootScope', '$state', 'stateLoading', 'IRegisterService'];

		association: IRegisterAssociation;
		user: IRegisterUser;

		constructor(
			private $rootScope: IRootScope,
			private $state: ng.ui.IStateService,
			private stateLoading: IStateLoading,
			private registerService: IRegisterService
			) {
 
			this.association = <IRegisterAssociation>{};
		} 
		
		register(): void {
			
			this.stateLoading.start();
			
			this.registerService
				.registerUserWithAddress(this.user, this.association)
				.then(() => {
					this.$state.go(Boligf.States.Association.AddAddresses);
				})
				.catch(() => {
					this.$state.go(Boligf.States.Default.Home);
				})
				.finally(() => {
					this.stateLoading.stop();
				});
		}
		
		addressSelected(address: any): void {
			
			this.association.addressId = address.id;
			this.association.streetAddress = address.streetname;
			this.association.no = address.no;
			this.association.floor = address.floor;
			this.association.door = address.door;
			this.association.zip = address.zip;
			this.association.city = address.city;
		}
	}

	Boligf.App.controller("Association_RegisterController", Boligf.RegisterController);
} 