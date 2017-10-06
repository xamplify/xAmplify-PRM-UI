import { Component, OnInit } from '@angular/core';

import { SocialStatus } from "../../models/social-status";
import { SocialService } from "../../services/social.service";
import { AuthenticationService } from '../../../core/services/authentication.service';

declare var $, flatpickr: any;

@Component( {
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit {
    socialStatusList: Array<SocialStatus> = new Array<SocialStatus>();
    userId: number;

    constructor(private socialService: SocialService, private authenticationService: AuthenticationService) { }

    constructCalendar() {
        let self = this;
        $( '#full-calendar' ).fullCalendar( {
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            views: {
                listDay: { buttonText: 'list day' },
                listWeek: { buttonText: 'list week' }
            },
            defaultView: 'month',
            timeFormat: 'h:mm',
            eventRender: function( event: any, element: any ) {
                element.find( ".fc-time" ).addClass( 'fc-time-title' );
                element.find( ".fc-title" ).addClass( 'fc-time-title' );
                element.find( '.fc-time-title' ).wrapAll( '<div class="fc-right-block col-xs-9 pull-right p0"></div>' );
                element.find( ".fc-time" ).css( { "display": "block" });

                let socialStatusProviders = event.data.socialStatusProviders;
                let str = '';
                for ( var i in socialStatusProviders ) {
                    
                    str += `<img class="img-responsive img-circle" style="height: auto; width: 100%;" src="${socialStatusProviders[i].socialConnection.profileImage}">`;
                    
                    if('FACEBOOK' === socialStatusProviders[i].socialConnection.source)
                        str += '<i class="fa fa-social pull-right fa-facebook fa-facebook-color"></i>';
                    else if ('TWITTER' === socialStatusProviders[i].socialConnection.source)
                        str += '<i class="fa fa-social pull-right fa-twitter fa-twitter-color"></i>';
                    else if ('GOOGLE' === socialStatusProviders[i].socialConnection.source)
                        str += '<i class="fa fa-social pull-right fa-google fa-google-color"></i>';
                }
                element.find( ".fc-right-block" )
                    .after( $( "<div id='" + event.id + "' class='fc-left-block col-xs-3 p0'>" + str + "</div>" ) );
            },
            eventClick: function( event: any, element: any ) {
                $( '#full-calendar-modal-event-' + event.id ).modal( 'show' );
            },
        });
    }

    listEvents() {
        let self = this;
        this.socialService.listEvents( this.userId )
            .subscribe(
            data => {
                this.socialStatusList = data;
                for ( var i in this.socialStatusList ) {

                    var event = {
                        title: this.socialStatusList[i].statusMessage,
                        start: this.socialStatusList[i].scheduledTimeUser,
                        id: this.socialStatusList[i].id,
                        data: this.socialStatusList[i],
                    };
                    $( '#full-calendar' ).fullCalendar( 'renderEvent', event, true );
                }
            },
            error => console.log( error ),
            () => {
                flatpickr( '.flatpickr', {
                    enableTime: true,
                    minDate: new Date()
                });
                console.log( "listEvents() finished" )
            }
            );
    }

    ngOnInit() {
        this.userId = this.authenticationService.getUserId();
        this.constructCalendar();
        this.listEvents();
    }

}
