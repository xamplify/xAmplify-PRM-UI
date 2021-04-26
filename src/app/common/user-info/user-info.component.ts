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
    backgroudColor: any;
    constructor() { }

    ngOnInit() {
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
