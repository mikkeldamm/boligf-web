module Boligf {
	
	export class AssociationVerifyAddressesController {

		static $inject = ['$state', 'IRegisterService', 'IPassDataService'];
		
		selections: Selection[];
		
		constructor(
			private $state: angular.ui.IStateService,
			private registerService: IRegisterService,
			private dataPassingService: IPassData) {
			
			if (!this.registerService.isReadyForVerifyAddresses) {
				this.$state.go(States.Association.Register);	
			}
			
			this.selections = dataPassingService.pull<Selection[]>('selectionsOfAddresses', false);
		}
		
		removeAddress(selectionIndex: number, address: BoligfAddress): void {
			
			var addresses = this.selections[selectionIndex].addresses;
			var addressToRemoveIndex = 0;
			
			for (var i = 0; i < addresses.length; i++) {
				if (addresses[i].id == address.id) {
					addressToRemoveIndex = i;
				}
			}
			
			this.selections[selectionIndex].addresses.splice(addressToRemoveIndex, 1);
		}
		
		addAddresses(): void {
			
			// use service here and call api to insert addresses
		}
	}

	Boligf.App.controller("Association_VerifyAddressesController", Boligf.AssociationVerifyAddressesController);
}