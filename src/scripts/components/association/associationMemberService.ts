﻿module Boligf {

	export interface IAssociationMember {
		id: string;
		email: string;
		address: IAssociationAddress;
	}

	export interface IAssociationAddress {
		id: string;
		streetAddress: string;
		no: string;
		floor: string;
		door: string;
		zip: string;
		city: string;
		country: string;
		fullAddress: string;
	}

	export interface IAssociationMemberService {

		setup(associationId: string);
		getAll(associationId?: string): angular.IPromise<IAssociationMember[]>;
		getSingle(userId: string, associationId?: string): angular.IPromise<IAssociationMember>;
	}

	export class AssociationMemberService implements IAssociationMemberService {

		static $inject = ['IApiService'];
		
		private associationId: string;

		constructor(
			private apiService: IApiService
			) {
			
		}

		setup(associationId: string): IAssociationMemberService {

			this.associationId = associationId;
			return this;
		}

		getAll(): angular.IPromise<IAssociationMember[]> {

			this.ensureSetup();
			return this.apiService.get<IAssociationMember[]>(this.getUrlString(this.associationId));
		}

		getSingle(userId: string): angular.IPromise<IAssociationMember> {

			this.ensureSetup();
			return this.apiService.get<IAssociationMember>(this.getUrlString(this.associationId, userId));
		}

		private ensureSetup() {

			if (!this.associationId) {
				throw new Error("setup is not called with 'associationId', before REST calls");
			}
		}

		private getUrlString(associationId: string, userId?: string): string {

			return "/association/" + associationId + "/user/" + (userId ? userId : "");
		}
	}

	Boligf.App.service("IAssociationMemberService", Boligf.AssociationMemberService);
} 