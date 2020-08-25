export class EnvService {

  // The values that are defined here are the default values that can
  // be overridden by env.js

  // API url

 // CLIENT_URL = 'http://localhost:4200/'; // xamplify client app server
 // SERVER_URL = 'https://release.xamp.io/'; // xamplify backend production server
  //SERVER_URL = 'http://localhost:9090/'
  
    
    /*********************QA**********************/
     CLIENT_URL= 'https://socialubuntu.com/'; //socail ubuntu client app server
     SERVER_URL='https://aravindu.com/'; // social ubuntu backend prodution testing
     imagesHost = "https://aravindu.com/vod/images/";

  
  clientId = "6639d69f-523f-44ca-b809-a00daa26b367";
  clientSecret = "XnD77klwAeUFvYS66CbHMd107DMS441Etg9cCOVc63LTYko8NHa";

  vendorRoleHash = "";
  partnerRoleHash = "";

  captchaSiteKey = "6LfGfb0ZAAAAAEsdwjFHjpcssfxfCjMsZ8rL6gEQ";
  
  
  // Whether or not to enable debug mode
  public enableDebug = false;

  constructor() {
  }

}