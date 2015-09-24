module Boligf {

	export interface IAutocompleteItem extends IAssociationAutocompleteResult {
		name: string;
	}

	export interface IAssociationAutocompleteResult {

	}
	
	export interface IAssociationAutocompleteComponentScope extends ng.IScope {
		searchQuery: any;
		showList: any;
		hideList: any;
	}

	export interface IAssociationAutocompleteDirective extends ng.IDirective {
		restrict: string;
		scope: any;
		controller: any;
		controllerAs: string;
		replace: boolean;
		link(scope: IAssociationAutocompleteComponentScope, element: JQuery, attributes: ng.IAttributes, controller: IAssociationAutocompleteComponent): void;
	}

	export interface IAssociationAutocompleteComponent {
		lookup();
		selectItem(item: IAutocompleteItem);
		itemSelected: any;
		items: any[];
		searchQuery: any;
		showList;
		hideList;
		getIndexToNextItem(): number;
		getIndexToPreviousItem(): number;
		selectCurrentItem(): void;
		resetCurrentIndex(): void;
		currentItemIndex: number;
	}

	export class AssociationAutocompleteComponent implements IAssociationAutocompleteComponent {

		public searchQuery: any;
		public items: any[];
		public shouldShowListBox: boolean;
		public listBoxTop: number;
		public currentItemIndex: number;
		
		showList: any;
		hideList: any;
		itemSelected: any;

		private timeoutPromise: ng.IPromise<any>;

		static $inject = ['$http', '$timeout'];

		constructor(private $http: ng.IHttpService, private $timeout: ng.ITimeoutService) {

			this.currentItemIndex = 0;
		}

		public lookup(): void {
			
			if (this.timeoutPromise) {
				this.$timeout.cancel(this.timeoutPromise);
			}

			if (!this.searchQuery || this.searchQuery.length <= 1) {
				this.hideList();
				return;
			}

			this.timeoutPromise = this.$timeout(() => {

				this.getItemsFromQuery();

			}, 250);
		}
		
		public getIndexToNextItem(): number {

			if (this.currentItemIndex === (this.items.length - 1)) {
				this.currentItemIndex = 0;
			} else {
				this.currentItemIndex += 1;
			}

			return this.currentItemIndex;
		}

		public getIndexToPreviousItem(): number {

			if (this.currentItemIndex <= 0) {
				this.currentItemIndex = (this.items.length - 1);
			} else {
				this.currentItemIndex -= 1;
			}

			return this.currentItemIndex;
		}

		public selectCurrentItem(): void {
			
			this.selectItem(this.items[this.currentItemIndex]);
		}

		public resetCurrentIndex(): void {

			this.currentItemIndex = 0;
		}

		public selectItem(item: IAutocompleteItem): void {
			
			this.searchQuery = item.name;
			this.itemSelected({ item: item });
			this.resetCurrentIndex();
			this.hideList();
		}

		private getItemsFromQuery() {
			
			//this.$http.get("/api/association/autocomplete/query/?q=" + this.searchQuery).then((a:any) => {

				var data: any = [
					{
						id: "a1",
						name: "Skorpen A/B",
						addresses: [
							{
								id: "ad1",
								streetAddress: "Nordre Fasanvej",
								no: "124A",
								floor: "3",
								door: "tv",
								zip: "2000",
								city: "Frederiksberg",
								fullAddress: "Nordre Fasanvej 124, 3.tv, 2000 Frederiksberg"
							},
							{
								id: "ad2",
								streetAddress: "Nordre Fasanvej",
								no: "124A",
								floor: "3",
								door: "th",
								zip: "2000",
								city: "Frederiksberg",
								fullAddress: "Nordre Fasanvej 124, 3.th, 2000 Frederiksberg"
							},
							{
								id: "ad3",
								streetAddress: "Nordre Fasanvej",
								no: "124A",
								floor: "2",
								door: "tv",
								zip: "2000",
								city: "Frederiksberg",
								fullAddress: "Nordre Fasanvej 124, 2.tv, 2000 Frederiksberg"
							},
							{
								id: "ad4",
								streetAddress: "Nordre Fasanvej",
								no: "124A",
								floor: "2",
								door: "th",
								zip: "2000",
								city: "Frederiksberg",
								fullAddress: "Nordre Fasanvej 124, 2.th, 2000 Frederiksberg"
							},
							{
								id: "ad3",
								streetAddress: "Nordre Fasanvej",
								no: "124A",
								floor: "1",
								door: "tv",
								zip: "2000",
								city: "Frederiksberg",
								fullAddress: "Nordre Fasanvej 124, 1.tv, 2000 Frederiksberg"
							}
						]
					},
					{
						id: "a2",
						name: "Bovest",
						addresses: [
							{
								id: "ad1",
								streetAddress: "Tranehaven",
								no: "48",
								floor: "1",
								door: "tv",
								zip: "2605",
								city: "Glostrup",
								fullAddress: "Tranehaven 48, 1.tv, 2605 Glostrup"
							},
							{
								id: "ad2",
								streetAddress: "Tranehaven",
								no: "48",
								floor: "1",
								door: "th",
								zip: "2605",
								city: "Glostrup",
								fullAddress: "Tranehaven 48, 1.th, 2605 Glostrup"
							},
							{
								id: "ad3",
								streetAddress: "Tranehaven",
								no: "48",
								floor: "1",
								door: "mf",
								zip: "2605",
								city: "Glostrup",
								fullAddress: "Tranehaven 48, 1.mf, 2605 Glostrup"
							}
						]
					},
					{
						id: "a3",
						name: "Damms boerf",
						addresses: [
							{
								id: "ad1",
								streetAddress: "DammHaven",
								no: "1",
								floor: "",
								door: "",
								zip: "2000",
								city: "Frederiksberg",
								fullAddress: "DammHaven 1, 2000 Frederiksberg"
							}
						]
					},
					{
						id: "a4",
						name: "Glens boerf",
						addresses: []
					}
				];

				this.items = data;
				this.showList();

			//}).catch((b) => {

				// Write here that the item cant be found
			//	console.log(b);
			//});
		}
	}

	export function associationAutocompleteDirective(): ng.IDirective {

		function link(scope: IAssociationAutocompleteComponentScope, element: JQuery, attributes: ng.IAttributes, controller: IAssociationAutocompleteComponent): void {

			var itemJustSelected: boolean = false;
			var inputElement = element.find('input');
			var listBox = element.find('.autocomplete-box');

			function markCurrentItem(index) {

				var items = listBox.find('li');

				items.removeClass('selected');

				var item = $(items[index]);
				
				item.addClass('selected');
			}

			function showList() {

				if (listBox.css('top') === "0px") {
					
					listBox.css('top', inputElement.outerHeight());
				}

				listBox.addClass('show');
				
				setTimeout(() => { markCurrentItem(controller.currentItemIndex); }, 100);
			}

			function hideList() {
				
				listBox.removeClass('show');
			}

			controller.showList = showList;
			controller.hideList = hideList;

			// Disable default browser autocomplete
			inputElement.attr('autocomplete', 'off');
			inputElement.off('focus').on('focus', () => {

				if (itemJustSelected) {
					itemJustSelected = false;
					return false;
				}

				controller.lookup();
			});

			// Bind arrow and tab events
			element.off('keyup').on('keyup', (e: JQueryEventObject) => {
				
				if (e.keyCode === 40) { // Down

					markCurrentItem(controller.getIndexToNextItem());

				} else if (e.keyCode === 38) { // Up

					markCurrentItem(controller.getIndexToPreviousItem());

				} else {

					if (itemJustSelected) {
						itemJustSelected = false;
						return false;
					}

					controller.resetCurrentIndex();
					controller.lookup();

					scope.$apply();
				}
			});

			element.off('keydown').on('keydown', (e: JQueryEventObject) => {
				
				if (e.keyCode === 9 || e.keyCode === 13) { // Tab & enter
					
					controller.selectCurrentItem();

					scope.$apply();

					itemJustSelected = true;
				}
			});
		}

		var directive = <IAssociationAutocompleteDirective> {
			restrict: 'E',
			scope: {
				searchQuery: "=ngModel",
				placeholder: "@",
				itemSelected: "&"
			},
			replace: true,
			bindToController: true,
			templateUrl: '/views/components/associationAutocomplete/associationAutocompleteComponent.html',
			controller: ['$http', '$timeout', Boligf.AssociationAutocompleteComponent],
			controllerAs: "autocompleteCtrl",
			link: link
		}

		return directive;
	}

	Boligf.App.directive("boligfAssociationAutocomplete", [Boligf.associationAutocompleteDirective]);
} 