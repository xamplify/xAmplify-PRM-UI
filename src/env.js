(function (window) {
	window.__env = window.__env || {};

	window.__env.domainName = "";
	
	/*************Local*******************************/

	window.__env.CLIENT_URL = 'http://localhost:4200/'; 
	window.__env.SERVER_URL = 'http://localhost:8090/'; 
	window.__env.SCHEDULER_URL = window.__env.SERVER_URL;
	window.__env.imagesHost = "http://localhost:8000/images/";
	window.__env.PREVIEW_HOST = "http://localhost:5000/";

	/*********************QA**********************/

	// window.__env.CLIENT_URL = 'https://xamplify.co/';
	// window.__env.SERVER_URL =  'https://aravindu.com/';
	//window.__env.SCHEDULER_URL = window.__env.SERVER_URL; 
	// window.__env.imagesHost = "https://aravindu.com/vod/images/";
	// window.__env.PREVIEW_HOST = "https://assets.xamplify.co/";


	/********************Production************************/
	// window.__env.CLIENT_URL = 'https://xamplify.io/'; 
	// window.__env.SERVER_URL = 'https://xamp.io/'; 
	//window.__env.SCHEDULER_URL = 'https://scheduler.xamp.io/';
	// window.__env.imagesHost = "https://xamp.io/vod/images/";
	// window.__env.PREVIEW_HOST ="https://assets.xamplify.io/";

	

	/*********************Release**********************/
	//window.__env.CLIENT_URL = 'https://xtremand.com/';
	//window.__env.SERVER_URL =  'https://release.xamp.io/';
	//window.__env.SCHEDULER_URL = 'https://release.xamp.io/';
	//window.__env.imagesHost = "https://assets.xamplify.co/";

	/**********UI******************/
	//window.__env.CLIENT_URL = 'https://x-amplify.com/';
	//window.__env.SERVER_URL =  'https://aravindu.com/';
	//window.__env.imagesHost = "https://aravindu.com/vod/images/";

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
