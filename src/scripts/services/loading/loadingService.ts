module Boligf {
	
	export interface IStateLoading {
		start(): void;
		stop(): void;
	}

	export class StageLoadingControl implements IStateLoading {

		static $inject = ['$rootScope'];

		constructor(
			private $rootScope: IRootScope
			) {

		}

		start(): void {

			this.$rootScope.isLoading = true;		
		}
		
		stop(): void {

			this.$rootScope.isLoading = false;		
		}
	}

	Boligf.App.service("stateLoading", Boligf.StageLoadingControl);
} 