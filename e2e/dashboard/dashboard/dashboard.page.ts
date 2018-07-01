import { element, browser, by, Key } from "protractor";
import { LoginPage } from "../../authentication/login/login.page";

export class DashBoardPage extends LoginPage {
  navigateTo() {
    return browser.get("/home/dashboard");
  }
  getSingUpPageButton(){
    return element(by.css('.signUpTF'));
  }
}
