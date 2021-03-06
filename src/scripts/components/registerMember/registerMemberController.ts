﻿module Boligf {
	
	export interface IAssociation {
		id: string;
		name: string;
		addresses: IAssociationAddress[];
	}

	export interface IRegisterMemberController {
		
		selectedOption: number;
		codeSearchStatus: number;
		user: IRegisterUser;
		addressRegistered: IRegisterUserToAddress;
		registerCode: string;
		getAddressByCode(): void;
		addNewAddress(): void;
		associationSelected(item: any): void;
		register(): void;
		setOption(option: number): void;
	}

	export class RegisterMemberController implements IRegisterMemberController {

		static $inject = ['$state', '$stateParams', 'IUserService', 'IAssociationAddressService', '$timeout'];
		
		selectedOption: number;
		codeSearchStatus: number;
		user: IRegisterUser;
		addressRegistered: IRegisterUserToAddress;
		registerCode: string;
		
		constructor(
			private $state: angular.ui.IStateService,
			private $stateParams: angular.ui.IStateParamsService,
			private userService: IUserService,
			private associationAddressService: IAssociationAddressService,
			private $timeout: angular.ITimeoutService
			) {
			
			this.selectedOption = -1;
			this.codeSearchStatus = -1;

			this.addressRegistered = <IRegisterUserToAddress> {};
			this.registerCode = this.$stateParams["code"];

			if (this.registerCode) {
				this.setOption(2);
			}
		}

		getAddressByCode(): void {

			this.codeSearchStatus = -1;

			if (this.registerCode.length >= 6) {

				this.codeSearchStatus = 0;

				/*
				this.$timeout(() => {

					var addressWithCode = <IAssociationAddressCode> {
						id: "adId1",
						associationId: "asId1",
						streetAddress: "Tranehaven",
						no: "48",
						floor: "2",
						door: "tv",
						zip: "2650",
						city: "Brøndby"
					};

					this.addressRegistered.addressId = addressWithCode.id;
					this.addressRegistered.associationId = addressWithCode.associationId;
					this.addressRegistered.associationName = "Skorpen A/B";
					this.addressRegistered.addressText = this.combineAddressInfoToText(addressWithCode);

					this.codeSearchStatus = 2;

				}, 4000);
				*/

				this.associationAddressService.getCode(this.registerCode).then((addressWithCode: IAssociationAddressCode) => {

					this.addressRegistered.addressId = addressWithCode.id;
					this.addressRegistered.associationId = addressWithCode.associationId;
				  	this.addressRegistered.associationName = "Skorpen A/B"; // TODO: Get association name from api result here
					this.addressRegistered.addressText = this.combineAddressInfoToText(addressWithCode);

					this.codeSearchStatus = 1;

				}).catch(() => {
					
					this.codeSearchStatus = 2;
				});
			}
		}

		addNewAddress(): void {

			this.registerCode = null;
			this.codeSearchStatus = -1;
			this.addressRegistered.addressId = null;
			this.addressRegistered.addressText = "";

			this.setOption(1);
		}

		associationSelected(item: IAssociation): void {
			
			this.addressRegistered.associationId = item.id;
			console.log(this.addressRegistered.associationId);
		}

		register(): void {
			
			debugger;

			this.userService.post(this.user).then((userId: string) => {

				this.addressRegistered.userId = userId;

				this.associationAddressService.post(this.addressRegistered).then(() => {

					this.$state.go(Boligf.States.Default.Home);

				}).catch(() => {

					this.userService.delete(userId).then((isDeleted: boolean) => {
						if (isDeleted) {

							console.log("user is deleted because association could not be created");
							this.$state.go(Boligf.States.Default.Home);
						}
					});
				});
			});
		}

		setOption(option: number): void {
			
			this.selectedOption = option;
		}

		private combineAddressInfoToText(addressInfo: IAssociationAddressCode): string {

			var text = addressInfo.streetAddress;

			if (addressInfo.no) {
				text += " " + addressInfo.no;
			}

			if (addressInfo.floor) {
				text += ", " + addressInfo.floor + ".";
			}
			if (addressInfo.door) {
				text += " " + addressInfo.door;
			}

			if (addressInfo.zip && addressInfo.city) {
				text += ", " + addressInfo.zip + " " + addressInfo.city;
			}

			return text;
		}
	}

	Boligf.App.controller("Association_RegisterMemberController", Boligf.RegisterMemberController);
} 