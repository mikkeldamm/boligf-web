module Boligf {
	
	export class AssociationController {

		static $inject = ['IAssociationMemberService'];
		
		constructor(
			private associationMemberService: IAssociationMemberService
			) {
			
		}
	}

	Boligf.App.controller("AssociationController", Boligf.AssociationController);
}