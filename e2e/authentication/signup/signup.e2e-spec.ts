import { by, browser, element } from "protractor";
import { signUpPage } from "../signup/sinup.page";
import { LoginPage } from "../login/login.page";

xdescribe("Signup Test Suite", () => {
  let signupPage: signUpPage;
  let logingPage: LoginPage;

  describe("signup test", () => {
    beforeAll(() => {
      signupPage = new signUpPage();
      logingPage = new LoginPage();
      signupPage.navigateTo();
     // browser.waitForAngularEnabled(true);
    //  signupPage.getSignUpButtonTF().click();
    });

    it("should have signup page", () => {
      browser.sleep(1000);
      browser.waitForAngularEnabled(false);
      signupPage.getFirstNameTF().sendKeys("sathish");
      signupPage.getLastNameTF().sendKeys("sathish");
      signupPage.getEmailTF().sendKeys("sathishkk1463@gmail.com");
      signupPage.getPasswordTF().sendKeys("Sathish@123");
      signupPage.getConfirmPasswordTF().sendKeys("Sathish@123");
      signupPage.getAgreeCheckBox().click();
      signupPage.getSignUpButtonTF().click();
      browser.waitForAngularEnabled(true);
      expect(logingPage.getMessageText()).toBe('Thanks for signing up! Please check your inbox for our account activation email.');
    });

    afterAll(()=>{
    });

  });
});
