import { element, browser, by, Key } from "protractor";
import { LoginPage } from "../authentication/login/login.page";

export class UploadVideoPage extends LoginPage {

  navigateToUpload(){
    return browser.get("home/videos");
  }
  clickOnVideos(){
    browser.waitForAngularEnabled(false);
   // const videos = browser.driver;
   // return videos.actions().mouseMove(videos.findElement(by.xpath("/html/body/app-root/app-home/div/app-leftsidebar/div/div/ul/li[3]/a"))).perform();
    return element.all(by.xpath('/html/body/app-root/app-home/div/app-leftsidebar/div/div/ul/li[3]/a')).click();
  }
  clickOnUploadVideos(){
    browser.waitForAngularEnabled(false);
    return element.all(by.xpath('/html/body/app-root/app-home/div/app-leftsidebar/div/div/ul/li[3]/ul/li[1]/a')).click();
  }
  getCameraButton(){
    browser.waitForAngularEnabled(false);
    return element.all(by.xpath('/html/body/app-root/app-home/div/div/app-upload-video/div/div[3]/div/div[2]/div[2]/div/div[1]/img')).click();
  }
  closeCmera(){
    browser.waitForAngularEnabled(false);
    return element.all(by.xpath('//*[@id="myModal"]/div/div/div[1]/button')).click();
  }
}
