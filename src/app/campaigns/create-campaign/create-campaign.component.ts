import { Component, OnInit,OnDestroy,ViewChild, ElementRef,AfterViewInit} from '@angular/core';
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
import { EmailTemplate } from '../../email-template/models/email-template';
import { SaveVideoFile } from '../../videos/models/save-video-file';
import { ContactList } from '../../contacts/models/contact-list';
import { Category } from '../../videos/models/category';
import { EmailTemplateType } from '../../email-template/models/email-template-type';
declare var swal, $, videojs , Metronic, Layout , Demo,TableManaged ,Promise, flatpickr: any,jQuery:any;

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.css','../../../assets/css/video-css/ribbons.css']
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
    /***************Contact List************************/
    isContactList:boolean = false;
    contactsPagination:Pagination = new Pagination();
    campaignContactLists: Array<ContactList>;
    numberOfContactsPerPage = [
                               {'name':'10','value':'10'},
                               {'name':'20','value':'20'},
                               {'name':'30','value':'30'},
                               {'name':'40','value':'40'},
                               {'name':'50','value':'50'},
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
    selectedVideoFilePath:string = "";
    poster:string = "";
    is360Video:boolean = false;
    selectedContactListNames:string[] = [];
    id:number;
    previewContactListId : number;
    public sheduleCampaignValues = ['NOW', 'SCHEDULE', 'SAVE'];
    isLaunched:boolean = false;
    /***********End Of Declation*************************/
    constructor(private fb: FormBuilder,private route: ActivatedRoute, private refService:ReferenceService,
                private logger:Logger,private videoFileService:VideoFileService,
                private authenticationService:AuthenticationService,private pagerService:PagerService,
                private userService:UserService,private campaignService:CampaignService,private contactService:ContactService,
                private emailTemplateService:EmailTemplateService,private router:Router
            ){
        this.logger.info("create-campaign-component constructor loaded");
        this.campaign = new Campaign();
        if ( this.userService.loggedInUserData != undefined ) {
            this.campaign.userId = this.userService.loggedInUserData.id;
            this.loadCampaignNames( this.userService.loggedInUserData.id );
            }
        if(this.campaignService.campaign!=undefined){
            $('head').append('<script src="https://yanwsh.github.io/videojs-panorama/videojs/v5/video.min.js"  class="p-video"  />');
            this.isAdd = false;
            this.editedCampaignName = this.campaignService.campaign.campaignName;
            this.campaign = this.campaignService.campaign;
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
                var alias = this.campaign.campaignVideoFile.alias;
                if(this.campaign.campaignVideoFile.is360video){
                    this.is360Video = true;
                    this.selectedVideoFilePath = this.campaign.campaignVideoFile.videoPath.replace(".m3u8",".mp4")+"?access_token="+this.authenticationService.access_token;
                    this.poster = this.campaign.campaignVideoFile.imagePath;
                }else{
                     this.is360Video = false;
                     this.selectedVideoFilePath = this.campaign.campaignVideoFile.videoPath.replace(".m3u8",".mp4")+"?access_token="+this.authenticationService.access_token;
                    // this.selectedVideoFilePath = this.campaign.campaignVideoFile.videoPath.replace(".mp4","_mobinar.m3u8")+"?access_token="+this.authenticationService.access_token;
                     this.poster = this.campaign.campaignVideoFile.imagePath;
                 }
            }
            
            /***********Select Contact List Tab*************************/
            if(this.campaign.userListIds.length>0){
                this.isContactList = true;
                this.contactListTabClass = this.successTabClass;
                this.contactsPagination.editCampaign = true;
                this.contactsPagination.campaignUserListIds = this.campaign.userListIds.sort();
                this.isCampaignDraftContactList = true;
                let self = this;
                self.selectedContactListNames = [];
                $('[name="campaignContact[]"]:checked').each(function(){
                    self.selectedContactListNames.push($(this)[0].lang);
                 });
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
            if(emailTemplate!=undefined){
                this.isEmailTemplate = true;
                //this.getEmailTemplatePreview(emailTemplate);
            }else{
                this.logger.info("No Email Template Added For Campaign");
            }
        }//End Of Edit
        if(this.isAdd){
            this.campaignType = this.refService.selectedCampaignType;
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
        }else{
            this.width="25%";
            this.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
            this.isVideo = true;
            $('#videoTab').hide();
        }  
        this.loadEmailTemplates(this.emailTemplatesPagination);//Loading Email Templates
    }
    
    /******************************************Pagination Related Code******************************************/
    setPage(pageIndex:number,module:string){
        if(module=="videos"){
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
         console.log(campaignName);
         var list = this.names[0];
         console.log(list);
         if(this.isAdd){
             if($.inArray(campaignName, list) > -1){
                 this.isValidCampaignName = false;  
             }else{
                 this.isValidCampaignName = true;
             }
         }else{
             console.log(this.editedCampaignName+":::::::::"+campaignName);
             if($.inArray(campaignName, list) > -1 && this.editedCampaignName!=campaignName){
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
    setClickedRow = function(index,videoFile:any){
       console.log(videoFile);
        if(videoFile.viewBy=="DRAFT"){
            this.draftMessage = "Video is in draft mode, please update the publish options to Library or Viewers.";
        }else{
            this.selectedRow = index;
            $('#campaign_video_id_'+index).prop( "checked", true );
            this.campaign.selectedVideoId =videoFile.id;
            this.isVideo = true;
            if(!(this.isAdd)){
                if(index==-1){
                    $('#selectedVideoRow').addClass("active");
                }else{
                    $('#selectedVideoRow').removeClass("active");
                }
               
            }
            if(videoFile.is360video){
                this.is360Video = true;
                this.selectedVideoFilePath = videoFile.videoPath.replace(".m3u8",".mp4")+"?access_token="+this.authenticationService.access_token;
                this.poster = videoFile.imagePath;
            }else{
                 this.is360Video = false;
                 this.selectedVideoFilePath = videoFile.videoPath.replace(".","_mobinar.m3u8")+"?access_token="+this.authenticationService.access_token;
               //  this.selectedVideoFilePath = this.campaign.campaignVideoFile.videoPath.replace(".mp4","_mobinar.m3u8")+"?access_token="+this.authenticationService.access_token;
                 this.poster = videoFile.imagePath;
             }
        
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
            },
            (error:string) => {
                this.logger.error("error in loadCampaignVideos()", error);
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
        var alias = videoFile.alias;
        var fullImagePath = videoFile.imagePath;
        var title = videoFile.title;
        var videoPath = videoFile.videoPath;
        var is360 = videoFile.is360video;
        $("#main_video").empty();
        $("#modal-title").empty();
        $('head').append('<link href="assets/js/indexjscss/video-hls-player/video-hls-js.css" rel="stylesheet">');
        if(title.indexOf("360")>-1){
            console.log("Loaded 360 Video");
            $('.h-video').remove();
            $('head').append('<script src="assets/js/indexjscss/360-video-player/video.js" type="text/javascript"  class="p-video"/>');
            $('head').append('<script src="assets/js/indexjscss/360-video-player/three.js" type="text/javascript"  class="p-video" />');
            $('head').append('<link href="assets/js/indexjscss/360-video-player/videojs-panorama.min.css" rel="stylesheet"  class="p-video">');
            $('head').append('<script src="assets/js/indexjscss/360-video-player/videojs-panorama.v5.js" type="text/javascript"  class="p-video" />');
            var str = '<video id=videoId poster='+fullImagePath+'  class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
            $("#modal-title").append(title);
            $("#main_video").append(str);
            console.log("360 video path"+videoPath);
          //  videoPath = videoPath.replace(".mp4","_mobinar.m3u8");//Replacing .mp4 to .m3u8
            $("#main_video video").append('<source src="'+videoPath+'" type="video/mp4">');
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
            
        }else{
            console.log("Loaded Normal Video");
            $('.p-video').remove();
            $('head').append('<script src="assets/js/indexjscss/video-hls-player/video-hls.js" type="text/javascript" class="h-video"  />');
            $('head').append('<script src="assets/js/indexjscss/video-hls-player/videojs.hls.min.js" type="text/javascript"  class="h-video" />');
            var str = '<video id=videoId  poster='+fullImagePath+' preload="none"  class="video-js vjs-default-skin" controls></video>';
            $("#modal-title").append(title);
            $("#main_video").append(str);
           // videoPath = videoPath.replace(".mp4","_mobinar.m3u8");//Replacing .mp4 to .m3u8
            console.log("Video Path:::"+videoPath);
            videoPath = videoPath.substring(0,videoPath.lastIndexOf('.'));
            videoPath =  videoPath + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
            console.log("Normal Video Updated Path:::"+videoPath);
           $("#main_video video").append('<source src='+videoPath+' type="application/x-mpegURL">');
            $("#videoId").css("width", "550px");
            $("#videoId").css("height", "310px");
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
        
        $("#show_preview").modal({backdrop: 'static', keyboard: false});
    }
    destroyPreview(){
        var player = videojs("videoId");
        if(player){
            player.dispose();
            $("#main_video").empty();
        }
    }
   
    /*************************************************************Contact List***************************************************************************************/
    loadCampaignContacts(contactsPagination:Pagination) {
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
            },
            (error:string) => {
                this.logger.error("error in loadCampaignContacts()", error);
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
    
    
    highlightRow(contactId:number){
        if($('#'+contactId).is(':checked')){
            $('#'+contactId).prop( "checked", false );
            $('#campaignContactListTable_'+contactId).removeClass('contact-list-selected');
        }else{
            $('#'+contactId).prop( "checked", true );
            $('#campaignContactListTable_'+contactId).addClass('contact-list-selected');
        }
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
    highlightSelectedRows(){
        var selectedContactListIds = this.campaign.userListIds.sort();
        $.each(selectedContactListIds,function(index,value){
            $('#campaignContactListTable_'+value).addClass('contact-list-selected');
        });
    }
    checkAll(ev:any){
        if(ev.target.checked){
            $('[name="campaignContact[]"]').prop('checked', true);
            this.isContactList = true;
            $('[name="campaignContact[]"]:checked').each(function(){
                var id = $(this).val();
                $('#campaignContactListTable_'+id).addClass('contact-list-selected');
             });
        }else{
            $('[name="campaignContact[]"]').prop('checked', false);
            this.isContactList = false;
            $('#user_list_tb tr').removeClass("contact-list-selected");
        }
    }
    
    isAllChecked() {
        return this.contactsPagination.pagedItems.every(_ => _.state);
      }
    
                /*******************************Preview*************************************/
    contactListItems:any[];
      loadUsers(id:number,pagination:Pagination){
          //this.previewContactListId = id;
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
        pagination.campaignDefaultTemplate = true;
        this.emailTemplateService.listTemplates(pagination,this.userService.loggedInUserData.id)
        .subscribe(
            (data:any) => {
                this.campaignEmailTemplates = data.emailTemplates;
                pagination.totalRecords = data.totalRecords;
                this.emailTemplatesPagination = this.pagerService.getPagedItems(pagination, data.emailTemplates);
                if(this.emailTemplatesPagination.totalRecords==0 &&this.selectedEmailTemplateRow>0 ){
                    this.isEmailTemplate = false;
                }
            },
            (error:string) => {
                this.logger.error("error in loadEmailTemplates()", error);
            },
            () => this.logger.info("Finished loadEmailTemplates()", this.emailTemplatesPagination)
            )
    }
    

    
    getEmailTemplatePreview(emailTemplate:EmailTemplate){
        this.selectedEmailTemplateName = emailTemplate.name;
        $("#htmlContent").empty();
        $("#email-template-title").empty();
        $("#email-template-title").append(emailTemplate.name);
        $("#htmlContent").append(emailTemplate.body);
        //$("#show_email_template_preivew").css({height:"350px", overflow:"auto"});
        $("#show_email_template_preivew").modal({backdrop: 'static', keyboard: false});
            
    }
    filterTemplates(type:EmailTemplateType,index:number){
        this.emailTemplatesPagination.emailTemplateType =type;
        this.selectedEmailTemplateType = type;
        this.selectedEmailTemplateTypeIndex = index;
        this.emailTemplatesPagination.pageIndex = 1;
        this.loadEmailTemplates(this.emailTemplatesPagination);
        
        
    }
    
    
 
    setEmailTemplate(emailTemplate:EmailTemplate){
       this.selectedEmailTemplateRow = emailTemplate.id;
       this.isEmailTemplate = true;
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
    
    getCampaignData(emailId:string){
        let self = this;
       $('[name="campaignContact[]"]:checked').each(function(){
           self.campaign.userListIds.push($(this).val());
        });
       let filteredUserListIds =this.remove_duplicates(self.campaign.userListIds);
        if(this.campaignType== "regular"){
            this.campaign.regularEmail = true;
        }else{
            this.campaign.regularEmail = false;
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
                'userId':this.userService.loggedInUserData.id,
                'selectedVideoId':this.campaign.selectedVideoId,
                'userListIds':filteredUserListIds,
                "optionForSendingMials": "MOBINAR_SENDGRID_ACCOUNT",
                "scheduleCampaign": this.campaignLaunchForm.value.scheduleCampaign,
                'scheduleTime':this.campaignLaunchForm.value.launchTime,
                'campaignId':this.campaign.campaignId,
                'selectedEmailTemplateId':this.selectedEmailTemplateRow,
                'regularEmail':this.campaign.regularEmail,
                'testEmailId':emailId
                
        };
        return data;
        
    }
    remove_duplicates(arr) {
        let obj = {};
        for (let i = 0; i < arr.length; i++) {
            obj[arr[i]] = true;
        }
        arr = [];
        for (let key in obj) {
            arr.push(key);
        }
        return arr;
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
        self.selectedContactListNames = [];
        $('[name="campaignContact[]"]:checked').each(function(){
            self.selectedContactListNames.push($(this)[0].lang);
         });
        if(this.campaignType=='video'){
            if(this.is360Video){
                this.play360Video();
             }else{
                 this.playNormalVideo();
             }
        }
       
        
    }
    play360Video(){
        $('.h-video').remove();
        $('head').append('<script src="https://yanwsh.github.io/videojs-panorama/videojs/v5/video.min.js"  class="p-video"  />');
        var player = videojs('campaignVideo');
        console.log(player);
        player.panorama({
            autoMobileOrientation: true,
            clickAndDrag: true,
            clickToToggle: true,
            callback: function () {
              player.ready();
            }
          });
    }
    playNormalVideo(){
        $('.p-video').remove();
        $('head').append('<script src="assets/js/indexjscss/video.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/videojs.hotkeys.min.js"  class="h-video"  />');
        $('head').append('<script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/5.5.0/videojs-contrib-hls.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/videojs-playlist.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/webcam-capture/RecordRTC.js"  class="h-video"  />');
        $('head').append('<script src="assets/js/indexjscss/videojs.record.js"  class="h-video"  />');
        var player = videojs('campaignVideo');
        player.ready();
    
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
                /*if(this.isAdd){
                    this.refService.isCampaignCreated  = true;
                }else{
                    this.refService.isCampaignUpdated = true;
                }*/
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
    
    launchCampaign(){
        var data = this.getCampaignData("");
        console.log(data);
        this.campaignService.saveCampaign( data )
        .subscribe(
        data => {
            console.log(data);
            if(data.message=="success"){
                this.isLaunched = true;
                if(this.isAdd){
                    this.refService.isCampaignCreated  = true;
                }else{
                    this.refService.isCampaignUpdated = true;
                }
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

           /* $( "div" ).each( function() {
                if ( $( this ).hasClass( "activestep" ) ) {
                    $( this ).removeClass( "activestep" );
                }
            });*/
            /*if ( event.target.className == "col-md-2" ) {
                $( event.target ).addClass( "activestep" );
            }
            else {
                $( event.target.parentNode ).addClass( "activestep" );
            }*/
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
            //var successTabColor = '#00a6e8';
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
            }
            
            $( id ).addClass( "activeStepInfo" );
           /* var stepId = step.split('-')[1];
            $('#step'+stepId).css('color','#7ba0bb');*/
        }
        
}
