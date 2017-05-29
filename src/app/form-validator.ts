import {FormGroup, AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators,FormBuilder } from '@angular/forms';
import {FileItem} from 'ng2-file-upload';

export function matchingPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

export function validateCampaignSchedule(scheduleType: string, date: string): ValidatorFn {
    return (group: FormGroup): {[key: string]: any} => {
      let schedule = group.controls[scheduleType];
      let launchTime = group.controls[date];
      if(schedule.value=="SCHEDULE"  && (launchTime.value==null || launchTime.value=="")){
          return{
              invalidSchedule:true
          }
      }
      
    }
  }

export function validateCampaignName(name: string, names:string[],isAdd:boolean,editedCampaignName:string): ValidatorFn {
    return (group: FormGroup): {[key: string]: any} => {
       if(names!=undefined){
           let campaignNames = names[0];
           let campaignName =  group.controls[name];
           if(campaignNames!=undefined){
               if(campaignNames.indexOf(campaignName.value)>-1 && campaignName.value!=editedCampaignName){
                   return{
                       duplicateCampaignName:true
                   };
               }
           }
       }
       
    }
  }

export function validateOwnThumbnail(imageFile:any,fileItem:FileItem,ownThumb:any):ValidatorFn {
	
   console.log(fileItem);
	  return (group: FormGroup): {[key: string]: any} => {
	      
		  let ownThumbnail = group.controls[ownThumb];
	      if(fileItem!= null  && (fileItem != undefined && ownThumb.value != false)){
	        console.log("in validate own thumbnail method");
	    	  return{
	              invalidImagefile:true
	          }
	      }
	      
	    }
	
}


