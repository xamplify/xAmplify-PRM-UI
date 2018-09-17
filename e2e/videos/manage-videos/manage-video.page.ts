import { element, browser, by, Key } from "protractor";
import { LoginPage } from "../../authentication/login/login.page";

export class ManageVideoPage extends LoginPage {

  clickOnManageVideos(){
    browser.waitForAngularEnabled(false);
    return element.all(by.xpath('/html/body/app-root/app-home/div/app-leftsidebar/div/div/ul/li[3]/ul/li[2]/a')).click();
  }
  playVideo(){
    browser.waitForAngularEnabled(false);
    return element.all(by.xpath('//*[@id="imagePath1888"]')).click();
  }
  gotoManageVideos(){
    browser.waitForAngularEnabled(false);
    return element.all(by.xpath('/html/body/app-root/app-home/div/div/app-manage-video/div/div[1]/div/ul/li[2]')).click();
  }
  getEmbedVideoActions(){
    browser.waitForAngularEnabled(false);
    browser.sleep(2000);
    element.all(by.xpath('/html/body/app-root/app-home/div/div/app-manage-video/div/app-play-video/div/div/div/div[1]/div[5]/div/button[2]')).click();
    element.all(by.xpath('//*[@id="myModal"]/div/div/div[2]/form/div[2]/div/div[1]/select')).click();
    element.all(by.xpath('//*[@id="myModal"]/div/div/div[2]/form/div[2]/div/div[1]/select/option[2]')).click();
    element.all(by.xpath('//*[@id="myModal"]/div/div/div[2]/form/div[2]/div/div[2]/input')).click();
    element.all(by.xpath('//*[@id="myModal"]/div/div/div[2]/form/div[2]/div/div[2]/input')).click();
    element.all(by.xpath('//*[@id="myModal"]/div/div/div[2]/form/div[2]/div/div[3]/button')).click();
    element.all(by.xpath('//*[@id="myModal"]/div/div/div[1]/a')).click();
  }
  getSearchTF(){
    browser.waitForAngularEnabled(false);
    return element.all(by.xpath('/html/body/app-root/app-home/div/div/app-manage-video/div/div[2]/div/div[2]/div/div[1]/div/div[1]/div/div[1]/div[4]/div/input'));
  }
  clickSearchButton(){
    return element.all(by.xpath('/html/body/app-root/app-home/div/div/app-manage-video/div/div[2]/div/div[2]/div/div[1]/div/div[1]/div/div[1]/div[4]/div/i')).click();
  }
  getEditVideo(){
    browser.waitForAngularEnabled(false);
    element.all(by.xpath('/html/body/app-root/app-home/div/div/app-manage-video/div/div[2]/div/div[2]/div/div[1]/div/div[2]/section[2]/div[3]/div/div[3]/div/a[1]')).click();
  }
  getVideoAnalytics(){
    browser.waitForAngularEnabled(false);
    element.all(by.xpath('/html/body/app-root/app-home/div/div/app-manage-video/div/div[2]/div/div[2]/div/div[1]/div/div[2]/section[2]/div[3]/div/div[3]/div/a[2]')).click();
  }
}


