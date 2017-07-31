import { Component, OnInit,OnDestroy,ViewChild, ElementRef} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Pagination } from '../../core/models/pagination';
import { Logger } from 'angular2-logger/core';
import { ReferenceService } from '../../core/services/reference.service';
import { validateCampaignSchedule } from '../../form-validator'; // not using multipleCheckboxRequireOne
import { VideoFileService} from '../../videos/services/video-file.service';
import { ContactService } from '../../contacts/services/contact.service';
import { CampaignService } from '../services/campaign.service';
import { UserService } from '../../core/services/user.service';
import { EmailTemplateService } from '../../email-template/services/email-template.service';
import { PagerService } from '../../core/services/pager.service';
import { AuthenticationService } from '../../core/services/authentication.service';

import { Campaign } from '../models/campaign';
import { Reply } from '../models/campaign-reply';
import { Url } from '../models/campaign-url';
import { CampaignVideo } from '../models/campaign-video';
import { CampaignEmailTemplate } from '../models/campaign-email-template';
import { CampaignContact } from '../models/campaign-contact';
import { EmailTemplate } from '../../email-template/models/email-template';
import { SaveVideoFile } from '../../videos/models/save-video-file';
import { ContactList } from '../../contacts/models/contact-list';
import { Category } from '../../videos/models/category';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
import { HttpRequestLoader } from '../../core/models/http-request-loader';

import { SocialStatus } from "../../social/models/social-status";
import { SocialStatusContent } from "../../social/models/social-status-content";
import { SocialStatusProvider } from "../../social/models/social-status-provider";

import { SocialService } from "../../social/services/social.service";

declare var swal, $, videojs , Metronic, Layout , Demo,TableManaged ,Promise, flatpickr: any,jQuery,CKEDITOR:any;



@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.css'],
  providers:[HttpRequestLoader],

})
export class CreateCampaignComponent implements OnInit,OnDestroy{
    selectedRow:Number;
    categories: Category[];
    campaignVideos: Array<SaveVideoFile>;
    isvideoThere:boolean;
    isCategoryThere :boolean=false;
    isCategoryUpdated:boolean;
    isvideosLength:boolean;
    imagePath:string;
    //campaignForm: FormGroup;
    campaign:Campaign;
    campaignVideo:CampaignVideo=new CampaignVideo();
    campaignContact:CampaignContact=new CampaignContact();
    campaignEmailTemplate:CampaignEmailTemplate = new CampaignEmailTemplate();
    names:string[]=[];
    editedCampaignName:string = "";
    isAdd:boolean = true;
    name:string = "";
    width:string="";
    campaignDetailsTabClass = "col-md-2 activestep";
    videoTabClass:string = "col-md-2";
    contactListTabClass:string = "col-md-2";
    emailTemplateTabClass:string = "col-md-2";
    launchCampaignTabClass:string = "col-md-2";
    currentTabActiveClass:string = "col-md-2 activestep";
    inActiveTabClass:string = "col-md-2";
    successTabClass:string = "col-md-2 successstep";
    /*************Pagination********************/
    videosPagination:Pagination = new Pagination();
    contactsUsersPagination:Pagination = new Pagination();
    emailTemplatesPagination:Pagination = new Pagination();
    pagedItems: any[];
    /************Campaign Details******************/
    formGroupClass:string = "form-group";
    campaignNameDivClass:string = this.formGroupClass;
    fromNameDivClass:string =  this.formGroupClass;
    subjectLineDivClass:string = this.formGroupClass;
    fromEmaiDivClass:string = this.formGroupClass;
    preHeaderDivClass:string = this.formGroupClass;
    messageDivClass:string = this.formGroupClass;
    campaignType:string = "";
    isCampaignDetailsFormValid:boolean = false;
    
    /************Video******************/
    isVideo:boolean = false;
    isCampaignDraftVideo:boolean = false;
    videoId:number=0;
    draftMessage:string = "";
    launchVideoPreview:SaveVideoFile = new SaveVideoFile();
    /***************Contact List************************/
    isContactList:boolean = false;
    contactsPagination:Pagination = new Pagination();
    campaignContactLists: Array<ContactList>;
    numberOfContactsPerPage = [
                               {'name':'10','value':'10'},
                               {'name':'20','value':'20'},
                               {'name':'30','value':'30'},
                               {'name':'---All---','value':'0'},
                               ]
    contactItemsSize:any = this.numberOfContactsPerPage[0];
    isCampaignDraftContactList:boolean = false;                           
    selectedRowClass:string = "";      
   /***********Email Template*************************/
    campaignEmailTemplates: Array<EmailTemplate>;  
    campaignDefaultEmailTemplates: Array<EmailTemplate>;  
    isEmailTemplate:boolean = false;
    isCampaignDraftEmailTemplate:boolean = false;
    emailTemplateHtmlPreivew:string = "";;
    selectedEmailTemplateName:string = "";
    emailTemplateId:number=0;
    isDefaultCampaignEmailTemplate:boolean = true;
    defaultEmailTemplateActiveClass:string = "filter active";
    ownEmailTemplateActiveClass:string = "filter";
    selectedEmailTemplateRow:number;
    selectedEmailTemplateTypeIndex:number = 0;
    selectedEmailTemplateType:EmailTemplateType=EmailTemplateType.NONE;
    /*****************Launch************************/
    isScheduleSelected:boolean = false;
    campaignLaunchForm: FormGroup;
    selectedContactLists: Array<Object>;
    id:number;
    previewContactListId : number;
    public sheduleCampaignValues = ['NOW', 'SCHEDULE', 'SAVE'];
    isLaunched:boolean = false;
    lauchTabPreivewDivClass = "col-xs-12 col-sm-12 col-md-6 col-lg-6";
    loggedInUserId:number = 0;
    buttonName:string = "Launch";
    
    socialStatus: SocialStatus = new SocialStatus();
    replies:Array<Reply> = new Array<Reply>();
    urls:Array<Url> = new Array<Url>();
    date:Date;
    reply:Reply=new Reply();
    url:Url = new Url();
    allItems= [];
    emailTemplateHrefLinks:any[] = [];
    dataError:boolean = false;
    /***********End Of Declation*************************/
    constructor(private fb: FormBuilder,private route: ActivatedRoute,public refService:ReferenceService,
                private logger:Logger,private videoFileService:VideoFileService,
                private authenticationService:AuthenticationService,private pagerService:PagerService,
                private userService:UserService,private campaignService:CampaignService,private contactService:ContactService,
                private emailTemplateService:EmailTemplateService,private router:Router, private socialService: SocialService
            ){
        this.logger.info("create-campaign-component constructor loaded");
        this.campaign = new Campaign();
        if ( this.authenticationService.user != undefined ) {
            this.loggedInUserId = this.authenticationService.user.id;
            this.campaign.userId = this.loggedInUserId;
            this.loadCampaignNames( this.loggedInUserId );
            }
        if(this.campaignService.campaign!=undefined){
            $('head').append('<script src="https://yanwsh.github.io/videojs-panorama/videojs/v5/video.min.js"  class="p-video"  />');
            this.isAdd = false;
            this.editedCampaignName = this.campaignService.campaign.campaignName;
            this.campaign = this.campaignService.campaign;
            this.getCampaignReplies(this.campaign);
            this.getCampaignUrls(this.campaign);
            this.contactsPagination.campaignId = this.campaign.campaignId;
            /******************Campaign Details Tab**************************/
            if(this.campaign.email!=undefined){
                this.isValidEmail = true;
            }
            if(this.campaign.campaignName!=undefined && this.campaign.fromName!=undefined && 
                    this.campaign.subjectLine!=undefined&& this.campaign.email!=undefined && 
                    this.campaign.preHeader!=undefined && this.campaign.message!=undefined){
                this.isCampaignDetailsFormValid = true;
            }else{
                this.isCampaignDetailsFormValid = false;
            }
            /***********Select Video Tab*************************/
            var selectedVideoId  = this.campaignService.campaign.selectedVideoId;
            if(selectedVideoId>0){
                this.isVideo = true;
                this.videoTabClass  = this.successTabClass;
                this.videoId = selectedVideoId;
                this.isCampaignDraftVideo = true;
                this.launchVideoPreview = this.campaignService.campaign.campaignVideoFile;
            }
            
            /***********Select Contact List Tab*************************/
            if(this.campaign.userListIds.length>0){
                this.isContactList = true;
                this.contactListTabClass = this.successTabClass;
                this.contactsPagination.editCampaign = true;
                this.contactsPagination.campaignUserListIds = this.campaign.userListIds.sort();
                this.isCampaignDraftContactList = true;
            }
            /***********Select Email Template Tab*************************/
            var selectedTemplateId = this.campaignService.campaign.selectedEmailTemplateId;
            if(selectedTemplateId>0){
                this.emailTemplateTabClass = this.successTabClass;
                this.emailTemplateId = selectedTemplateId;
                this.selectedEmailTemplateRow = selectedTemplateId;
                this.isEmailTemplate = true;
                this.isCampaignDraftEmailTemplate = true;
            }
            if(this.campaign.regularEmail){
                this.campaignType = 'regular';
            }else{
                this.campaignType = 'video';
            }
          /************Launch Campaign**********************/
            this.name = this.campaignService.campaign.campaignName;
            if(this.campaignService.campaign.endTime.toString() !="null"){   // added to String() method here also
                this.campaign.scheduleCampaign  = this.sheduleCampaignValues[2];
                this.isScheduleSelected = true;
                this.launchCampaignTabClass = this.successTabClass;
            }
            if(this.campaignService.campaign.scheduleTime!=null && this.campaignService.campaign.scheduleTime!="null" ){
                this.campaign.scheduleCampaign  = this.sheduleCampaignValues[1];
                this.isScheduleSelected = true;
                this.launchCampaignTabClass = this.successTabClass;
            }
            if(this.campaignService.campaign.scheduleTime=="null" ||this.campaignService.campaign.scheduleTime==null){
                this.campaign.scheduleTime = "";
            }
            let emailTemplate = this.campaign.emailTemplate;
            console.log(emailTemplate);
            if(emailTemplate!=undefined){
                this.isEmailTemplate = true;
            }else{
                this.logger.info("No Email Template Added For Campaign");
            }
        }//End Of Edit
        if(this.isAdd){
            this.campaignType = this.refService.selectedCampaignType;
        }
        if(this.refService.campaignVideoFile!=undefined){
            /****************Creating Campaign From Manage VIdeos*******************************/
            var selectedVideoId  = this.refService.campaignVideoFile.id;
            if(selectedVideoId>0){
                this.isVideo = true;
                this.videoId = selectedVideoId;
                this.isCampaignDraftVideo = true;
                this.launchVideoPreview = this.refService.campaignVideoFile;
                this.campaign.campaignVideoFile = this.refService.campaignVideoFile;
                this.campaignType = this.refService.selectedCampaignType;
                this.campaign.selectedVideoId = selectedVideoId;
            }
        }
    }
    getCampaignReplies(campaign:Campaign){
       if(campaign.campaignReplies!=undefined){
           this.replies = campaign.campaignReplies;
           for(var i=0;i<this.replies.length;i++){
               let reply = this.replies[i];
               reply.replyTime = new Date(reply.replyTime);
               let length = this.allItems.length;
               length = length+1;
               var id = 'reply-'+length;
               reply.divId = id;
               this.allItems.push(id);
           } 
       }
       
    }
    getCampaignUrls(campaign:Campaign){
        if(campaign.campaignUrls!=undefined){
            this.urls = campaign.campaignUrls;
            for(var i=0;i<this.urls.length;i++){
                let url = this.urls[i];
                url.replyTime = new Date(url.replyTime);
                let length = this.allItems.length;
                length = length+1;
                var id = 'click-'+length;
                url.divId = id;
                this.allItems.push(id);
            }
        }
       
    }
   

    ngOnInit(){
        Metronic.init();
        Layout.init();
        Demo.init();
        flatpickr( '.flatpickr',{
            enableTime: true,
            minDate: new Date(),
            dateFormat: 'd/m/Y H:i',
            time_24hr: true
        } );
        //this.validatecampaignForm();
        this.validateLaunchForm();
        this.loadCampaignVideos(this.videosPagination);
        this.loadCampaignContacts(this.contactsPagination);
        if(this.campaignType=="video"){
           this.width="20%";
            this.emailTemplatesPagination.filterBy = "CampaignVideoEmails";
            $('#videoTab').show();
            if(!(this.isAdd)){
                var selectedTemplateId = this.campaignService.campaign.selectedEmailTemplateId;
                if(selectedTemplateId>0){
                    this.emailTemplateId = selectedTemplateId;
                    this.isEmailTemplate = true;
                    this.isCampaignDraftEmailTemplate = true;
                }
                     
            }
            this.lauchTabPreivewDivClass = "col-xs-12 col-sm-12 col-md-6 col-lg-6";
        }else{
            this.width="25%";
            this.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
            this.isVideo = true;
            $('#videoTab').hide();
            this.lauchTabPreivewDivClass = "col-xs-12 col-sm-12 col-md-12 col-lg-12";
        }  
        this.loadEmailTemplates(this.emailTemplatesPagination);//Loading Email Templates
    }
    
    /******************************************Pagination Related Code******************************************/
    setPage(pageIndex:number,module:string){
        if(module=="videos"){
           // var td = $('#videoTable tr.active').find('td:eq(0)');  
            this.videosPagination.pageIndex = pageIndex;
            this.loadCampaignVideos(this.videosPagination);
        }else if(module=="contacts"){
            this.contactsPagination.pageIndex = pageIndex;
            this.loadCampaignContacts(this.contactsPagination);
        }else if(module=="contactUsers"){
           this.contactsUsersPagination.pageIndex = pageIndex;
            this.loadUsers(this.id,this.contactsUsersPagination);
        }else if(module=="emailTemplates"){
            this.emailTemplatesPagination.pageIndex = pageIndex;
            this.loadEmailTemplates(this.emailTemplatesPagination);
        }
        
    }
    
    /*************************************************************Campaign Details***************************************************************************************/
    isValidEmail:boolean = false;
    isValidCampaignName:boolean = true;
     validateForm() {
         var isValid = true;
         let self = this;
        $('#campaignDetailsForm input[type="text"]').each(function() {
            if ( $(this).val() === '' ){
              isValid = false;
          }
             
        });
        if(isValid && this.isValidEmail && this.isValidCampaignName){
            this.isCampaignDetailsFormValid = true;
        }else{
            this.isCampaignDetailsFormValid = false;
        }
        console.log("is Valid Form"+this.isCampaignDetailsFormValid);
      }
     validateEmail(emailId:string){
         console.log(emailId);
         var regex = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
         if(regex.test(emailId)){
             this.isValidEmail = true;
             console.log("Valid Email Id");
         }else{
             this.isValidEmail = false;
             console.log("Invalid Email Id");
         }
     }
     validateCampaignName(campaignName:string){
         let lowerCaseCampaignName = campaignName.toLowerCase().trim();
         var list = this.names[0];
         console.log(list);
         if(this.isAdd){
             if($.inArray(lowerCaseCampaignName, list) > -1){
                 this.isValidCampaignName = false;  
             }else{
                 this.isValidCampaignName = true;
             }
         }else{
             console.log(this.editedCampaignName+":::::::::"+lowerCaseCampaignName);
             if($.inArray(lowerCaseCampaignName, list) > -1 && this.editedCampaignName!=lowerCaseCampaignName){
                 this.isValidCampaignName = false;  
             }else{
                 this.isValidCampaignName = true;
             }
         }
         
     }
     validateField(fieldId:string){
         var errorClass = "form-group has-error has-feedback";
         var successClass = "form-group has-success has-feedback";
         let fieldValue = $('#'+fieldId).val();
         if(fieldId=="campaignName"){
             if(fieldValue.length>0&&this.isValidCampaignName){
                 this.campaignNameDivClass = successClass;
             }else{
                 this.campaignNameDivClass = errorClass;
             }
            
         }else if(fieldId=="fromName"){
             if(fieldValue.length>0){
                 this.fromNameDivClass = successClass;
             }else{
                 this.fromNameDivClass = errorClass;
             }
         }else if(fieldId=="subjectLine"){
             if(fieldValue.length>0){
                 this.subjectLineDivClass = successClass;
             }else{
                 this.subjectLineDivClass = errorClass;
             }
         }else if(fieldId=="preHeader"){
             if(fieldValue.length>0){
                 this.preHeaderDivClass = successClass;
             }else{
                 this.preHeaderDivClass = errorClass;
             }
         }else if(fieldId=="email"){
             if(fieldValue.length>0 && this.isValidEmail){
                 this.fromEmaiDivClass = successClass;
             }else{
                 this.fromEmaiDivClass = errorClass;
             }
         }else if(fieldId=="message"){
             if(fieldValue.length>0){
                 this.messageDivClass = successClass;
             }else{
                 this.messageDivClass = errorClass;
             }
         }
     }
    loadCampaignNames(userId:number){
        this.campaignService.getCampaignNames(userId)
        .subscribe(
        data => {
            this.names.push(data);
        },
        error => console.log( error ),
        () => console.log( "Campaign Names Loaded" )
        );
    }
    setEmailOpened(event:any){
        this.campaign.emailOpened = event;
    }
    setVideoPlayed(event:any){
        this.campaign.videoPlayed = event;
    }
    setReplyWithVideo(event:any){
        this.campaign.replyVideo  = event;
    }
    setSocialSharingIcons(event:any){
        this.campaign.socialSharingIcons = event;
    }
    
    
    /*************************************************************Select Video***************************************************************************************/
    setClickedRow = function(videoFile:any){
        console.log(videoFile);
       let videoId = videoFile.id;
        if(videoFile.viewBy=="DRAFT"){
            this.draftMessage = "Video is in draft mode, please update the publish options to Library or Viewers.";
        }else{
            this.selectedRow = videoId;
            $('#campaign_video_id_'+videoId).prop( "checked", true );
            this.launchVideoPreview = videoFile;
            this.isVideo = true;
            if((!(this.isAdd) && this.campaign.campaignVideoFile!=undefined) || this.refService.campaignVideoFile!=undefined){
                if(videoId==this.campaign.campaignVideoFile.id){
                    $('#selectedVideoRow').addClass("active");
                }else{
                    $('#selectedVideoRow').removeClass("active");
                }
               
            }
            this.campaign.selectedVideoId =videoFile.id;
        }
        
        
    }
    showToolTip(videoType:string){
        if(videoType=="DRAFT"){
            this.draftMessage = "Video is in draft mode, please update the publish options to Library or Viewers.";
        }else{
            this.draftMessage = "";
        }
    }
    
    loadCampaignVideos(pagination:Pagination) {
        this.refService.loading(this.campaignVideo.httpRequestLoader, true);
        this.videoFileService.loadVideoFiles(pagination)
            .subscribe(
            (result:any) => {
                this.campaignVideos = result.listOfMobinars;
                pagination.totalRecords = result.totalRecords;
                if(this.isCategoryThere == false || this.isCategoryUpdated == true){
                     this.categories = result.categories;
                     this.categories.sort(function(a, b) { return (a.id) - (b.id); });
                }
                console.log(this.categories);
                if(this.campaignVideos.length!= 0){
                    this.isvideoThere = false;
                 }
                 else {
                     this.isvideoThere = true;
                     this.pagedItems = null; 
                 }
                if(this.campaignVideos.length==0) this.isvideosLength=true;
                else this.isvideosLength = false;   
                for (var i = 0; i < this.campaignVideos.length; i++) {
                    this.imagePath = this.campaignVideos[i].imagePath+"?access_token=" + this.authenticationService.access_token;
                    this.campaignVideos[i].imagePath = this.imagePath;
                }
                this.isCategoryThere = true;
                this.isCategoryUpdated = false;
               this.videosPagination = this.pagerService.getPagedItems(pagination, this.campaignVideos);
               this.refService.loading(this.campaignVideo.httpRequestLoader, false);
            },
            (error:string) => {
                this.logger.error(this.refService.errorPrepender+" loadCampaignVideos():"+error);
                this.refService.showServerError(this.campaignVideo.httpRequestLoader);
            },
            () => this.logger.info("Finished loadCampaignVideos()", this.videosPagination)
            )
     }
    /********************Filter Category Videos********************************/
    showUpdatevalue: boolean = false;
    showMessage: boolean = false;
    filterCategoryVideos(event:any){
        if(event.target.value!=""){
            this.showMessage = false;
            this.showUpdatevalue = false;
            this.isvideoThere = false;
            this.videosPagination.filterBy =  event.target.value;
            this.videosPagination.pageIndex = 1;
            this.loadCampaignVideos(this.videosPagination);
        }else{
            this.videosPagination.filterBy = null;
            this.videosPagination.pageIndex = 1;
            this.loadCampaignVideos(this.videosPagination);
        }
       
    }
     
    /************Showing Video Preview****************/
    showPreview(videoFile:SaveVideoFile){
        this.appendVideoData(videoFile, "main_video", "modal-title");
        $("#show_preview").modal({backdrop: 'static', keyboard: false});
    }
    destroyPreview(){
        var player = videojs("videoId");
        if(player){
            console.log(player.currentType_);
            let videoType = player.currentType_;
            if(videoType=="application/x-mpegURL"){
                console.log("Clearing Normal Video");
                player.dispose();
                $("#main_video").empty();
            }else{
              console.log("Clearing 360 video");
                player.panorama({
                    autoMobileOrientation: true,
                    clickAndDrag: true,
                    clickToToggle: true,
                    callback: function () {
                        player.pause();
                        $("#main_video").empty();
                    }
                  });
                
            }
        }
        
    }
    playVideo(){
        $('#main_video_src').empty();
        this.appendVideoData(this.launchVideoPreview, "main_video_src", "title");
    }
    
    appendVideoData(videoFile:SaveVideoFile,divId:string,titleId:string){
       console.log(videoFile);
        var alias = videoFile.alias;
        var fullImagePath = videoFile.imagePath;
        var title = videoFile.title;
        var videoPath = videoFile.videoPath;
        var is360 = videoFile.is360video;
        $("#"+divId).empty();
        $("#"+titleId).empty();
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" rel="stylesheet">');
        if(is360){
            console.log("Loaded 360 Video");
            $('.h-video').remove();
            $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
            $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
            $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet"  class="p-video">');
            $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript"  class="p-video" />');
            var str = '<video id=videoId poster='+fullImagePath+'  class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
            $("#"+titleId).append(title);
            $("#"+divId).append(str);
            console.log("360 video path"+videoPath);
            videoPath = videoPath.replace(".m3u8",".mp4");
            console.log("Updated 360 video path"+videoPath);
          //  videoPath = videoPath.replace(".mp4","_mobinar.m3u8");//Replacing .mp4 to .m3u8
            $("#"+divId+" video").append('<source src="'+videoPath+'" type="video/mp4">');
            var player = videojs('videoId');
            player.panorama({
                autoMobileOrientation: true,
                clickAndDrag: true,
                clickToToggle: true,
                callback: function () {
                  player.ready();
                }
              });
            $("#videoId").css("width", "550px");
            $("#videoId").css("height", "310px");
            $("#videoId").css("max-width", "100%");
            
        }else{
            console.log("Loaded Normal Video");
            $('.p-video').remove();
            $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
            $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video" />');
            var str = '<video id=videoId  poster='+fullImagePath+' preload="none"  class="video-js vjs-default-skin" controls></video>';
            $("#"+titleId).append(title);
            $("#"+divId).append(str);
           // videoPath = videoPath.replace(".mp4","_mobinar.m3u8");//Replacing .mp4 to .m3u8
            console.log("Video Path:::"+videoPath);
            videoPath = videoPath.substring(0,videoPath.lastIndexOf('.'));
            videoPath =  videoPath + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
            console.log("Normal Video Updated Path:::"+videoPath);
           $("#"+divId+" video").append('<source src='+videoPath+' type="application/x-mpegURL">');
            $("#videoId").css("width", "550px");
            $("#videoId").css("height", "310px");
            $("#videoId").css("max-width", "100%");
            var document:any = window.document;
            var player = videojs("videoId");
            console.log(player);
            if(player){
                player.on('fullscreenchange', function () {
                    var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
                    var event = state ? 'FullscreenOn' : 'FullscreenOff';
                    if(event==="FullscreenOn"){
                        $(".vjs-tech").css("width", "100%");
                        $(".vjs-tech").css("height", "100%");
                    }else if(event==="FullscreenOff"){
                        $("#videoId").css("width", "550px");
                
                    }
                     
                });
            }
        }
        $("video").bind("contextmenu",function(){
            return false;
            });
        
    }
   
    /*************************************************************Contact List***************************************************************************************/
    loadCampaignContacts(contactsPagination:Pagination) {
        this.refService.loading(this.campaignContact.httpRequestLoader, true);
        this.contactService.loadContactLists(contactsPagination)
            .subscribe(
            (data:any) => {
                this.campaignContactLists = data.listOfUserLists;
                contactsPagination.totalRecords = data.totalRecords;
                if(contactsPagination.filterBy!=null){
                    if(contactsPagination.filterBy==0){
                        contactsPagination.maxResults = data.totalRecords;
                    }else{
                        contactsPagination.maxResults = contactsPagination.filterBy;
                    }
                }
                this.contactsPagination = this.pagerService.getPagedItems(contactsPagination, this.campaignContactLists);
                this.refService.loading(this.campaignContact.httpRequestLoader, false);
            },
            (error:string) => {
                this.logger.error(this.refService.errorPrepender+" loadCampaignContacts():"+error);
                this.refService.showServerError(this.campaignContact.httpRequestLoader);
            },
            () => this.logger.info("Finished loadCampaignContacts()", this.contactsPagination)
            )
    }
    

    getNumberOfContactItemsPerPage(items:any){
        try{
            $('#checkAllExistingContacts').prop("checked",false);
            this.contactItemsSize = items;
            this.getAllFilteredResults(this.contactsPagination);
        }catch(error){
            console.log(error, "getSelectedContacts","PublishContentComponent");
        }
        
    }
    getAllFilteredResults(pagination:Pagination){
        try{
            this.contactsPagination.pageIndex = 1;
            this.contactsPagination.filterBy = this.contactItemsSize.value;
            if(this.contactItemsSize.value==0){
                this.contactsPagination.maxResults = this.contactsPagination.totalRecords;
            }else{
                this.contactsPagination.maxResults = this.contactItemsSize.value;
            }
            this.loadCampaignContacts(this.contactsPagination);
        }catch(error){
            console.log(error, "Get Filtered Contacts","Publish Content Component")
        }
    }
    highlightRow(contactId:number,event:any){
        let isChecked = $('#'+contactId).is(':checked');
        let contactIds = this.campaign.userListIds;
        if(isChecked){
            $('#campaignContactListTable_'+contactId).addClass('contact-list-selected');
            contactIds.push(contactId);
        }else{
            $('#campaignContactListTable_'+contactId).removeClass('contact-list-selected');
            contactIds.splice( $.inArray(contactId,this.campaign.userListIds) ,1 );
        }
        this.contactsUtility();
        event.stopPropagation();
    }
    highlightContactRow(contactId:number,event:any){
        let isChecked = $('#'+contactId).is(':checked');
          if(isChecked){
              //Removing Highlighted Row
              $('#'+contactId).prop( "checked", false );
              $('#campaignContactListTable_'+contactId).removeClass('contact-list-selected');
              console.log("Revmoing"+contactId);
              this.campaign.userListIds.splice( $.inArray(contactId,this.campaign.userListIds) ,1 );
        }else{
            //Highlighting Row
            $('#'+contactId).prop( "checked", true );
            $('#campaignContactListTable_'+contactId).addClass('contact-list-selected');
            console.log("Adding"+contactId);
            this.campaign.userListIds.push(contactId);
        }
          this.contactsUtility();
          event.stopPropagation();
          console.log(this.campaign.userListIds);
    }
    contactsUtility(){
        var trLength = $('#user_list_tb tbody tr').length;
        var selectedRowsLength = $('[name="campaignContact[]"]:checked').length;
        if(selectedRowsLength>0){
            this.isContactList = true;
        }else{
            this.isContactList = false;
        }
        if(trLength!=selectedRowsLength){
            $('#checkAllExistingContacts').prop("checked",false)
        }else if(trLength==selectedRowsLength){
            $('#checkAllExistingContacts').prop("checked",true);
        }
    }
   
    checkAll(ev:any){
        if(ev.target.checked){
            $('[name="campaignContact[]"]').prop('checked', true);
            this.isContactList = true;
            let self = this;
            let contactIds = this.campaign.userListIds = [];
            $('[name="campaignContact[]"]:checked').each(function(){
                var id = $(this).val();
                contactIds.push(parseInt(id));
                $('#campaignContactListTable_'+id).addClass('contact-list-selected');
             });
        }else{
            $('[name="campaignContact[]"]').prop('checked', false);
            this.isContactList = false;
            $('#user_list_tb tr').removeClass("contact-list-selected");
            this.campaign.userListIds = [];
        }
        ev.stopPropagation();
    }
    
    isAllChecked() {
        return this.contactsPagination.pagedItems.every(_ => _.state);
      }
    
    /*******************************Preview*************************************/
    contactListItems:any[];
      loadUsers(id:number,pagination:Pagination){
           if(id==undefined){
              id=this.previewContactListId;
          }else{
              this.previewContactListId = id;
          }
          this.contactService.loadUsersOfContactList( id,this.contactsUsersPagination).subscribe(
                  (data:any) => {
                      console.log(data);
                      console.log(pagination);
                      this.contactListItems = data.listOfUsers;
                      console.log(this.contactListItems);
                      pagination.totalRecords = data.totalRecords;
                      this.contactsUsersPagination = this.pagerService.getPagedItems(pagination, this.contactListItems);
                      $('#users-modal-body').html('');
                      var html = "";
                      html+= '<table  class="table table-striped table-hover table-bordered" id="sample_editable_1">'+
                              '<thead>'+
                                  '<tr>'+
                                      '<th>EMAIL ID</th>'+
                                      '<th>FIRST NAME</th>'+
                                      '<th>LAST NAME</th>'+
                                  '</tr>'+
                              '</thead>'+
                               '<tbody>';
                      $.each(this.contactsUsersPagination.pagedItems,function(index,value){
                          var firstName = value.firstName;
                          var lastName = value.lastName;
                          if(firstName==null || firstName=="null"){
                              firstName="";
                          }
                         if(lastName==null || lastName=="null"){
                             lastName = "";
                         }
                          html+= '<tr>'+
                                      '<td>'+value.emailId+'</td>'+
                                      '<td>'+firstName+'</td>'+
                                      '<td>'+lastName+'</td>'+
                                  '</tr>';
                      });     
                       html+='</tbody>';
                       html+='</table>';
                      $('#users-modal-body').append(html);
                      $('#usersModal').modal({backdrop: 'static', keyboard: false});
                  },
                  error =>
                  () => console.log( "MangeContactsComponent loadUsersOfContactList() finished" )
              )
      }
      
      closeModelPopup(){
          this.contactsUsersPagination = new Pagination();
      }
    
    /*************************************************************Email Template***************************************************************************************/
    loadEmailTemplates(pagination:Pagination){
        this.refService.loading(this.campaignEmailTemplate.httpRequestLoader, true);
        pagination.campaignDefaultTemplate = true;
        this.emailTemplateService.listTemplates(pagination,this.loggedInUserId)
        .subscribe(
            (data:any) => {
                this.campaignEmailTemplates = data.emailTemplates;
                pagination.totalRecords = data.totalRecords;
                this.emailTemplatesPagination = this.pagerService.getPagedItems(pagination, data.emailTemplates);
                if(this.emailTemplatesPagination.totalRecords==0 &&this.selectedEmailTemplateRow==0){
                    this.isEmailTemplate = false;
                }
                this.refService.loading(this.campaignEmailTemplate.httpRequestLoader, false);
            },
            (error:string) => {
                this.logger.error(this.refService.errorPrepender+" loadEmailTemplates():"+error);
                this.refService.showServerError(this.campaignEmailTemplate.httpRequestLoader);
            },
            () => this.logger.info("Finished loadEmailTemplates()", this.emailTemplatesPagination)
            )
    }
    

    
    getEmailTemplatePreview(emailTemplate:EmailTemplate){
        console.log(emailTemplate.body);
        let body = emailTemplate.body;
        this.selectedEmailTemplateName = emailTemplate.name;
        $("#htmlContent").empty();
        $("#email-template-title").empty();
        $("#email-template-title").append(emailTemplate.name);
        if(this.campaignType=='video'){
            let selectedVideoGifPath = this.launchVideoPreview.gifImagePath;
            let updatedBody = emailTemplate.body.replace("<xtremandImgURL>",selectedVideoGifPath);
            updatedBody = updatedBody.replace("https://aravindu.com/vod/images/xtremand-video.gif",selectedVideoGifPath);
            $("#htmlContent").append(updatedBody);
        }else{
          $("#htmlContent").append(emailTemplate.body);
        }
        $('.modal .modal-body').css('overflow-y', 'auto'); 
        $('.modal .modal-body').css('max-height', $(window).height() * 0.75);
        $("#show_email_template_preivew").modal({backdrop: 'static', keyboard: false});
    }
    filterTemplates(type:string,index:number){
       if(type=="BASIC"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.BASIC;
           this.selectedEmailTemplateType = EmailTemplateType.BASIC;
       }else if(type=="RICH"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.RICH;
           this.selectedEmailTemplateType = EmailTemplateType.RICH;
       }else if(type=="UPLOADED"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.UPLOADED;
           this.selectedEmailTemplateType = EmailTemplateType.UPLOADED;
       }else if(type=="NONE"){
           this.emailTemplatesPagination.emailTemplateType = EmailTemplateType.NONE;
           this.selectedEmailTemplateType = EmailTemplateType.NONE;
       }
        
        this.selectedEmailTemplateTypeIndex = index;
        this.emailTemplatesPagination.pageIndex = 1;
        this.loadEmailTemplates(this.emailTemplatesPagination);
        
        
    }
    
    
 
    setEmailTemplate(emailTemplate:EmailTemplate){
        $('#emailTemplateContent').html('');
        this.emailTemplateHrefLinks = [];
        this.selectedEmailTemplateRow = emailTemplate.id;
        this.isEmailTemplate = true;
        this.campaign.emailTemplate = emailTemplate;
        this.getAnchorLinksFromEmailTemplate(emailTemplate.body);
    }
    
    getAnchorLinksFromEmailTemplate(body:string){
        $('#emailTemplateContent').append(body);
        console.log($('#emailTemplateContent').find('a'));
        let self = this;
        $('#emailTemplateContent').find('a').each(function(e) {
           let href = $(this).attr('href');
           self.emailTemplateHrefLinks.push(href);
        });
        this.emailTemplateHrefLinks = this.refService.removeDuplicates(this.emailTemplateHrefLinks);
        console.log(this.emailTemplateHrefLinks);
    }

    /*************************************************************Launch Campaign***************************************************************************************/
    validateLaunchForm(): void {
        this.campaignLaunchForm = this.fb.group( {
            'scheduleCampaign': [this.campaign.scheduleCampaign,Validators.required],
            'launchTime': [this.campaign.scheduleTime],
        },{
            validator: validateCampaignSchedule('scheduleCampaign', 'launchTime')
        }
        );

        this.campaignLaunchForm.valueChanges
            .subscribe( data => this.onLaunchValueChanged( data ) );

        this.onLaunchValueChanged(); // (re)set validation messages now
    }

    //campaign lunch form value changed method 
    onLaunchValueChanged( data?: any ) {
        if ( !this.campaignLaunchForm ) { return; }
        const form = this.campaignLaunchForm;
        let value = this.campaignLaunchForm['_value'].scheduleCampaign;
        if(value=="NOW"){
            this.buttonName = "Launch";
        }else if(value=="SAVE"){
            this.buttonName = "Save";
        }else if(value=="SCHEDULE"){
            this.buttonName = "Schedule";
        }
        if(this.campaignLaunchForm['_value'].scheduleCampaign!=null){this.isScheduleSelected=true}
        for ( const field in this.formErrors ) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get( field );

            if ( control && control.dirty && !control.valid ) {
                const messages = this.validationMessages[field];
                for ( const key in control.errors ) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
    /****************Sending Test Email*************************/
    addEmailId(){
        var self = this;
        swal({
            title: 'Please Enter Email Id',
            input: 'email',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: function (email:string) {
              return new Promise(function (resolve, reject) {
                setTimeout(function() {
                    resolve();
                }, 2000)
              })
            },
            allowOutsideClick: false,
            
          }).then(function (email:string) {
              self.sendTestEmail(email);
              })
       }
   
    getCampaignData( emailId: string ) {
        if ( this.campaignType == "regular" ) {
            this.campaign.regularEmail = true;
        } else {
            this.campaign.regularEmail = false;
        }
        this.filteredSocialStatusProviders();
        if(this.campaignLaunchForm.value.scheduleCampaign==this.sheduleCampaignValues[1]){
            let dateTime = this.campaignLaunchForm.value.launchTime;
            let date = dateTime.split(' ')[0];
            this.date = date.replace("-","/");
        }
       
        for(var i=0;i<this.replies.length;i++){
            let reply = this.replies[i];
            $('#'+reply.divId).css('background-color','');
            reply.subject = this.getCkEditorContent(reply.divId);
            let replyTime = reply.replyTime;
            if(replyTime!=undefined && reply.subject.length>0){
                console.log(reply);
                 if(this.campaignLaunchForm.value.scheduleCampaign==this.sheduleCampaignValues[1]){
                     replyTime = this.getCalculatedTime(replyTime, this.date, reply.replyInDays);
                 }
            }else{
                this.dataError = true;
                $('#'+reply.divId).css('background-color','#a94442');
            }
           
            
        }
        for(var i=0;i<this.urls.length;i++){
            let url = this.urls[i];
            console.log(url);
            $('#'+url.divId).css('background-color','');
            url.body = this.getCkEditorContent(url.divId);
            let replyTime = url.replyTime;
            if(replyTime!=undefined && url.subject!=null && url.body.length>0){
                console.log(url);
                if(this.campaignLaunchForm.value.scheduleCampaign==this.sheduleCampaignValues[1]){
                    url.replyTime = this.getCalculatedTime(url.replyTime, this.date, url.replyInDays)
                }
            }else{
                this.dataError = true;
                $('#'+url.divId).css('background-color','#a94442');
            }
           
        }
  
        var data = {
            'campaignName': this.campaign.campaignName,
            'fromName': this.campaign.fromName,
            'subjectLine': this.campaign.subjectLine,
            'email': this.campaign.email,
            'preHeader': this.campaign.preHeader,
            'message': this.campaign.message,
            'emailOpened': this.campaign.emailOpened,
            'videoPlayed': this.campaign.videoPlayed,
            'replyVideo': this.campaign.replyVideo,
            'socialSharingIcons': this.campaign.socialSharingIcons,
            'userId': this.loggedInUserId,
            'selectedVideoId': this.campaign.selectedVideoId,
            'userListIds': this.campaign.userListIds,
            "optionForSendingMials": "MOBINAR_SENDGRID_ACCOUNT",
            "scheduleCampaign": this.campaignLaunchForm.value.scheduleCampaign,
            'scheduleTime': this.campaignLaunchForm.value.launchTime,
            'campaignId': this.campaign.campaignId,
            'selectedEmailTemplateId': this.selectedEmailTemplateRow,
            'regularEmail': this.campaign.regularEmail,
            'testEmailId': emailId,
            'socialStatus': this.socialStatus,
            'campaignReplies':this.replies,
            'campaignUrls':this.urls
        };
        console.log(data);
        return data;
    }
   
    convertDate(dateString:string){
        return dateString.replace(/(\d{2})(\/)(\d{2})/, "$3$2$1");   
    }
    addDays(date:Date,days:number){
        return new Date(date.getTime() + days*24*60*60*1000);
    }
    getCalculatedTime(timeAMPM:Date,date:Date,days:number){
       console.log(timeAMPM);
        let hours =  timeAMPM.getHours(); //returns 0-23
        let minutes = timeAMPM.getMinutes();
        let convertedDateTime = date+" "+hours+":"+minutes;
        let time = new Date(this.convertDate(convertedDateTime));
        return this.addDays(time,days);
    }
    getCkEditorContent(divId:string){
        let name = 'editor'+divId.split('-')[1];
        return CKEDITOR.instances[name.trim()].getData();
    }
    sendTestEmail(emailId:string){
        let self = this;
        var data = this.getCampaignData(emailId);
        console.log(data);
        this.campaignService.sendTestEmail(data)
        .subscribe(
        data => {
           console.log(data);
           if(data.message=="CAMPAIGN_FOUND"){
               swal("Mail Sent Successfully", "", "success");
           }else{
               
           }
        },
        error => {
            this.logger.error("error in sendTestEmail()", error);
        },
        () => this.logger.info("Finished sendTestEmail()")
    );
    }
    
    addUserEmailIds(){
        let self = this;
        self.selectedContactLists = [];
        $('[name="campaignContact[]"]:checked').each(function(index){
            var id = $(this).val();
            var name = $(this)[0].lang;
            var  contactList = {'id':id,'name':name};
            if(self.selectedContactLists.length<=1){
                self.selectedContactLists.push(contactList);
            }
         });
        if(this.campaignType=="video"){
            this.playVideo();
        }
    }
    
    saveCampaignOnDestroy(){
        var data = this.getCampaignData("");
        console.log(data);
        this.campaignService.saveCampaign( data )
        .subscribe(
        data => {
            console.log(data);
            if(data.message=="success"){
                this.isLaunched = true;
            }
        },
        error => {
            this.logger.error("error in launchCampaign()", error);
        },
        () => this.logger.info("Finished launchCampaign()")
    );
    return false;
    }
  
    launchCampaign(){
        var data = this.getCampaignData("");
        if(this.dataError){}

        this.refService.campaignSuccessMessage = data.scheduleCampaign;
        this.campaignService.saveCampaign( data )
        .subscribe(
        response => {
            console.log(response);
            if(response.message=="success"){
                this.isLaunched = true;
                this.router.navigate(["/home/campaigns/managepublish"]);
            }else{
            }
        },
        error => {
            this.logger.error("error in launchCampaign()", error);
        },
        () => this.logger.info("Finished launchCampaign()")
    ); 
    
    
    return false;
    }
    
  
    /********************************************On Destory********************************************/
    ngOnDestroy() {
        this.campaignService.campaign = undefined;
        this.names = [];
        this.name = "";
        if(!this.isLaunched){
           if(this.isAdd){
               this.saveCampaignOnDestroy();
           }else{
               let self = this;
               swal( {
                   title: 'Are you sure?',
                   text: "You have unchanged Campaign data",
                   type: 'warning',
                   showCancelButton: true,
                   confirmButtonColor: '#3085d6',
                   cancelButtonColor: '#d33',
                   confirmButtonText: 'Yes, Save it!'

               }).then( function() {
                   self.saveCampaignOnDestroy();
               })
           }
        }
        this.refService.campaignVideoFile = undefined;
        this.refService.selectedCampaignType = "";
         }
    
    /*************************************************************Form Errors**************************************************************************************/
    formErrors = {
            'campaignName': '',
            'fromName': '',
            'subjectLine': '',
            'email': '',
            'preHeader': '',
            'message': '',
            'scheduleCampaign': '',
            'launchTime': '',
            'contactListId': ''
        };

        validationMessages = {
            'campaignName': {
                'required': 'Name is required.',
                'minlength': 'Title must be at least 4 characters long.',
                'maxlength': 'Title cannot be more than 24 characters long.',
            },
            'fromName': {
                'required': 'From Name is required'
            },
            'subjectLine': {
                'required': 'subject line is required'
            },
            'email': {
                'required': 'email is required',
                'pattern':'Invalid Email Id'
            },
            'preHeader': {
                'required': 'preHeader is required'
            },

            'message': {
                'required': 'message is required'
            },
            'scheduleCampaign': {
                'required': 'please select the schedule campaign'
            },
            'launchTime': {
                'required': 'please select the launch time'
            },
            'contactListId': {
                'pattern': 'please select atleast one contact list'
            }


        };
        
    /************************************************Tab Click Events******************************************************************************/
        resetActive( event: any, percent: number, step: string ) {
            $( ".progress-bar" ).css( "width", percent + "%" ).attr( "aria-valuenow", percent );
            $( ".progress-completed" ).text( percent + "%" );
            this.hideSteps();
            this.showCurrentStepInfo( step );

        }

        hideSteps() {
            $( "div" ).each( function() {
                if ( $( this ).hasClass( "activeStepInfo" ) ) {
                    $( this ).removeClass( "activeStepInfo" );
                    $( this ).addClass( "hiddenStepInfo" );
                }
            });
        }

        showCurrentStepInfo( step ) {
            var id = "#" + step;
            if(step=="step-2"){
                this.campaignDetailsTabClass = this.currentTabActiveClass;
                if(this.isContactList){
                    //Setting Sky Blue Color
                    this.contactListTabClass = this.successTabClass;
                }else{
                    this.contactListTabClass = this.inActiveTabClass;
                }
               if(this.isVideo){
                   this.videoTabClass  = this.successTabClass;
               }else{
                   this.videoTabClass  = this.inActiveTabClass;
               }
               if(this.isEmailTemplate){
                   this.emailTemplateTabClass = this.successTabClass;
               }else{
                   this.emailTemplateTabClass = this.inActiveTabClass;
               }
               if(this.campaignLaunchForm.valid){
                   this.launchCampaignTabClass = this.successTabClass;
               }else{
                   this.launchCampaignTabClass = this.inActiveTabClass;
               }
                
            }
            else if(step=="step-3"){
                this.videoTabClass = this.currentTabActiveClass;
                this.campaignDetailsTabClass = this.successTabClass;
                if(this.isContactList){
                    this.contactListTabClass = this.successTabClass;
                }else{
                    this.contactListTabClass = this.inActiveTabClass;
                }
                if(this.isEmailTemplate){
                    this.emailTemplateTabClass = this.successTabClass;
                }else{
                    this.emailTemplateTabClass = this.inActiveTabClass;
                }
                if(this.campaignLaunchForm.valid){
                    this.launchCampaignTabClass = this.successTabClass;
                }else{
                    this.launchCampaignTabClass = this.inActiveTabClass;
                }
            }else if(step=="step-4"){
                //Highlighting Contact List Tab With Oragne
                this.contactListTabClass  = this.currentTabActiveClass;
                this.campaignDetailsTabClass = this.successTabClass;
                this.videoTabClass  = this.successTabClass;
                if(this.isEmailTemplate){
                    this.emailTemplateTabClass = this.successTabClass;
                }else{
                    this.emailTemplateTabClass = this.inActiveTabClass;
                }
                if(this.campaignLaunchForm.valid){
                    this.launchCampaignTabClass = this.successTabClass;
                }else{
                    this.launchCampaignTabClass = this.inActiveTabClass;
                }
            }else if(step=="step-5"){
              //Highlighting Email Templatet Tab With Oragne
                this.emailTemplateTabClass = this.currentTabActiveClass;
                this.videoTabClass = this.successTabClass;
                this.campaignDetailsTabClass = this.successTabClass;
                this.contactListTabClass = this.successTabClass;
                if(this.campaignLaunchForm.valid){
                    this.launchCampaignTabClass = this.successTabClass;
                }else{
                    this.launchCampaignTabClass = this.inActiveTabClass;
                }
            }else if(step=="step-6"){
              //Highlighting Launch With Oragne
                this.launchCampaignTabClass = this.currentTabActiveClass;
                this.campaignDetailsTabClass = this.successTabClass;
                this.contactListTabClass = this.successTabClass;
                this.videoTabClass  = this.successTabClass;
                this.emailTemplateTabClass = this.successTabClass;
                this.initializeSocialStatus();
                if(!this.isAdd && this.campaign.emailTemplate!=undefined){
                    this.getAnchorLinksFromEmailTemplate(this.campaign.emailTemplate.body);
                }
                
            }
            
            $( id ).addClass( "activeStepInfo" );
        }
        
        
        /**
         * @author Manas Ranjan Sahoo
         * @since 27/06/2017
         */
        
        initializeSocialStatus() {
            this.socialStatus.id = null;
            this.socialStatus.shareNow = true;
            this.socialStatus.socialStatusContents = new Array<SocialStatusContent>();

            if ( this.campaignType == 'regular' ) {
                this.socialStatus.statusMessage = this.campaign.subjectLine;
            } else if ( this.campaignType == 'video' ) {
                this.socialStatus.statusMessage = this.launchVideoPreview.title;
                let socialStatusContent: SocialStatusContent = new SocialStatusContent();
                socialStatusContent.id = this.launchVideoPreview.id;
                socialStatusContent.fileName = this.launchVideoPreview.title;
                socialStatusContent.fileType = "video";
                socialStatusContent.filePath = this.launchVideoPreview.videoPath;
                this.socialStatus.socialStatusContents.push( socialStatusContent );
            }
            this.listSocialStatusProviders();
        }

        listSocialStatusProviders() {
            const socialConnections = this.socialService.socialConnections;
            this.socialStatus.socialStatusProviders = new Array<SocialStatusProvider>();
            for ( const i in socialConnections ) {
                let socialStatusProvider = new SocialStatusProvider();

                socialStatusProvider.providerId = socialConnections[i].profileId;
                socialStatusProvider.providerName = socialConnections[i].source;
                socialStatusProvider.profileImagePath = socialConnections[i].profileImage;
                socialStatusProvider.profileName = socialConnections[i].profileName;

                if ( ( 'TWITTER' === socialConnections[i].source ) ) {
                    socialStatusProvider.oAuthTokenValue = socialConnections[i].oAuthTokenValue;
                    socialStatusProvider.oAuthTokenSecret = socialConnections[i].oAuthTokenSecret;
                } else {
                    socialStatusProvider.accessToken = socialConnections[i].accessToken;
                }
                this.socialStatus.socialStatusProviders.push( socialStatusProvider );
            }
        }
        
        filteredSocialStatusProviders(){
            let socialStatusProviders = this.socialStatus.socialStatusProviders;
            if(socialStatusProviders !== undefined){
                socialStatusProviders = socialStatusProviders.filter( function( obj ) {
                    return obj.selected === true;
                });
            }
            this.socialStatus.socialStatusProviders = socialStatusProviders;
        }
        
        updateStatus() {
            let socialStatusProviders = this.socialStatus.socialStatusProviders;
            socialStatusProviders = socialStatusProviders.filter( function( obj ) {
                return obj.selected === true;
            });
            this.socialStatus.socialStatusProviders = socialStatusProviders;
            console.log( this.socialStatus );
            swal( { title: 'Updating Status', text: "Please Wait...", showConfirmButton: false, imageUrl: "http://rewardian.com/images/load-page.gif" });
            this.socialService.updateStatus( this.loggedInUserId, this.socialStatus )
                .subscribe(
                data => {
                    this.initializeSocialStatus();
                },
                error => {
                    console.log( error );
                },
                () => console.log( "Finished" )
                );
        }
 /***************************Email Rules***********************************/
        addReplyRows() {
            this.reply = new Reply();
            let length = this.allItems.length;
            length = length+1
            var id = 'reply-'+length;
            this.reply.divId = id;
            this.reply.actionId = 0;
            this.replies.push(this.reply);
            this.allItems.push(id);
          }
        addClickRows(){
            this.url = new Url();
            let length = this.allItems.length;
            length = length+1
            var id = 'click-'+ length;
            this.url.divId = id;
            this.url.url = this.emailTemplateHrefLinks[0];
            this.urls.push(this.url);
            this.allItems.push(id);
        }
        
     remove(divId:string,type:string){
       console.log(divId);
         if(type=="replies"){
             this.replies = this.spliceArray(this.replies,divId);
             console.log(this.replies);
         }else{
             this.urls = this.spliceArray(this.urls,divId);
             console.log(this.urls);
         }
         $('#'+divId).remove();
         let index = divId.split('-')[1];
         let editorName = 'editor'+index;
         console.log("Removing"+editorName);
         CKEDITOR.instances[editorName].destroy();
     }

     
     spliceArray(arr:any,id:string){
         arr = $.grep(arr, function(data, index) {
             return data.divId != id
          });
         return arr;
     }
}
