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

  getHeaderText() {
    return element(by.css('app-root h1')).getText();
  }
  // getLogout(){
  //   return element(by.css('.logoutButton'));
  // }
}
