import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Pagination } from '../models/pagination';
import { CropperSettings} from 'ng2-img-cropper';
import { PagerService } from './pager.service';

declare var $:any;
@Injectable()
export class UtilService {
    topnavBareLoading = false;
    pagination: Pagination;
    constructor( private http: Http,private pagerService:PagerService) { }

    intlNumberFormat( num ) {
        return new Intl.NumberFormat().format( Math.round( num * 10 ) / 10 );
    }

    abbreviateNumber( num: number ) {
        if ( num >= 1000000 ) {
            return this.intlNumberFormat( num / 1000000 ) + 'M';
        } else if ( num > 9999 ) {
            return this.intlNumberFormat( num / 1000 ) + 'k';
        } else if ( num > 999 && num <= 9999 ) {
            return num.toLocaleString();
        }
        return this.intlNumberFormat( num );
    }

    convertHHMMSSToSeconds( hms: string ) {
        var a = hms.split( ':' ); // split it at the colons

        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var seconds = ( +a[0] ) * 60 * 60 + ( +a[1] ) * 60 + ( +a[2] );
        return seconds;
    }

    convertSecondsToHHMMSS( seconds: number ) {
        seconds = Number( seconds );
        var hours = Math.floor( seconds / 3600 );
        var minutes = Math.floor( seconds % 3600 / 60 );
        var seconds = Math.floor( seconds % 3600 % 60 );
        return ( ( hours > 0 ? hours + ":" + ( minutes < 10 ? "0" : "" ) : "" ) + minutes + ":" + ( seconds < 10 ? "0" : "" ) + seconds );
    }

    abbreviateTwitterProfiles( twitterProfiles: any ) {
        for ( var i in twitterProfiles ) {
            twitterProfiles[i].statusesCount = this.abbreviateNumber( twitterProfiles[i].statusesCount );
            twitterProfiles[i].friendsCount = this.abbreviateNumber( twitterProfiles[i].friendsCount );
            twitterProfiles[i].followersCount = this.abbreviateNumber( twitterProfiles[i].followersCount );
        }
        return twitterProfiles;
    }

    getJSONLocation(): Observable<any> {
        const locationurl = 'https://pro.ip-api.com/json/?key=7bvBGuqMHI5QTtq';
        return this.http.get( locationurl, '' )
            .map( response => response.json() );
    }

    sortOptionValues(sortValue: any, pagination: Pagination){
        const sortedValue = sortValue.value;
        if (sortedValue !== '') {
            const options: string[] = sortedValue.split('-');
            pagination.sortcolumn = options[0];
            pagination.sortingOrder = options[1];
        } else {
            pagination.sortcolumn = pagination.sortingOrder = null;
        }
        pagination.pageIndex = 1;
        return pagination;
    }
    setTooltipMessage(event: any) {
        let tooltipMessage: any
        if (event === 7) {
            tooltipMessage = 'Last 7 days';
        } else if (event === 14) {
            tooltipMessage = 'Last 14 days';
        } else if (event === 21) {
            tooltipMessage = 'Last 21 days';
        } else if (event === 30 || event.value === 30) {
            tooltipMessage = 'Current Month';
        } else if (event.includes('year')) {
            tooltipMessage = 'Current Year';
        }
        return tooltipMessage;
    }
    setRouterLocalStorage(router:string){
      localStorage.removeItem("campaignRouter");
      localStorage.setItem('campaignRouter', router);
    }
    getRouterLocalStorage(){
      return localStorage.getItem("campaignRouter");
    }
    isXamplify(){ if(window.location.hostname.includes('xamplify')){ return true; } return false; }

    blobToFile(theBlob){
      theBlob.lastModifiedDate = new Date();
      theBlob.name = theBlob.lastModifiedDate.getTime()+'.webp';
      return theBlob;
     }
    convertBase64ToFileObject(dataURI) {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {  ia[i] = byteString.charCodeAt(i);  }
      const blob = new Blob([ab], {type: mimeString});
      return (<File> blob);
    }
    cropSettings(cropperSetting:any,height,croppedWidth,croppedHeight, rounded){
      cropperSetting = new CropperSettings();
      if(!rounded){
        cropperSetting.width = 600;
        cropperSetting.height = 230;
        cropperSetting.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
      } else {
        cropperSetting.width = 200;
        cropperSetting.height = height
        cropperSetting.cropperDrawSettings.strokeColor = 'dotted 3px #6f6f6f';
      }
      cropperSetting.croppedWidth = croppedWidth;
      cropperSetting.croppedHeight = croppedHeight;
      cropperSetting.canvasWidth = 500;
      cropperSetting.canvasHeight = 300;
      cropperSetting.rounded = rounded;
      cropperSetting.cropperDrawSettings.strokeWidth = 1;
      cropperSetting.noFileInput = true;
      return cropperSetting;
    }

    setUserInfoIntoLocalStorage(userName:string,data:any){
        const currentUser = localStorage.getItem( 'currentUser' );
        const userToken = {
                'userName': userName,
                'userId': data.id,
                'accessToken': JSON.parse( currentUser )['accessToken'],
                'refreshToken': JSON.parse( currentUser )['refreshToken'],
                'expiresIn':  JSON.parse( currentUser )['expiresIn'],
                'hasCompany': data.hasCompany,
                'roles': data.roles,
                'campaignAccessDto':data.campaignAccessDto,
                'logedInCustomerCompanyNeme':data.companyName,
				'source':data.source
            };
            localStorage.setItem('currentUser', JSON.stringify(userToken));
		    localStorage.setItem('defaultDisplayType',data.modulesDisplayType);
    }

    isLoggedAsTeamMember(){
        let adminId = JSON.parse(localStorage.getItem('adminId'));
        return adminId!=null;
    }


    isLoggedInFromAdminPortal(){
        return JSON.parse(localStorage.getItem('loginAsUserId'))!=null;
       
    }

    isLoggedAsPartner(){
        let adminId = this.getLoggedInVendorAdminCompanyUserId();
        return adminId!=null;
    }

    getLoggedInVendorAdminCompanyUserId(){
        return  JSON.parse(localStorage.getItem('vendorAdminCompanyUserId'));
    }

    getLoggedInVendorAdminCompanyEmailId(){
        return  JSON.parse(localStorage.getItem('vendorAdminCompanyUserEmailId'));
    }

    getLoggedInAdminCompanyUserId(){
        return  JSON.parse(localStorage.getItem('adminId'));
    }

    getLoggedInAdminCompanyEmailId(){
        return  JSON.parse(localStorage.getItem('adminEmailId'));
    }


    addLoginAsLoader(){
        $("body").addClass("login-as-loader");
    }

    setPaginatedRows(response:any,pagination:Pagination){
        const data = response.data;
        pagination.totalRecords = data.totalRecords;
        pagination = this.pagerService.getPagedItems(pagination, data.list);
        return pagination;
    }
    

}
