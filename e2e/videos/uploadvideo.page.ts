import { element, browser, by, Key } from "protractor";
import { LoginPage } from "../authentication/login/login.page";

export class UploadVideoPage extends LoginPage {

  navigateToUpload(){
    return browser.get("home/videos");
  }
}
