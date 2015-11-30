module Boligf {
	
	export class AssociationAddAddressesController {

		static $inject = ['$state', '$stateParams', 'IRegisterService', 'IPassDataService'];
		
		centerLat: number;
		centerLng: number;
		selections: Selection[];
		
		constructor(
			private $state: angular.ui.IStateService,
			private $stateParams: angular.ui.IStateParamsService,
			private registerService: IRegisterService,
			private dataPassingService: IPassData) {
			
			if (!this.registerService.isReadyForAddAddresses) {
				this.$state.go(States.Association.Register);	
			}
			
			// TODO: If lat and lng is zero (0) then get pos from GEO
			this.centerLat = this.$stateParams["lat"];
			this.centerLng = this.$stateParams["lng"];
			
			this.selections = [];
			
			var savedSelections = this.dataPassingService.pull<Selection[]>("selectionsOfAddresses");
			if (savedSelections) {
				
				this.selections = savedSelections; // TODO: Show polygon on map
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