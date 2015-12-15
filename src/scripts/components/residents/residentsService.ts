module Boligf {

	export interface BoligfAddressWithResident extends BoligfAddress {
		residents: string[];
	}

	export interface IResidentsService {

		get(): angular.IPromise<BoligfAddressWithResident[]>;
	}

	export class ResidentsService implements IResidentsService {

		static $inject = ['IApiService', 'IStoreAssociationData'];
		
		constructor(
			private apiService: IApiService,
			private associationDataStore: IStoreAssociationData
			) {
			
		}
		
		get(): angular.IPromise<BoligfAddressWithResident[]> {
			
			return this.apiService.get<BoligfAddressWithResident[]>('/association/' + this.associationDataStore.associationId + '/address');
		}
	}

	Boligf.App.service("IResidentsService", Boligf.ResidentsService);
} 