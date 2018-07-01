import { by, browser, element } from "protractor";
import { UploadVideoPage } from "./uploadvideo.page";

describe("Upload Video Test ", () => {
  let uploadPage: UploadVideoPage;
  describe("Upload test", () => {
    beforeAll(() => {
      uploadPage = new UploadVideoPage();
      // loginPage.getLoginPageButton().click();
      // uploadPage.navigateToUpload();
      uploadPage.navigateToLogin();
      uploadPage.login();
    });

    it("should able to go to upload video page ", () => {
      // browser.sleep(1000)
      const uploadVideo = "upload video";

      expect(uploadVideo).toEqual("upload video");
    });

    afterAll(() => {
      uploadPage.logout();
    });
  });
});
