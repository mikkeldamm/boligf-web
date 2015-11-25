module Boligf {

	export interface IRegisterAssociation {

		name: string;
		addressId: string;
		streetAddress: string;
		streetAddressAutoComplete: string;
		no: string;
		floor: string;
		door: string;
		zip: string;
		city: string;
		userId: string;
	}

	export interface IAssociationService {

		post(model: IRegisterAssociation): angular.IPromise<string>;
		postAddresses(associationId: string, addresses: BoligfAddress[]): angular.IPromise<string>;
	}

	export class AssociationService implements IAssociationService {

		static $inject = ['IApiService'];
		
		constructor(
			private apiService: IApiService
			) {
			
		}

		post(model: IRegisterAssociation): angular.IPromise<string> {

			return this.apiService.post<string>("/association", model);
		}
		
		postAddresses(associationId: string, addresses: BoligfAddress[]): angular.IPromise<string> {
			
			return this.apiService.post<string>("/association/" + associationId + "/address", addresses);
		}
	}

	Boligf.App.service("IAssociationService", Boligf.AssociationService);
} 