export class EnvService {

  // The values that are defined here are the default values that can
  // be overridden by env.js

  // API url

    
    /*********************QA**********************/
     CLIENT_URL= 'https://app.myapp.com/'; 
     SERVER_URL='https://api.myapp.com/'; 
     imagesHost = this.CLIENT_URL+"vod/images/";

    captchaSiteKey = "XXXXXXXXXXXXX";



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
  isContactsVersion2ApiEnabled = false;

  constructor() {
  }

}