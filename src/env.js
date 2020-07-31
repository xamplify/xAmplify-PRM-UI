(function (window) {
  window.__env = window.__env || {};

  // API url
/*  window.__env.apiUrl = 'https://xamplify.co/';*/

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  
  /*************Local*******************************/
 window.__env.CLIENT_URL = 'http://localhost:4200/'; // local client app server
 window.__env.SERVER_URL = 'http://localhost:8090/'; // xamplify backend production server
 window.__env.imagesHost = "https://release.xamp.io/vod/images/";
  
  
  //USE BELOW URLS FOR CLIENT AND SERVER CONNECTIONS
  /********************Production************************/
  //window.__env.CLIENT_URL = 'https://xamplify.io/', // xamplify client app server
  //window.__env.SERVER_URL = 'https://xamp.io/' // xamplify backend production server
  //window.__env.imagesHost = "https://xamp.io/vod/images/";

  
  /*********************QA**********************/
//  window.__env.CLIENT_URL = 'https://xamplify.co/';
 // window.__env.SERVER_URL =  'https://aravindu.com/';
 //  window.__env.imagesHost = "https://aravindu.com/vod/images/";

/*************************Release*******************************/	
 //window.__env.CLIENT_URL ="https://release.xamplify.io/", // release xamplify client app server
// window.__env.SERVER_URL =  "https://release.xamp.io/" // release xamplify backend production server
// window.__env.imagesHost = "https://release.xamp.io/vod/images/";

  
  
  window.__env.clientId = "6639d69f-523f-44ca-b809-a00daa26b367";
  window.__env.clientSecret = "XnD77klwAeUFvYS66CbHMd107DMS441Etg9cCOVc63LTYko8NHa";
  window.__env.vendorRoleHash = "xvendorrole";
  window.__env.partnerRoleHash = "xpartnerrole";

  //
  
  
  
  // Whether or not to enable debug mode
  window.__env.enableDebug = false;
}(this));