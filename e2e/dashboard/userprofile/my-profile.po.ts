import { element, browser, by, Key } from "protractor";
import { LoginPage } from "../../authentication/login/login.page";

export class MyProfilePage extends LoginPage {

myProfileLink(){
  return element.all(by.xpath('//*[@id="headerdropDownLi"]/ul/li[1]/a')).click();
}

getChangePasswordTab(){
  return element.all(by.xpath('/html/body/app-root/app-home/div/div/app-my-profile/div/div[4]/div/div[2]/div/div/div/div[1]/ul/li[2]/a')).click();
}
getSettingsTab(){
 return element.all(by.xpath('/html/body/app-root/app-home/div/div/app-my-profile/div/div[4]/div/div[2]/div/div/div/div[1]/ul/li[3]/a')).click();
}
getDefaultsettingTab(){
  return element.all(by.xpath('/html/body/app-root/app-home/div/div/app-my-profile/div/div[4]/div/div[2]/div/div/div/div[1]/ul/li[4]/a'));
}
getPersonalInfoTab(){
  return element.all(by.xpath('/html/body/app-root/app-home/div/div/app-my-profile/div/div[4]/div/div[2]/div/div/div/div[1]/ul/li[1]/a')).click();
}

}
