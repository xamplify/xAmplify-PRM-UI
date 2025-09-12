(function (window) {
	window.__env = window.__env || {};

	window.__env.domainName = "xamplify-prm";
	
	/*************Local*******************************/

	window.__env.CLIENT_URL = 'http://localhost:4200/'; 
	window.__env.SERVER_URL = 'http://localhost:8080/'; 
	window.__env.SCHEDULER_URL = window.__env.SERVER_URL;
	window.__env.imagesHost = "http://localhost:8000/images/";
	window.__env.PREVIEW_HOST = "http://localhost:5000/";

	/*********************Production**********************/

	// window.__env.CLIENT_URL = 'https://xamplify.co/';
	// window.__env.SERVER_URL =  'https://aravindu.com/';
	//window.__env.SCHEDULER_URL = window.__env.SERVER_URL; 
	// window.__env.imagesHost = window.__env.SERVER_URL+"/vod/images/";
	// window.__env.PREVIEW_HOST = window.__env.CLIENT_URL;


	/******Auto Reload Deployment Configurations */
	window.__env.reloadAfterDeployment = true;
	window.__env.reloadIntervalInMilliSeconds = 1000 * 60 * 1;//1 Minute
	window.__env.logoutAndReloadAfterDeployment = false;
	window.__env.versionFilePath = '../assets/config-files/version.json';
	window.__env.updatedVersionMessage = 'New Update Is Available';
	window.__env.loaderGif = 'assets/images/xamplify-icon.gif';

	// Whether or not to enable debug mode
	window.__env.enableDebug = false;


	/******Video Player******/
	window.__env.loadLatestVideoJsFiles = true;
	window.__env.loadLatestPipeLineApi = true;
	
	/***Contacts***/
	window.__env.isContactsVersion2ApiEnabled = true;

}(this));
