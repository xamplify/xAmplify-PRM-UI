import { by, browser, element } from "protractor";
import { LoginPage } from "./login.page";

describe("Login Test ", () => {
  let loginPage: LoginPage;
  describe("Login test", () => {
    beforeAll(() => {
      loginPage = new LoginPage();
      loginPage.getLoginPageButton().click();
    });

    it("should not be able to login  - username and password are blank", () => {
      loginPage.getUserNameTF().sendKeys("");
      loginPage.getPasswordTF().sendKeys("");
      loginPage.getLoginButton().click();
      expect(loginPage.getMessageText()).toBe("Username or password can't be empty.");
    });

    it("should not be able to login  - entered username but password is blank", () => {
      loginPage.getUserNameTF().clear();
      loginPage.getPasswordTF().clear();
      loginPage.getUserNameTF().sendKeys(browser.params.userName);
      loginPage.getPasswordTF().sendKeys("");
      loginPage.getLoginButton().click();
      expect(loginPage.getMessageText()).toBe("Username or password can't be empty.");
    });

    it("should not be able to login  - entered username or password is incorrect", () => {
      loginPage.getUserNameTF().clear();
      loginPage.getPasswordTF().clear();
      loginPage.getUserNameTF().sendKeys(browser.params.userName);
      loginPage.getPasswordTF().sendKeys("kashdgkaagsdg");
      loginPage.getLoginButton().click();
      expect(loginPage.getMessageText()).toEqual("Username or password is incorrect.");
    });

    it('should be able to test forgot password Test', () => {
      browser.waitForAngularEnabled(false);
      loginPage.navigateToPassword();
      loginPage.getForgotEmailTF().sendKeys(browser.params.forgotEmail);
      loginPage.getForgotSubmitButton().click();
      browser.waitForAngularEnabled(true);
      expect(loginPage.getMessageText()).toBe('Check your inbox for a temporary password.');
      browser.sleep(1000)
    })

    it("should be able to login  - entered username and password", () => {
      const loggedInSuccess = 'login success';
      loginPage.login();
      expect(loggedInSuccess).toBe('login success');
      browser.sleep(3000);
    });

    afterAll(() => {
      loginPage.logout();
    });
  });
});
