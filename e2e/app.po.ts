import { browser, element, by } from 'protractor';

export class BasePage {
  navigateTo() {
    return browser.get('/');
  }
  getLoginPageButton(){
    return element(by.css('.loginTF'));
  }
  getSingUpPageButton(){
    return element(by.css('.signUpTF'));
  }
  getLoginPagetButtonWithXpath(){
    browser.waitForAngularEnabled(false);
    return element(by.xpath('//*[@id="bs-navbar-collapse-1"]/ul[2]/li[1]/a')).click();
  }
  getHeaderText() {
    return element(by.css('app-root h1')).getText();
  }
  // getLogout(){
  //   return element(by.css('.logoutButton'));
  // }
}
