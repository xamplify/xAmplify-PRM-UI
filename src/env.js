(function (window) {
  window.__env = window.__env || {};

  // API url
/*  window.__env.apiUrl = 'https://xamplify.co/';*/

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.CLIENT_URL = 'http://localhost:4200/'; // local client app server
  window.__env.SERVER_URL = 'https://release.xamp.io/'; // xamplify backend production server
  
  //USE BELOW URLS FOR CLIENT AND SERVER CONNECTIONS
  
  //CLIENT_URL: 'https://xamplify.io/', // xamplify client app server
  // SERVER_URL: 'https://xamp.io/' // xamplify backend production server

  // CLIENT_URL: 'https://socialubuntu.com/', //socail ubuntu client app server
  // SERVER_URL: 'https://aravindu.com/' , // social ubuntu backend prodution testing

  // CLIENT_URL: "https://release.xamplify.io/", // release xamplify client app server
  // SERVER_URL: "https://xamplify.co/" // release xamplify backend production server

  
  
  window.__env.clientId = "6639d69f-523f-44ca-b809-a00daa26b367";
  window.__env.clientSecret = "XnD77klwAeUFvYS66CbHMd107DMS441Etg9cCOVc63LTYko8NHa";
  
  //un comment below code for socialubuntu server and comment for other servers
  window.__env.imagesHost = "https://aravindu.com/vod/images/";
  
  //un comment below code for release and xamplify server and comment for other servers
  //window.__env.imagesHost = "https://xamp.io/vod/images/";
  
  
  
  // Whether or not to enable debug mode
  window.__env.enableDebug = false;
}(this));