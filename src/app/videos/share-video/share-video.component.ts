import {Component, ElementRef, OnInit, OnDestroy, Input,Inject,AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {VideoFileService} from '../services/video-file.service';
import {SaveVideoFile} from '../models/save-video-file';
import {Category} from '../models/category';
import {AuthenticationService} from '../../core/services/authentication.service';
import { Logger } from 'angular2-logger/core';
import { ShareButton, ShareProvider } from 'ng2-sharebuttons';
import { DOCUMENT } from '@angular/platform-browser';
// import {DomAdapter, getDOM} from '@angular/platform-browser/src/dom/dom_adapter';
declare var videojs:any;
//import {BrowserDomAdapter} from 'angular2/platform/browser';
//import { Meta ,MetaDefinition} from '../../core/services/angular2-meta.service';

import { Meta,MetaDefinition } from '@angular/platform-browser';

//import { MetaService } from '@nglibs/meta';

@Component({
  selector: 'app-share-video',
  templateUrl: './share-video.component.html',
  styleUrls: ['../../../assets/css/video-css/video-js.custom.css']
})
export class ShareVideoComponent implements OnInit {

videoFile: SaveVideoFile;
saveVideoFile: SaveVideoFile;
private videoJSplayer: any;
public imgURL = "http://139.59.1.205:9090/vod/images/125/03022017/flight1486153663429_play1.gif";
public images = "http://localhost:3000/embed-video/75eb5693-1865-4002-af66-ea6d1dd1d874";
//public linkurl = 'http://139.59.1.205:3000/embed-video/75eb5693-1865-4002-af66-ea6d1dd1d874';
public linkurl = 'https://github.com/valor-software/ng2-file-upload/issues/238';
public linkurl2 = 'http://139.59.1.205:9090/vod/videos/125/03022017/flight1486153663429.mp4';
//  public images = "http://localhost:3000/embed-video/75eb5693-1865-4002-af66-ea6d1dd1d874";
public checkUrl = 'https://www.youtube.com/watch?v=eLZH1GEeBU4';
public videoUrl: string;

twitterButtons:any;
googleButtons:any;
facebookButtons :any;
metatags :any;
description = 'hi this is sathish'
 //private _dom: DomAdapter = getDOM();

    //@Inject(DOCUMENT) private document:any , ,private metaService:Meta
  constructor(private router: Router, private route: ActivatedRoute,private videoFileService: VideoFileService,
             private _logger: Logger,private metaService:Meta) {
            console.log(" share component constructor called");
            this.saveVideoFile = this.videoFileService.saveVideoFile ;
        }
 /* getVideo(alias:string){
    
	  this.videoFileService.getVideo(alias)
        .subscribe(
        data => {
            this.videoFile = data;
            this.videoUrl = this.videoFile.videoPath;
            this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf("."));
            this.videoUrl = this.videoUrl + ".mp4";
            console.log(this.videoUrl);
           this.metatags = {
                    'twitter:title' :'Meta Tags NEw',
                   }
            
           
            let title:MetaDefinition   =  { name: 'og:type', content: "new titel is title" };
            let desc: MetaDefinition = { name: 'description', content: "checking sdkgaksdgjjlksdd" };
            let ogDesc: MetaDefinition = { name: 'og:title', content: "dec sdgklsdjklgajdskljgklsdjlkgjsdklg" };
            let ogTitle: MetaDefinition = { name: 'twitter:title', content: "Sathish New Project" };

          //  this.metaService.addTags([desc, ogDesc, ogTitle],true); 
            
          //  this.metaService.addTag(ogTitle);
            
        });
  } */

  ngOnInit() {
      var alias = this.route.snapshot.params['id'];
      console.log(alias);
    //  this.getVideo(alias);
        
      this.videoJSplayer = videojs(document.getElementById('example_video_11'), {}, function() {
          this.play();
    });
      
     this.googleButtons = new ShareButton(
        ShareProvider.GOOGLEPLUS,              //choose the button from ShareProvider
        "<img src='assets/images/google+.png' style='height: 32px;'>",    //set button template
        'twitter'                           //set button classes
      );

   this.twitterButtons = new ShareButton(
       ShareProvider.TWITTER,              //choose the button from ShareProvider
       "<img src='assets/images/twitter.png' style='height: 32px;'>",    //set button template
       'twitter'                           //set button classes
     );

this.facebookButtons = new ShareButton(
       ShareProvider.FACEBOOK,              //choose the button from ShareProvider
       "<img src='assets/images/facebook.png' style='height: 32px;'>",    //set button template
       'fb'                           //set button classes
     );
  
  }
  

  ngOnDestroy() {
        console.log('Deinit - Destroyed Component')
        this.videoJSplayer.dispose();
    }
  

}
