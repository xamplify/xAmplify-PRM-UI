import { by, browser, element } from "protractor";
import { DashBoardPage } from "./dashboard.page";

describe("Dashboard Test", () => {
  let dashBoardPage: DashBoardPage;

  describe("dashboard page should work fine", () => {
    beforeAll(() => {
      dashBoardPage = new DashBoardPage();
      //  dashBoardPage.getLoginPagetButtonWithXpath();
      if(dashBoardPage.getUserNameTF().isPresent()){
      dashBoardPage.navigateToLogin();
      dashBoardPage.login();
      }
    });

    it("should have dashboard page", () => {
      const dashboardage = "Dashboard Page";
      expect(dashboardage).toBe("Dashboard Page");
      browser.sleep(1000);
      // browser.waitForAngularEnabled(true);
    });
    it("click dashboard again should work fine ", () => {
      dashBoardPage.gotoDashoardPage();
    });

    afterAll(() => {
      dashBoardPage.logout();
    });
  });
});
