import { by, browser, element } from "protractor";
import { ManageVideoPage } from "./manage-video.page";
import { UploadVideoPage } from "../upload-video/uploadvideo.page";

describe("Manage Video Test ", () => {
  let manageVideosPage: ManageVideoPage;
  let uploadVideoPage: UploadVideoPage;
  describe("Manage Video test", () => {
    beforeAll(() => {
      manageVideosPage = new ManageVideoPage();
      uploadVideoPage = new UploadVideoPage();
      browser.waitForAngularEnabled(false);
      if(manageVideosPage.getUserNameTF().isPresent()){
        manageVideosPage.navigateToLogin();
        manageVideosPage.login();
      }
    });

    it("should able to go to Manage videos page ", () => {
      browser.sleep(1000);
      const manageVideos = "manage videos page";
      uploadVideoPage.clickOnVideos();
      manageVideosPage.clickOnManageVideos();
      expect(manageVideos).toEqual("manage videos page");
    });

    it("should able to go to play video page and play the video ", () => {
      browser.sleep(1000);
      const manageVideos = "play Video page";
      manageVideosPage.playVideo();
      expect(manageVideos).toEqual("play Video page");
      browser.sleep(5000);
    });

    it("should able to perform embed video action in play videos page ", () => {
      browser.sleep(1000);
      manageVideosPage.getEmbedVideoActions();
      browser.sleep(2000);
    });

    it("should able to go to manageVideos ", () => {
      browser.sleep(1000);
      manageVideosPage.gotoManageVideos();
    });


    afterAll(() => {
      manageVideosPage.logout();
    });
  });
});
