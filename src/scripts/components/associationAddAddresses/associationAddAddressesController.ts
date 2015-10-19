module Boligf {
	
	export class AssociationAddAddressesController {

		static $inject = [];
		
		selections: Selection[];
		
		constructor() {
			
			this.selections = [];
		} 
		
		onAddressesFound(selection: Selection): void {
			
			console.log(selection);
			this.selections.push(selection);
		}
		
		onMapCleaned(): void {
			
			this.selections = [];
		}
	}

	Boligf.App.controller("Association_AddAddressesController", Boligf.AssociationAddAddressesController);
}