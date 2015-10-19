module Boligf {
	
	export class AssociationAddAddressesController {

		static $inject = ['IPassDataService'];
		
		selections: Selection[];
		
		constructor(private dataPassingService: IPassDataService) {
			
			this.selections = [];
		}
		
		onAddressesFound(selection: Selection): void {
			
			this.selections.push(selection);
			
			this.dataPassingService.push("selectionsOfAddresses", this.selections);
		}
		
		onMapCleaned(): void {
			
			this.selections = []; 
		}
	}

	Boligf.App.controller("Association_AddAddressesController", Boligf.AssociationAddAddressesController);
}