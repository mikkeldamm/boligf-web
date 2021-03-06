﻿module Boligf {

	export interface IMemberLoginInfoComponentScope extends angular.IScope {
		isProtected: boolean;
	}

	export interface IMemberLoginInfoDirective extends angular.IDirective {
		restrict: string;
		scope: any;
		controller: any;
		controllerAs: string;
		replace: boolean;
		link(scope: angular.IScope, element: JQuery, attributes: angular.IAttributes, controller: IMemberLoginInfoComponent): void;
	}

	export interface IMemberLoginInfoComponent {
		ready: boolean;
		streetName: string;
		no: string;
		floor: string;
		door: string;
		isFloorAndDoorAvailable: boolean;
		fillMemberInfo(): void;
		logout(): void;
	}

	export class MemberLoginInfoComponent implements IMemberLoginInfoComponent {

		public ready: boolean;
		public streetName: string;
		public no: string;
		public floor: string;
		public door: string;

		public get isFloorAndDoorAvailable(): boolean {

			if (this.no && this.floor) {
				return true;
			}

			return false;
		}

		static $inject = ['$state', 'IAssociationMemberService', 'IStoreUserData', 'IStoreAssociationData'];

		constructor(
			private state: angular.ui.IStateService,
			private associationMemberService: IAssociationMemberService,
			private userDataStore: IStoreUserData,
			private associationDataStore: IStoreAssociationData
			) {
			
		}

		public fillMemberInfo(): void {
			
			if (this.associationDataStore.associationId) {

				this.associationMemberService.setup(this.associationDataStore.associationId).getSingle(this.userDataStore.userId).then((member: IAssociationMember) => {

					this.streetName = member.address.streetAddress;
					this.no = member.address.no;
					this.floor = member.address.floor;
					this.door = member.address.door;

					this.ready = true;
				});
			}
		}
		
		public logout(): void {
			
			this.state.go(Boligf.States.Authentication.Logout);
		}
	}

	export function memberLoginInfoDirective(authenticationService: IAuthenticationService): angular.IDirective {
		
		function link(scope: IMemberLoginInfoComponentScope, element: JQuery, attributes: angular.IAttributes, controller: IMemberLoginInfoComponent): void {

			scope.$watch(
				() => {
					return authenticationService.isAuthenticated;
				},
				(newValue, oldValue) => {
					if (newValue) {
						controller.fillMemberInfo();
					} else {
						controller.ready = false;
					}
				}
			);
		}

		var directive = <IMemberLoginInfoDirective> {
			restrict: 'E',
			scope: {},
			replace: true,
			templateUrl: '/views/components/memberLoginInfo/memberLoginInfoComponent.html',
			controller: ['$state', 'IAssociationMemberService', 'IStoreUserData', 'IStoreAssociationData', Boligf.MemberLoginInfoComponent],
			controllerAs: "memberLoginInfoCtrl",
			link: link
		}

		return directive;
	}

	Boligf.App.directive("boligfMemberLoginInfo", ['IAuthenticationService', Boligf.memberLoginInfoDirective]);
} 