module Boligf {
	
	export interface IPassDataService {
		push<T>(key: string, data: T): void;
		pull<T>(key: string): T;
		pull<T>(key: string, remove: boolean): T;
	}

	export class DataPassingService implements IPassDataService {

		static $inject = [];
		
		private dataCollection = {};

		constructor() {
			
		}

		push<T>(key: string, data: T): void {
			
			this.dataCollection[key] = data;
		}
		
		pull<T>(key: string, remove: boolean = true): T {
			
			var data = this.dataCollection[key];
			
			if (remove) 
			{
				delete this.dataCollection[key];
			}
			
			return <T>data;
		}
	}

	Boligf.App.service("IPassDataService", Boligf.DataPassingService);
} 