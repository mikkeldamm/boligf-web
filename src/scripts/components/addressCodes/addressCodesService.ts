module Boligf {
	
	export interface IAddressCodesService {

	}

	export class AddressCodesService implements IAddressCodesService {

		static $inject = ['IApiService', 'IStoreAssociationData'];
		
		constructor(
			private apiService: IApiService,
			private associationDataStore: IStoreAssociationData
			) {
			
		}
	}

	Boligf.App.service("IAddressCodesService", Boligf.AddressCodesService);
} 