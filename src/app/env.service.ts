export class EnvService {

  // The values that are defined here are the default values that can
  // be overridden by env.js

  // API url

 // CLIENT_URL = 'http://localhost:4200/'; // xamplify client app server
 // SERVER_URL = 'https://release.xamp.io/'; // xamplify backend production server
  //SERVER_URL = 'http://localhost:9090/'
  
    
    /*********************QA**********************/
     CLIENT_URL= 'https://xamplify.co/'; //socail ubuntu client app server
     SERVER_URL='https://aravindu.com/'; // social ubuntu backend prodution testing
     imagesHost = "https://aravindu.com/vod/images/";
     PREVIEW_HOST = "https://assets.xamplify.io/";

  
  clientId = "";
  clientSecret = "";

  beeTemplateDevClientId = "";
  beeTemplateDevClientSecret = "";

  beeTemplateQAClientId = "";
  beeTemplateQAClientSecret = "";

  beeTemplateReleaseClientId = "";
  beeTemplateReleaseClientSecret = "";

  vendorRoleHash = "";
  partnerRoleHash = "";

  captchaSiteKey = "6LfGfb0ZAAAAAEsdwjFHjpcssfxfCjMsZ8rL6gEQ";
  beeHostApi = "";
  beeRequestType = "GET";

  /*****Bee Page Credentials */
  beePageDevClientId = "";
  beePageDevClientSecret = "";

  beePageQAClientId = "";
  beePageQAClientSecret = "";

  beePageProdClientId = "";
  beePageProdClientSecret = "";

  beePageReleaseClientId = "";
  beePageReleaseClientSecret = "";


  /******Auto Reload Configurations */
  reloadAfterDeployment = false;
  reloadIntervalInMilliSeconds = 1000 *60*5;//5 Minutes
  logoutAndReloadAfterDeployment = false;
  versionFilePath = '../assets/config-files/version.json';
  updatedVersionMessage = 'New Update Is Available';
  loaderGif = "";
  
  // Whether or not to enable debug mode
  public enableDebug = false;
  /****XNFR-224****/
  domainName = window.location.hostname;

  // XNFR-256
  microsoftQAClientId = "";
  microsoftQAClientSecret = "";
  microsoftProdClientId = "";
  microsoftProdClientSecret = "";
  microsoftDevClientId = "";
  microsoftDevClientSecret = "";

  loadLatestVideoJsFiles = false;
  xamplifyCustomerSupportContactNumber= "";

  loadLatestPipeLineApi = true;

  constructor() {
  }

}