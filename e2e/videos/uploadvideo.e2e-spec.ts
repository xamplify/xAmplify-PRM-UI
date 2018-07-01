import { by, browser, element } from "protractor";
import { UploadVideoPage } from "./uploadvideo.page";

xdescribe("Upload Video Test ", () => {
  let uploadPage: UploadVideoPage;
  describe("Upload test", () => {
    beforeAll(() => {
      uploadPage = new UploadVideoPage();
      // loginPage.getLoginPageButton().click();
      uploadPage.login();
      // uploadPage.navigateToUpload();
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
