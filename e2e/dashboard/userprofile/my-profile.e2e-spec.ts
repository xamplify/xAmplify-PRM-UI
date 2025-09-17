import { by, browser, element } from "protractor";
import { MyProfilePage } from "./my-profile.po";

xdescribe("My profile Page Test", () => {
  let myProfilePage: MyProfilePage;

  describe("my profile page should work fine", () => {
    beforeAll(() => {
      myProfilePage = new MyProfilePage();
      myProfilePage.navigateToLogin();
      myProfilePage.login();
    });

    it("should able to go to my profile page ", () => {
      browser.sleep(1000);
      const uploadVideo = "my profile page";
      myProfilePage.getProfileDropdown();
      myProfilePage.myProfileLink();
      expect(uploadVideo).toEqual("my profile page");
      browser.sleep(1000);
    });

    it("should able to click all the tabs in my profile page ", () => {
      let page = 'click all tabs'
      browser.sleep(1000);
      myProfilePage.getChangePasswordTab();
      myProfilePage.getSettingsTab();
      if(myProfilePage.getDefaultsettingTab().isPresent()) { myProfilePage.getDefaultsettingTab().click();}
      myProfilePage.getPersonalInfoTab();
      expect(page).toEqual('click all tabs');
      browser.sleep(1000);
    });

    afterAll(() => {
       myProfilePage.logout();
    });
  });
});
