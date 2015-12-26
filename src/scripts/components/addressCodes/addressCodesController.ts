module Boligf {
	
	export class AddressCodesController {

		static $inject = ['IAddressCodesService'];
		
		constructor(
			private addressCodesService: IAddressCodesService
		) {
			
			
		}
	}

	Boligf.App.controller("AddressCodesController", Boligf.AddressCodesController);
}