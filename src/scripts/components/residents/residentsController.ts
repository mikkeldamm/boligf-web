module Boligf {
	
	export class ResidentsController {

		static $inject = ['IResidentsService'];
		
		public addresses: any[];
		
		constructor(
			private residentsService: IResidentsService
		) {
			
			this.addresses = [];
			
			this.residentsService.get().then((addresses) => {
				
				this.groupAddresses(addresses);
			});
		}
		
		private groupAddresses(addresses: BoligfAddressWithResident[]) {
			
			var internalAddresses: { [street:string]: any } = {};
			
			for (var i = 0; i < addresses.length; i++) {
				
				var address = addresses[i];
				var addressName = address.streetAddress + " " + address.no;
				var addressNameKey = addressName.replace(/\s/g, '');
				var internalAddress = internalAddresses[addressNameKey]
				if (!internalAddress) {
					
					internalAddress = {
						fullAddress: address.fullAddress,
						street: addressName,
						units: []
					}
					
					internalAddresses[addressNameKey] = internalAddress;
				}
				
				internalAddress.units.push({
					fullAddress: address.fullAddress,
					floor: address.floor,
					door: address.door,
					residents: address.residents.length
				})
			}
			
			for (var a in internalAddresses) {
				this.addresses.push(internalAddresses[a]);
			}
		}
	}

	Boligf.App.controller("ResidentsController", Boligf.ResidentsController);
}