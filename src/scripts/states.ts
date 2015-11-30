﻿module Boligf.States {

	export class Default {

		static Home: string = "home";
		static News: string = "news";
		static Documents: string = "documents";
		static Board: string = "board";
		static Residents: string = "residents";
	}

	export class Authentication {

		static Base: string = "authentication";
		static Login: string = "authentication.login";
		static Logout: string = "authentication.logout";
		static UnAuthorized: string = "authentication.unauthorized";
	}

	export class Association {

		static Base: string = "association";
		static Register: string = "association.register";
		static RegisterMember: string = "association.registermember";
		static AddAddresses: string = "association.addaddresses";
		static VerifyAddresses: string = "association.verifyaddresses";
	}

	export class Errors {

		static E404: string = "404";
		static E403: string = "403";
	}
} 