import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UserToken } from '../models/user-token';
@Injectable()
export class UtilService {
    constructor() {}

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

    abbreviateTwitterProfiles( twitterProfiles: any ) {
        for ( var i in twitterProfiles ) {
            twitterProfiles[i].statusesCount = this.abbreviateNumber( twitterProfiles[i].statusesCount );
            twitterProfiles[i].friendsCount = this.abbreviateNumber( twitterProfiles[i].friendsCount );
            twitterProfiles[i].followersCount = this.abbreviateNumber( twitterProfiles[i].followersCount );
        }
        return twitterProfiles;
    }
}
