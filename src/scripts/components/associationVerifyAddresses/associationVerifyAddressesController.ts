module Boligf {
	
	export class AssociationVerifyAddressesController {

		static $inject = ['$state', 'IRegisterService', 'IAssociationService', 'IPassDataService', 'stateLoading'];
		
		selections: Selection[];
		
		constructor(
			private $state: angular.ui.IStateService,
			private registerService: IRegisterService,
			private associationService: IAssociationService,
			private dataPassingService: IPassData,
			private stateLoading: IStateLoading
		) {
			
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
			
			var addresses: BoligfAddress[] = [];
			
			for (var i = 0; i < this.selections.length; i++) {
				addresses = addresses.concat(this.selections[i].addresses);
			}
			
			this.stateLoading.start();
			
			this.associationService.postAddresses(this.registerService.associationId, addresses).then(() => {
				
				this.$state.go(States.Default.Home);
				
			}).finally(() => {
				
				this.dataPassingService.remove('selectionsOfAddresses');
				this.stateLoading.stop();
			});
		}
	}

	Boligf.App.controller("Association_VerifyAddressesController", Boligf.AssociationVerifyAddressesController);
}