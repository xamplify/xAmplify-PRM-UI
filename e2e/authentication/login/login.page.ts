import { element, browser, by, Key } from "protractor";
import { BasePage } from "../../app.po";

export class LoginPage extends BasePage {
  navigateTo() {
    return super.navigateTo();
  }
  navigateToPassword() {
    return browser.get("/forgot-password");
  }
  navigateToLogin(){
    return browser.get("/login");
  }
  getUserNameTF() {
    return element(by.id("username"));
  }
  getPasswordTF() {
    return element(by.id("password"));
  }
  getLoginButton() {
    return element(by.id("submitBitton"));
  }

  getMessageText() {
    return element(by.xpath('//*[@id="responseMessage"]')).getText();
  }
  getPasswordHeaderText() {
    return element(by.css(".pwdHeaderMessage"));
  }
  getForgotPwdButton() {
    return element(by.css(".forget-password")).click();
  }
  getForgotEmailTF() {
    return element(by.xpath('/html/body/app-root/app-forgot-password/div[2]/div/div[2]/form/div[1]/input'));
  }
  getForgotSubmitButton() {
    return element(by.xpath('//*[@id="forgotSubmit"]'));
  }
  getTopNavBarDropdown() {
    browser.waitForAngularEnabled(false);
    return element.all(by.id("headerdropDownLi")).click();
  }
  login() {
    this.getUserNameTF().clear();
    this.getPasswordTF().clear();
    browser.waitForAngularEnabled(false);
    this.getUserNameTF().sendKeys(browser.params.userName);
    this.getPasswordTF().sendKeys(browser.params.password);
    this.getLoginButton().click();
  }
  getProfileDropdown(){
    element.all(by.xpath('//*[@id="headerdropDownLi"]')).click();
  }
  logout() {
    browser.waitForAngularEnabled(false);
    this.getProfileDropdown();
    browser.waitForAngularEnabled(false);
    element.all(by.xpath('//*[@id="logoutButton"]/a')).click();
  }
  loginLogoutCheck(){
    this.navigateToLogin();
    let displayed;
    this.getUserNameTF().isPresent().then(function(visible) { displayed = visible });
     if(!displayed){  console.log('logout is not happend');
     } else { this.login();}
     if(this.getLoginButton().isPresent()){
      this.login();
     }
  }

}
