import { by, browser, element } from "protractor";
import { UploadVideoPage } from "./uploadvideo.page";
var path = require('path');

describe("Upload Video Test ", () => {
  let uploadPage: UploadVideoPage;
  describe("Upload test", () => {
    beforeAll(() => {
      uploadPage = new UploadVideoPage();
      // loginPage.getLoginPageButton().click();
      // uploadPage.navigateToUpload();
     // uploadPage.getLoginPagetButtonWithXpath();
      browser.waitForAngularEnabled(false);
      if(uploadPage.getUserNameTF().isPresent()){
      uploadPage.navigateToLogin();
      uploadPage.login();
      }
    });

    it("should able to go to upload video page ", () => {
      browser.sleep(1000);
      const uploadVideo = "upload video";
      uploadPage.clickOnVideos();
      uploadPage.clickOnUploadVideos();
      expect(uploadVideo).toEqual("upload video");
    });

    it("should able to open camera and close ", () => {
      const uploadVideo = "upload camera video";
      uploadPage.getCameraButton();
      browser.sleep(1000)
      uploadPage.closeCmera();
      expect(uploadVideo).toEqual("upload camera video");
    });

    it('should upload file', ()=> {
      const fileToUpload = '../VideoFile/flightVideos.mp4';
      const absolutePath = path.resolve(__dirname, fileToUpload);
      element.all(by.css('input[type="file"]')).sendKeys(absolutePath);
      browser.sleep(1000);
      uploadPage.getUploadButton();
      browser.sleep(5000);
    });

    afterAll(() => {
      uploadPage.logout();
    });
  });
});
