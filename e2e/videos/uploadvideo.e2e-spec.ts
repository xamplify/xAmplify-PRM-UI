import { by, browser, element } from "protractor";
import { UploadVideoPage } from "./uploadvideo.page";

describe("Upload Video Test ", () => {
  let uploadPage: UploadVideoPage;
  describe("Upload test", () => {
    beforeAll(() => {
      uploadPage = new UploadVideoPage();
      // loginPage.getLoginPageButton().click();
      // uploadPage.navigateToUpload();
     // uploadPage.getLoginPagetButtonWithXpath();
      uploadPage.navigateToLogin();
      uploadPage.login();
    });

    it("should able to go to upload video page ", () => {
      browser.sleep(1000)
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
    afterAll(() => {
      uploadPage.logout();
    });
  });
});
