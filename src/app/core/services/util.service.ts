import { Injectable } from '@angular/core';
import {User} from '../models/user';
import {UserToken} from '../models/user-token';
@Injectable()
export class UtilService {
    public loggedInUser: User;
    public userToken: UserToken;
    constructor() { 
        this.loggedInUser = new User();
        this.userToken = new UserToken();
    }
    
    intlNumberFormat( num ) {
        return new Intl.NumberFormat().format( Math.round( num * 10 ) / 10 );
    }
    
    abbreviateNumber( num: number ) {
        if ( num >= 1000000 )
            return this.intlNumberFormat( num / 1000000 ) + 'M';
        if ( num > 9999 )
            return this.intlNumberFormat( num / 1000 ) + 'k';
        if ( num > 999 && num <= 9999 )
            return num.toLocaleString();
        return this.intlNumberFormat( num );
    }
    
    abbreviateTwitterProfiles(twitterProfiles: any){
        for( var i in twitterProfiles ){
            twitterProfiles[i].statusesCount = this.abbreviateNumber(twitterProfiles[i].statusesCount);
            twitterProfiles[i].friendsCount = this.abbreviateNumber(twitterProfiles[i].friendsCount);
            twitterProfiles[i].followersCount = this.abbreviateNumber(twitterProfiles[i].followersCount);
        }
        return twitterProfiles;
    }
}
