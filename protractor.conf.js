// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require("jasmine-spec-reporter");
var Jasmine2HtmlReporter = require("protractor-jasmine2-html-reporter");

exports.config = {
  allScriptsTimeout: 11000,
  specs: ["./e2e/**/*.e2e-spec.ts"],
  capabilities: {
    browserName: "chrome"
  },
  directConnect: true,
  baseUrl: "http://localhost:4200/",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 80000,
    print: function() {}
  },
  beforeLaunch: function() {
    require("ts-node").register({
      project: "e2e/tsconfig.e2e.json"
    });
  },
  onPrepare() {
    jasmine.getEnv().addReporter(
      new SpecReporter({ spec: { displayStacktrace: true } })
      //  new Jasmine2HtmlReporter({ savePath: './results/', screenshotsFolder: 'images',})
    );
    browser
      .manage()
      .window()
      .setSize(1600, 1000);
  },
  params: {
    userName: "ksathish@stratapps.com", // vendor with partner
    // userName: "sathish7chary@gmail.com", partner account
    password: "Sathish@123",
    forgotEmail: "sathishcharykotha@gmail.com"
  }
};
