module Boligf {
	
	export interface IPassData {
		push<T>(key: string, data: T): void;
		pull<T>(key: string): T;
		pull<T>(key: string, remove: boolean): T;
		remove(key: string): void;
	}
	

	export class DataPassingService implements IPassData {

		static $inject = ['localStorageService'];
		
		private dataCollection = {};

		constructor(private localStorageService: angular.local.storage.ILocalStorageService) {
			
		}

		push<T>(key: string, data: T): void {
			
			this.localStorageService.set("boligf_" + key, data);
			
			this.dataCollection[key] = data;
		}
		
		pull<T>(key: string, remove: boolean = true): T {
			
			var data = this.localStorageService.get<T>("boligf_" + key);
			
			if (remove) 
			{
				this.localStorageService.remove("boligf_" + key)
			}
			
			return <T>data;
		}
		
		remove(key: string): void {
			
			this.localStorageService.remove("boligf_" + key)
		}
	}

	Boligf.App.service("IPassDataService", Boligf.DataPassingService);
} 