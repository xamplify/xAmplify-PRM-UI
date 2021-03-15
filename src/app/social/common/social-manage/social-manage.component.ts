import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SocialService } from '../../services/social.service';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { SocialConnection } from '../../../social/models/social-connection';
import { ReferenceService } from '../../../core/services/reference.service';
import { HttpRequestLoader } from '../../../core/models/http-request-loader';

declare var swal: any;
@Component( {
    selector: 'app-social-manage',
    templateUrl: './social-manage.component.html',
    styleUrls: ['./social-manage.component.css']
})
export class SocialManageComponent implements OnInit, OnDestroy {
    socialConnections: SocialConnection[] = new Array<SocialConnection>();
    socialConnectionsTemp: SocialConnection[] = new Array<SocialConnection>();
    response: any;
    httpRequestLoader:HttpRequestLoader = new HttpRequestLoader();
    providerName: string;
    constructor( private route: ActivatedRoute, private socialService: SocialService,
        public authenticationService: AuthenticationService, public referenceService:ReferenceService ) { }

    listAccounts( userId: number ) {
        this.socialConnections = [];
        this.referenceService.loading(this.httpRequestLoader, true);
        this.socialService.listAccounts( userId, this.providerName, 'ALL' )
            .subscribe(
            result => {
                this.socialConnections = result;

                this.socialConnections.forEach(data => {
                    let socialConnection = new SocialConnection();
                    socialConnection.id = data.id;
                    socialConnection.active = data.active;
                    this.socialConnectionsTemp.push(socialConnection);
                })

                this.socialService.setDefaultAvatar(this.socialConnections);
                this.referenceService.loading(this.httpRequestLoader, false);
            },
            ( error: string ) => {
                console.error(error);
                this.referenceService.showServerError(this.httpRequestLoader);
            },
            () => {});
    }
    removeAccount(socialConnection: SocialConnection){
        this.socialService.removeAccount( socialConnection.id )
            .subscribe(
            result => {
                this.listAccounts(this.authenticationService.getUserId());
            },
            error => console.log( error ),
            () => {
                this.socialService.socialConnections = this.socialConnections;
            } );
    }

    save() {
        this.socialService.saveAccounts( this.socialConnections )
            .subscribe(
            result => {
                this.response = 'success';
            },
            error => console.log( error ),
            () => {
                this.socialService.socialConnections = this.socialConnections;
            } );

    }
    confirmRemoveAccount(socialConnection: SocialConnection){
	if(socialConnection.canSaveSocialConnections){
		 const self = this;
        swal( {
            title: 'Are you sure?',
            text: 'Do you really want to remove this account?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#54a7e9',
            cancelButtonColor: '#999',
            confirmButtonText: 'Yes'

        }).then( function() {
            self.removeAccount(socialConnection);
        }, function( dismiss: any ) {
            console.log( 'you clicked on option' + dismiss );
        });
		}
       
    }

    confirmDialog(socialConnection: SocialConnection) {
        if (socialConnection.canSaveSocialConnections && !socialConnection.active ) {
            socialConnection.active = !socialConnection.active;
        } else if(socialConnection.canSaveSocialConnections  && socialConnection.active) {
            const self = this;
            swal( {
                title: 'Are you sure?',
                text: 'Do you really want to deselect this account?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#54a7e9',
                cancelButtonColor: '#999',
                confirmButtonText: 'Yes'

            }).then( function() {
                socialConnection.active = !socialConnection.active;
            }, function( dismiss: any ) {
                console.log( 'you clicked on option' + dismiss );
            });
        }
    }
    errorHandler(event){event.target.src= 'assets/images/social/avatar.png';}
    ngOnInit() {
        try {
            this.providerName = this.route.snapshot.params['social'];
            const userId = this.authenticationService.getUserId();
            this.listAccounts( userId );
        } catch ( err ) {
            console.log( err );
        }
    }

    onChange() {
        this.socialConnectionsTemp.forEach(data => console.log(data.id + ' - '+ data.active));
        let isChanged: boolean;
        for(var i=0; i< this.socialConnections.length; i++){
            if(this.socialConnections[i].active !== this.socialConnectionsTemp[i].active){
                isChanged = true;
                break;
            }
        }
        if(isChanged) {
        const self = this;
        swal( {
            title: 'Are you sure?',
            text: "Do you want to save your changes?",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#54a7e9',
            cancelButtonColor: '#999',
            confirmButtonText: 'Yes, Save it!',
            cancelButtonText : 'No'

        }).then(function() {
                self.save();
        },function (dismiss) {
            if (dismiss === 'cancel') {console.log('clicked cancel') }
        })

        }   
    }

    ngOnDestroy(): void {
        swal.close();
        if(this.response !== 'success')
        	this.onChange();
    }

}
