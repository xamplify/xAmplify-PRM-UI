(function (window) {
    window.__env = window.__env || {};

    // API url
    /*  window.__env.apiUrl = 'https://xamplify.co/';*/

    // Whether or not to enable debug mode
    // Setting this to false will disable console output

    /*************Local*******************************/
    window.__env.CLIENT_URL = 'http://localhost:4200/'; // local client app server
    window.__env.SERVER_URL = 'http://localhost:8090/'; // xamplify backend production server
    window.__env.imagesHost = "http://127.0.0.1:8887/images/";


    //USE BELOW URLS FOR CLIENT AND SERVER CONNECTIONS
    /********************Production************************/
    // window.__env.CLIENT_URL = 'https://xamplify.io/'; // xamplify client app server
    // window.__env.SERVER_URL = 'https://xamp.io/'; // xamplify backend production server
    // window.__env.imagesHost = "https://xamp.io/vod/images/";


    /*********************QA**********************/
    // window.__env.CLIENT_URL = 'https://xamplify.co/';
    //window.__env.SERVER_URL =  'https://aravindu.com/';
   //  window.__env.imagesHost = "https://aravindu.com/vod/images/";



    window.__env.clientId = "6639d69f-523f-44ca-b809-a00daa26b367";
    window.__env.clientSecret = "XnD77klwAeUFvYS66CbHMd107DMS441Etg9cCOVc63LTYko8NHa";
    window.__env.vendorRoleHash = "xvendorrole";
    window.__env.partnerRoleHash = "xpartnerrole";
    window.__env.captchaSiteKey = "6LfGfb0ZAAAAAEsdwjFHjpcssfxfCjMsZ8rL6gEQ";
    window.__env.beeTemplateQAClientId = "059b63c2-3a9b-4b8c-8a33-23b58422ba81";
    window.__env.beeTemplateQAClientSecret = "44NyVor7LZaHN3HsoVie1gdX2xSIrVlrqHPk4SDVNQQA7K6HG5YW";
    window.__env.beeHostApi = "https://rsrc.getbee.io/api/templates/m-bee";
    window.__env.beeRequestType = "GET";
    window.__env.beePageDevClientId = "5de3522e-acca-480c-ba53-1e85abdc1871";
    window.__env.beePageDevClientSecret = "YyZ9ysJLmJVAFjngC6Zbh85dKb0F9tgfRj52d1lBEjCdB7SLy3Y9";
    /**********Production*******/
    // window.__env.beePageProdClientId = "b9d3b05d-748e-4481-8fc0-63d375048332";
    // window.__env.beePageProdClientSecret = "xwd1V6IXGx6kNX0QZ1t5niB7CGUrO4SQW46Qs9j4LyvmHePwG5o1";

    window.__env.beePageProdClientId = "6639d69f-523f-44ca-b809-a00daa26b367";
    window.__env.beePageProdClientSecret = "XnD77klwAeUFvYS66CbHMd107DMS441Etg9cCOVc63LTYko8NHa";


    /******Auto Reload Deployment Configurations */
    window.__env.reloadAfterDeployment = true;
    window.__env.reloadIntervalInMilliSeconds = 1000 * 60 * 15;//15 Minutes
    window.__env.logoutAndReloadAfterDeployment = false;
    window.__env.versionFilePath = '../assets/config-files/version.json';
    window.__env.updatedVersionMessage = 'New Update Is Available';
    window.__env.loaderGif = 'assets/images/xamplify-icon.gif';

    // Whether or not to enable debug mode
    window.__env.enableDebug = false;
}(this));
