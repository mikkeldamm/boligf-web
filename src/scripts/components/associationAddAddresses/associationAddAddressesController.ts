module Boligf {
	
	export class AssociationAddAddressesController {

		static $inject = ['$state', 'IRegisterService', 'IPassDataService'];
		
		selections: Selection[];
		
		constructor(
			private $state: angular.ui.IStateService,
			private registerService: IRegisterService,
			private dataPassingService: IPassData) {
			
			if (!this.registerService.isReadyForAddAddresses) {
				this.$state.go(States.Association.Register);	
			}
			
			this.selections = [];
			
			var savedSelections = this.dataPassingService.pull<Selection[]>("selectionsOfAddresses");
			if (savedSelections) {
				
				this.selections = savedSelections;
			}
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