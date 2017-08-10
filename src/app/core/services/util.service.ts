import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { UserToken } from '../models/user-token';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UtilService {
    constructor( private http: Http ) { }

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
}
