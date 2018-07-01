import { element, browser, by, Key } from "protractor";
import { BasePage } from "../../app.po";

export class signUpPage extends BasePage {
  navigateTo() {
    return browser.get("/signup");
  }
  navigateToLogin(){
    return browser.get("/login");
  }
  getFirstNameTF() {
    browser.waitForAngularEnabled(false);
    return element(by.css(".firstNameTF"));
  }
  getLastNameTF() {
    return element(by.css(".lastNameTF"));
  }
  getEmailTF() {
    return element(by.css(".emailTF"));
  }
  getPasswordTF() {
    return element(by.css(".passwordTF"));
  }
  getConfirmPasswordTF() {
    return element(by.css(".confirmPasswordTF"));
  }
  getAgreeCheckBox(){
    return element(by.xpath('/html/body/app-root/app-signup/div/div/div[2]/form/div[6]/label/input'));
  }
  getSignUpButtonTF() {
    return element(by.xpath('//*[@id="register-submit-btn"]'));
  }
  getSignUpMessage(){
    return element(by.xpath('/html/body/app-root/app-signup/div/div/div[2]/form/h3'));
  }
  getEmailExitMessage(){
    return element(by.xpath('/html/body/app-root/app-signup/div/div/div[2]/form/div[3]/div'));
  }
  getSigupAnchorButton(){
    return element(by.xpath('/html/body/app-root/app-login/div/div/div[2]/div[3]/p/a'));
  }
}
