import { Component, OnInit, Input, ElementRef, OnDestroy, } from '@angular/core';
import {SaveVideoFile} from '../../models/save-video-file';
import { AuthenticationService } from '../../../core/services/authentication.service';
declare var videojs, Metronic, Layout, Demo, QuickSidebar, Index, Tasks, require: any;

@Component({
    selector: 'app-campaign-report-video',
    templateUrl: './campaign-report-video.component.html',
    styleUrls: ['./campaign-report-video.component.css', '../../../../assets/css/video-css/video-js.custom.css']

    //  '../../../../assets/css/daterangepicker-bs3.css'
})
export class CampaignReportVideoComponent implements OnInit {

    @Input() selectedVideo: SaveVideoFile;
    private _elementRef: ElementRef;
    private videoJSplayer: any;
    public videoUrl: string;

    constructor(elementRef: ElementRef, private authenticationService: AuthenticationService) {
        this._elementRef = elementRef;
    }

    ngOnInit() {
        this.videoUrl = this.selectedVideo.videoPath;
        this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf("."));
        this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
        console.log('Init - Component initialized')
        this.videoJSplayer = videojs(document.getElementById('example_video_12'), {}, function() {
            // This is functionally the same as the previous example.
            this.play();
            this.on('contextmenu', function(e) {
                e.preventDefault();
            });
            this.hotkeys({
                volumeStep: 0.1,
                seekStep: 5,
                enableMute: true,
                enableFullscreen: true,
                enableNumbers: false,
                enableVolumeScroll: true,
	               fullscreenKey: function(event: any, player: any) {
	                   // override fullscreen to trigger when pressing the F key or Ctrl+Enter
	                   return ((event.which === 70) || (event.ctrlKey && event.which === 13));
                },
	               customKeys: {
                    // Add new simple hotkey
                    simpleKey: {
                        key: function(e: any) {
                            // Toggle something with S Key
                            return (e.which === 83);
                        },
                        handler: function(player: any, options: any, e: any) {
                            // Example
                            if (player.paused()) {
                                player.play();
                            } else {
                                player.pause();
                            }
                        }
                    },
                    // Add new complex hotkey
                    complexKey: {
                        key: function(e: any) {
                            // Toggle something with CTRL + D Key
                            return (e.ctrlKey && e.which === 68);
                        },
                        handler: function(player: any, options: any, event: any) {
                            // Example
                            if (options.enableMute) {
                                player.muted(!player.muted());
                            }
                        }
                    },
                    // Override number keys example from https://github.com/ctd1500/videojs-hotkeys/pull/36
                    numbersKey: {
                        key: function(event: any) {
                            // Override number keys
                            return ((event.which > 47 && event.which < 59) || (event.which > 95 && event.which < 106));
                        },
                        handler: function(player: any, options: any, event: any) {
                            // Do not handle if enableModifiersForNumbers set to false and keys are Ctrl, Cmd or Alt
                            if (options.enableModifiersForNumbers || !(event.metaKey || event.ctrlKey || event.altKey)) {
                                var sub = 48;
                                if (event.which > 95) {
                                    sub = 96;
                                }
                                var number = event.which - sub;
                                player.currentTime(player.duration() * number * 0.1);
                            }
                        }
                    },
                    emptyHotkey: {
                        // Empty
                    },
                    withoutKey: {
                        handler: function(player: any, options: any, event: any) {
                            console.log('withoutKey handler');
                        }
                    },
                    withoutHandler: {
                        key: function(e: any) {
                            return true;
                        }
                    },
                    malformedKey: {
                        key: function() {
                            console.log('I have a malformed customKey. The Key function must return a boolean.');
                        },
                        handler: function(player: any, options: any, event: any) {
                            //Empty
                        }
	                   }
                }
            });
        });
        // Metronic.init(); 
        // Layout.init(); 
        // Demo.init(); 
        QuickSidebar.init();
        Index.init();
        Index.initDashboardDaterange();
        Index.initJQVMAP();
        Index.initCalendar();
        Index.initCharts();
        Index.initChat();
        Index.initMiniCharts();
        Tasks.initDashboardWidget();

    }

    ngOnDestroy() {
        console.log('Deinit - Destroyed Component');
        this.videoJSplayer.dispose();
    }

}
