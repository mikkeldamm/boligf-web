module Boligf {
	
	export class AssociationVerifyAddressesController {

		static $inject = ['IPassDataService'];
		
		selections: Selection[];
		
		constructor(private dataPassingService: IPassDataService) {
			
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