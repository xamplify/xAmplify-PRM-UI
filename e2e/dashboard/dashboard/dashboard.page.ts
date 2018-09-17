import { element, browser, by, Key } from "protractor";
import { LoginPage } from "../../authentication/login/login.page";

export class DashBoardPage extends LoginPage {

  getSingUpPageButton(){
    return element(by.css('.signUpTF'));
  }
  gotoDashoardPage(){
    browser.waitForAngularEnabled(false);
    return element.all(by.xpath('/html/body/app-root/app-home/div/app-leftsidebar/div/div/ul/li[1]/a')).click();
  }
}
