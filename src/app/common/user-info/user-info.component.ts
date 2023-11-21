import { Component, OnInit, Input } from '@angular/core';
declare var $: any;

@Component( {
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css', '../../../assets/css/phone-number-plugin.css']
})
export class UserInfoComponent implements OnInit {
    @Input() userInfo: any;
    @Input() isPartnerEntityInfo: boolean;
    @Input() isPartnerInfo: boolean;
    @Input() isCompanyInfo: boolean;    
    @Input() isContactCompanyInfo: boolean;
    @Input() isFromAdminList: boolean;
    @Input() isLeadInfo: boolean;
    @Input() isExclusion : boolean=false;
    @Input() isCreatedByUser: boolean;
    @Input() isPartnerAnalyticsCompany: boolean;
    backgroudColor: any;
    highlightLetter: string = "*";
    constructor() { }

    ngOnInit() {        
        if (this.userInfo != undefined) {
            if (this.isCreatedByUser) {
                this.userInfo.firstName = this.userInfo.createdByName;
                this.userInfo.emailId = this.userInfo.createdByEmail;
                this.userInfo.mobileNumber = this.userInfo.createdByMobileNumber;
            }
            else if (this.isPartnerAnalyticsCompany) {
                if (this.userInfo.companyName != null) {
                    this.userInfo.firstName = this.userInfo.companyName;
                } else if (this.userInfo.partnerCompanyName != null) {
                    this.userInfo.firstName = this.userInfo.partnerCompanyName;
                }  else if (this.userInfo.createdByCompanyName != null) {
                    this.userInfo.firstName = this.userInfo.createdByCompanyName;
                }
            }
            this.setBackgroundColor();
            this.setHighlightLetter();
        }

        
    }

    setHighlightLetter() {
        if (this.isPartnerInfo) {
            if (this.userInfo.contactCompany != undefined && this.userInfo.contactCompany != null && this.userInfo.contactCompany.trim().length > 0) {
                this.highlightLetter = this.userInfo.contactCompany.slice(0,1);
            }else if(this.userInfo.companyName!=undefined && this.userInfo.companyName!=null && $.trim(this.userInfo.companyName).length>0){
                this.highlightLetter = this.userInfo.companyName.slice(0,1);
            }else if (this.userInfo.emailId != undefined && this.userInfo.emailId != null && this.userInfo.emailId.trim().length > 0) {
                this.highlightLetter = this.userInfo.emailId.slice(0,1);
            }
        } else if (this.isExclusion) {
            if (this.userInfo.emailId != undefined && this.userInfo.emailId != null && this.userInfo.emailId.trim().length > 0) {
                this.highlightLetter = this.userInfo.emailId.slice(0,1);
            }
        } else {
            if (this.userInfo.firstName != undefined && this.userInfo.firstName != null && this.userInfo.firstName.trim().length > 0 ) {
                this.highlightLetter = this.userInfo.firstName.slice(0,1);
            } else if (this.userInfo.emailId != undefined && this.userInfo.emailId != null && this.userInfo.emailId.trim().length > 0) {
                this.highlightLetter = this.userInfo.emailId.slice(0,1);
            } else if (this.userInfo.email != undefined && this.userInfo.email != null && this.userInfo.email.trim().length > 0) {
                this.highlightLetter = this.userInfo.email.slice(0,1);
            }
        }
    }

    setBackgroundColor() {
        if (  this.userInfo!=undefined &&  this.userInfo.firstName ) {
            const first = this.userInfo.firstName.charAt( 0 ).toLowerCase();
            if ( first === 'a' || first === 'f' || first === 'k' || first === 'p' || first === 'u' ) {
                this.backgroudColor = "#512da8";
            }
            else if ( first === 'b' || first === 'g' || first === 'l' || first === 'q' || first === 'v' ) {
                this.backgroudColor = "#5d4037";
            }
            else if ( first === 'c' || first === 'h' || first === 'm' || first === 'r' || first === 'w' ) {
                this.backgroudColor = "#ef6c00";
            }
            else if ( first === 'd' || first === 'i' || first === 'n' || first === 's' || first === 'x' ) {
                this.backgroudColor = "#01579b";
            }
            else if ( first === 'e' || first === 'j' || first === 'o' || first === 't' || first === 'y' || first === 'z' ) {
                this.backgroudColor = "#26a69a";
            }
        }
    }

}
