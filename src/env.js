(function (window) {
	window.__env = window.__env || {};

	// API url
	/*  window.__env.apiUrl = 'https://xamplify.co/';*/

	// Whether or not to enable debug mode
	// Setting this to false will disable console output
	/*************Local*******************************/

	//window.__env.CLIENT_URL = 'http://localhost:4200/'; // local client app server
	//window.__env.SERVER_URL = 'http://localhost:8090/'; // xamplify backend production server
//	window.__env.imagesHost = "http://localhost:8000/images/";
	window.__env.domainName = "";

	
	//USE BELOW URLS FOR CLIENT AND SERVER CONNECTIONS
	/********************Production************************/
	// window.__env.CLIENT_URL = 'https://xamplify.io/'; // xamplify client app server
	// window.__env.SERVER_URL = 'https://xamp.io/'; // xamplify backend production server
	// window.__env.imagesHost = "https://xamp.io/vod/images/";

	/*********************QA**********************/
	 window.__env.CLIENT_URL = 'https://xamplify.co/';
	 window.__env.SERVER_URL =  'https://aravindu.com/';
	 window.__env.imagesHost = "https://aravindu.com/vod/images/";


	/*********************Release**********************/
	// window.__env.CLIENT_URL = 'https://xtremand.com/';
	// window.__env.SERVER_URL =  'https://release.xamp.io/';
	//  window.__env.imagesHost = "https://release.xamp.io/vod/images/";

	/**********UI******************/
	// window.__env.CLIENT_URL = 'https://x-amplify.com/';
	// window.__env.SERVER_URL =  'https://aravindu.com/';
	//  window.__env.imagesHost = "https://aravindu.com/vod/images/";

	window.__env.clientId = "6639d69f-523f-44ca-b809-a00daa26b367";
	window.__env.clientSecret = "XnD77klwAeUFvYS66CbHMd107DMS441Etg9cCOVc63LTYko8NHa";
	window.__env.vendorRoleHash = "xvendorrole";
	window.__env.partnerRoleHash = "xpartnerrole";
	window.__env.captchaSiteKey = "6LfGfb0ZAAAAAEsdwjFHjpcssfxfCjMsZ8rL6gEQ";
	window.__env.beeTemplateDevClientId = "5e0bc033-795a-4490-840c-ba651e3a5e8d";
	window.__env.beeTemplateDevClientSecret = "jxQSDUiTqkXjrcEQwaQahk94yBGZZXV94w3KT0VIwZf4JHzJz7ID";
	window.__env.beeTemplateQAClientId = "059b63c2-3a9b-4b8c-8a33-23b58422ba81";
	window.__env.beeTemplateQAClientSecret = "44NyVor7LZaHN3HsoVie1gdX2xSIrVlrqHPk4SDVNQQA7K6HG5YW";
	window.__env.beeTemplateReleaseClientId = "a7ba7746-6419-48c2-b713-88cbe57bd67a";
	window.__env.beeTemplateReleaseClientSecret = "ToUJP4pRWKvErKNFqgnlfuYN8YvTKkALhuy4fPoYsf6VY7I592T2";
	window.__env.beeHostApi = "https://rsrc.getbee.io/api/templates/m-bee";
	window.__env.beeRequestType = "GET";
	window.__env.beePageDevClientId = "4fe8c2d7-9235-42e0-a269-0aef0f0484e9";
	window.__env.beePageDevClientSecret = "NBQ1g5nOhDSlxNpf2557awmE0XZ9YAdu6ZQS4oEG8dpoY7WCUWkl";
	window.__env.beePageQAClientId = "5de3522e-acca-480c-ba53-1e85abdc1871";
	window.__env.beePageQAClientSecret = "YyZ9ysJLmJVAFjngC6Zbh85dKb0F9tgfRj52d1lBEjCdB7SLy3Y9";
	window.__env.beePageReleaseClientId = "da58c238-fd21-44ab-94ec-f52192c9e1a3";
	window.__env.beePageReleaseClientSecret = "WeP5O5oKaF3P0oVNyHtOKgrYNd8co9FhYb3ZEsxLbgMSdI3ZwpqP";
	/**********Production*******/
	// window.__env.beePageProdClientId = "b9d3b05d-748e-4481-8fc0-63d375048332";
	// window.__env.beePageProdClientSecret = "xwd1V6IXGx6kNX0QZ1t5niB7CGUrO4SQW46Qs9j4LyvmHePwG5o1";
	window.__env.beePageProdClientId = "6639d69f-523f-44ca-b809-a00daa26b367";
	window.__env.beePageProdClientSecret = "XnD77klwAeUFvYS66CbHMd107DMS441Etg9cCOVc63LTYko8NHa";

	/******Auto Reload Deployment Configurations */
	window.__env.reloadAfterDeployment = true;
	window.__env.reloadIntervalInMilliSeconds = 1000 * 60 * 1;//1 Minute
	window.__env.logoutAndReloadAfterDeployment = false;
	window.__env.versionFilePath = '../assets/config-files/version.json';
	window.__env.updatedVersionMessage = 'New Update Is Available';
	window.__env.loaderGif = 'assets/images/xamplify-icon.gif';

	// Whether or not to enable debug mode
	window.__env.enableDebug = false;

	/****Microsoft ******/
	window.__env.microsoftQAClientId = "613ac844-3e95-4db2-b520-93baae0fc02c";
	window.__env.microsoftQAClientSecret = "xY87Q~SJ86CtE5fpChyqp1rfKrnVjLxlnRMFY";
	window.__env.microsoftProdClientId = "7f723bc5-b47e-4bc4-9c07-db9d1fdcb38d";
	window.__env.microsoftProdClientSecret = "auh8Q~4-BZNl8RAOHdx1DNZ-5Zq8vfI9VEKCdbiz";
	window.__env.microsoftDevClientId = "f4598ddb-daaf-48a5-be86-74b80d791f05";
	window.__env.microsoftDevClientSecret = "Tns7Q~OdMWU3GaIsSmdFS-_-PSNdFcSuiV~Tj";
	window.__env.xamplifyCustomerSupportContactNumber = "+1 510.660.6089";

	/******Video Player******/
	window.__env.loadLatestVideoJsFiles = true;

}(this));
