import { Component, OnInit,OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { validateCampaignSchedule,validateCampaignName } from '../../form-validator'; // not using multipleCheckboxRequireOne

import { VideoFileService} from '../../videos/services/video-file.service';
import { ContactService } from '../../contacts/contact.service';
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
import { Pagination } from '../../core/models/pagination';

declare var swal, $, videojs , Metronic, Layout , Demo,TableManaged ,Promise: any;

@Component({
  selector: 'app-publish-content',
  templateUrl: './publish-content.component.html',
  styleUrls: ['./publish-content.component.css','../../../assets/css/video-css/ribbons.css','../../../assets/css/form.errors.css']
})
export class PublishContentComponent implements OnInit,OnDestroy {

    public campaignVideos: Array<SaveVideoFile>;
    public campaignEmailTemplates:Array<EmailTemplate>;
    public campaignContactLists: Array<ContactList>;
    publishAsForm:FormGroup;
    campaignForm: FormGroup;
    campaignLaunchForm: FormGroup;
    public isAvailable: boolean = false;
    public isVideoSelected:boolean = false;
    public isEmailTemplateSelected:boolean = false;
    public isContactListSelected:boolean = false;
    public isPublishAsSelected:boolean = false;
    public isScheduleSelected:boolean = false;
    isAdd = true;
    videoId: number;
    emailType:string;
    emailTemplateId:number;
    videoForm: FormGroup;
    emailTemplateForm: FormGroup;
    contactListForm: FormGroup;
    campaign:Campaign;
    launchSuccess = false;
    names:string[]=[];
    public totalVideoRecords :number;
    categories: Category[];
    categoryAnother:string = "All Categories";
    categoryNum:number=0;
    imagepath: string;
    pager: any = {};
    pagedItems: any[];
    pageBar: boolean;
    isvideosLength:boolean;
    public searchKey :string ;
    private videoJSplayer: any;
    sortingName:string = null;
    sortcolumn :string = null;
    sortingOrder :string = null;
    name:string = "";
    public sheduleCampaignValues = ['NOW', 'SCHEDULE', 'SAVE'];
    public emailTypes = ['Video Email','Regular Email'];
    
    videosPagination:Pagination = new Pagination();
    contactsPagination:Pagination = new Pagination();
    emailTemplatesPagination:Pagination = new Pagination();
    
    isvideoThere:boolean;
    public isCategoryThere :boolean=false;
    public isCategoryUpdated:boolean;
    public emailTemplateHtmlPreivew:string="";
    public selectedVideoFilePath:string = "";
    public selectedContactListName:string = "";
    public selectedEmailTemplateName:string="";
        
    
    numberOfContactsPerPage = [
                            {'name':'10','value':'10'},
                            {'name':'20','value':'20'},
                            {'name':'30','value':'30'},
                            {'name':'40','value':'40'},
                            {'name':'50','value':'50'},
                            {'name':'---All---','value':'0'},
                            ]
    public contactItemsSize:any = this.numberOfContactsPerPage[0];
                            
    constructor( private videoFileService: VideoFileService, private route: ActivatedRoute, private fb: FormBuilder,
        private contactService: ContactService, private campaignService: CampaignService, private userService: UserService,private emailTemplateService:EmailTemplateService,private pagerService:PagerService,private authenticationService: AuthenticationService ) {
        this.campaign = new Campaign();
        if ( this.campaignService.campaign != undefined ) {
            console.log(this.campaignService.campaign);
           this.campaign = this.campaignService.campaign;
           if(this.campaign.launchTime!=undefined){
               this.campaign.launchTime = new Date((this.campaign.launchTime).toString());  // added to string() to launchtime
           }
            this.videoId = this.campaignService.campaign.selectedVideoId;
            this.emailTemplateId =  this.campaignService.campaign.selectedEmailTemplateId;
            this.isAdd = false;
            this.isVideoSelected = true;
            this.isContactListSelected = true;
            this.isScheduleSelected = true;
            this.isEmailTemplateSelected = true;
            this.name = this.campaignService.campaign.campaignName;
            if(this.campaignService.campaign.endTime.toString() !="null"){   // added to String() method here also
                this.campaign.scheduleCampaign  = this.sheduleCampaignValues[2];
            }
            if(this.campaignService.campaign.launchTime!=null){
                this.campaign.scheduleCampaign  = this.sheduleCampaignValues[1];
            }
            let emailTemplate = this.campaign.emailTemplate;
            if(emailTemplate.beeRegularTemplate || emailTemplate.regularTemplate){
                this.emailType = 'Regular Email';
                this.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
            }else{
                this.emailType = 'Video Email';
                this.emailTemplatesPagination.filterBy = "CampaignVideoEmails";
            }
            this.loadEmailTemplates(this.emailTemplatesPagination);
            this.contactsPagination.editCampaign = true;
            this.contactsPagination.campaignUserListIds = this.campaign.userListIds.sort();
            this.getEmailTemplatePreview(emailTemplate);
        }
        if(this.userService.loggedInUserData!=undefined){
           this.campaign.userId = this.userService.loggedInUserData.id;
            this.loadCampaignNames(this.userService.loggedInUserData.id);
        }
        
    }
    
    /************************************Start Of Videos********************************************************/
    sortVideos  = [
                   {'name':'Sort By','value':''},
                   {'name':'Title(A-Z)','value':'title-ASC'},
                   {'name':'Title(Z-A)','value':'title-DESC'},
                   {'name':'Created Time(ASC)','value':'createdTime-ASC'},
                   {'name':'Created Time(DESC)','value':'createdTime-DESC'},
                   {'name':'ViewBy(ASC)','value':'viewBy-ASC'},
                   {'name':'ViewBy(DESC)','value':'viewBy-DESC'}
                   ];


    loadCampaignVideos(pagination:Pagination) {
       try{
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
                   this.imagepath = this.campaignVideos[i].imagePath+"?access_token=" + this.authenticationService.access_token;
                   this.campaignVideos[i].imagePath = this.imagepath;
               }
               this.isCategoryThere = true;
               this.isCategoryUpdated = false;
               this.videosPagination = this.pagerService.getPagedItems(pagination, this.campaignVideos);
               console.log(this.videosPagination);
               swal.close();
            //  this.campaign.selectedVideoId = this.campaignVideos[0].id;
           },
           (error:string) => swal(error.toString(),"","error"),
           () => console.log( "Loading Mobinars Finished" )
           )
       }catch(error){
           swal(error.toString(),"","error");
       }
       
    }
    
   
    setPage(pageIndex:number,module:string){
        if(module=="videos"){
            this.videosPagination.pageIndex = pageIndex;
            this.loadCampaignVideos(this.videosPagination);
        }else if(module=="contacts"){
            this.contactsPagination.pageIndex = pageIndex;
            this.loadCampaignContacts(this.contactsPagination);
        }else if(module=="emailTemplates"){
            this.emailTemplatesPagination.pageIndex = pageIndex;
            this.loadEmailTemplates(this.emailTemplatesPagination);
        }
        
    }
    showUpdatevalue: boolean = false;
    showMessage: boolean = false;

    
    getCategoryNumber(event:any){
        console.log(event);
        this.showMessage = false;
        this.showUpdatevalue = false;
        this.isvideoThere = false;
        console.log(this.categoryNum);
        this.videosPagination.filterBy =  (<HTMLInputElement>document.getElementById('cate')).value;
        this.videosPagination.pageIndex = 1;
            this.loadCampaignVideos(this.videosPagination);
    }

    searchVideoTitelName(){
        this.showMessage = false;
        this.showUpdatevalue = false;
        console.log(this.searchKey);
        this.videosPagination.searchKey = this.searchKey;
        this.videosPagination.pageIndex = 1;
        this.loadCampaignVideos(this.videosPagination);
    }
    
    getVideoSortValue(sortedValue) {
        swal( { title: 'Sorting Videos', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif",allowOutsideClick: false  });
        this.showMessage = false;
        this.showUpdatevalue = false;
       // this.videoSort = event;
         if(sortedValue!=""){
             let options:string[] = sortedValue.split("-");
             this.sortcolumn = options[0];
             this.sortingOrder = options[1];
         }else{ 
             this.sortcolumn = null;
             this.sortingOrder = null;
         }
        this.videosPagination.pageIndex =1;
        this.videosPagination.sortcolumn = this.sortcolumn;
        this.videosPagination.sortingOrder = this.sortingOrder;    
        this.loadCampaignVideos(this.videosPagination);
      }
    
    
    
    /************************************End Of Videos********************************************************/
    
    /************************************Start Of Contacts********************************************************/
    
    
    loadCampaignContacts(pagination:Pagination) {
        this.contactService.loadContactLists(pagination)
            .subscribe(
            (data:any) => {
                this.campaignContactLists = data.listOfUserLists;
                pagination.totalRecords = data.totalRecords;
                this.contactsPagination = this.pagerService.getPagedItems(pagination, this.campaignContactLists);
                console.log(this.contactsPagination);
               // this.validateContactListForm();
                
            },
            error => console.log( error ),
            () => console.log( "MangeContactsComponent loadContactLists() finished" )
            );
    }
    
    
    /************************************End Of Contacts********************************************************/
    
    loadEmailTemplates(pagination:Pagination){
        this.emailTemplateService.listTemplates(pagination,this.userService.loggedInUserData.id)
        .subscribe(
            (data:any) => {
                this.campaignEmailTemplates = data.emailTemplates;
                pagination.totalRecords = data.totalRecords;
                this.emailTemplatesPagination = this.pagerService.getPagedItems(pagination, data.emailTemplates);
            },
            (error:string) => {
               console.log(error, "listEmailTemplates","ManageTemplatesComponent")
            }
        );
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
    
    
    addVideoIdFile(videoFile:any ) {
        console.log(videoFile);
       this.campaign.selectedVideoId =videoFile.id;
       this.selectedVideoFilePath = videoFile.videoPath.replace(".m3u8",".mp4")+"?access_token="+this.authenticationService.access_token;
       
        console.log( "video id is " + videoFile.id );
    }

    
    getTemplateId( event: any ) {
        console.log( "template id" + event );

    }
    checked( event: any, id: number ) {
        if ( event ) {
            console.log(event);
            if ( id != undefined ) {
               this.campaign.userListIds.push( id );
            }
        } else {
            var index =this.campaign.userListIds.indexOf( id );
            this.campaign.userListIds.splice( index, 1 );
        }
    }
    resetActive( event: any, percent: number, step: string ) {


        $( ".progress-bar" ).css( "width", percent + "%" ).attr( "aria-valuenow", percent );
        $( ".progress-completed" ).text( percent + "%" );

        $( "div" ).each( function() {
            if ( $( this ).hasClass( "activestep" ) ) {
                $( this ).removeClass( "activestep" );
            }
        });
        if ( event.target.className == "col-md-2" ) {
            $( event.target ).addClass( "activestep" );
        }
        else {
            $( event.target.parentNode ).addClass( "activestep" );
        }
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
        $( id ).addClass( "activeStepInfo" );
    }

    ngOnInit() {
        this.validatePublishAsForm();
        this.buildCampaignForm();
        this.validateVideoForm();
     //   this.validateContactListForm();
        this.builcampaignLaunchForm();
        this.validateEmailTemplateForm();
        if ( this.isAdd ) {
            this.publishAsForm.reset();
            this.campaignForm.reset();
            this.videoForm.reset();
         //   this.contactListForm.reset();
            this.campaignLaunchForm.reset();
            this.emailTemplateForm.reset();
        }
        // ;   
        try {
            this.loadCampaignVideos(this.videosPagination);
            this.loadCampaignContacts(this.contactsPagination);
            Metronic.init(); 
            Layout.init();
            Demo.init();
            TableManaged.init();
            
            this.videoJSplayer = videojs(document.getElementById('campaignVideo'), {}, function() {
                this.play();
           });
        }
        catch ( err ) {
            console.log( "error" );
        }
    }

    
    /******************************Publish As Form************************************************/
    
    validatePublishAsForm() {
        this.publishAsForm = this.fb.group( {
            'publishAs': [this.emailType,  Validators.required],
        });

        this.publishAsForm.valueChanges
            .subscribe( data => this.onPublishAsFormValueChanged( data ) );

        this.onPublishAsFormValueChanged(); // (re)set validation messages now

    }

    onPublishAsFormValueChanged( data?: any ) {
        if ( !this.publishAsForm ) { return; }
        const form = this.publishAsForm;
        if(this.publishAsForm['_status']=="VALID"){this.isPublishAsSelected=true}
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
    
    
    getEmailTemplates(type:string){
        this.emailType = type;
        if(type=="Video Email"){
            this.emailTemplatesPagination.filterBy = "CampaignVideoEmails";
        }else{
            this.emailTemplatesPagination.filterBy = "CampaignRegularEmails";
        }
        this.loadEmailTemplates(this.emailTemplatesPagination);
    }
    
    /*********************************Save Campaign video*******************************/
    submitted = false;
    
    buildCampaignForm(): void {
        var emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
        this.campaignForm = this.fb.group( {
            'campaignName': [this.campaign.campaignName, Validators.required],
            'fromName': [this.campaign.fromName, Validators.required],
            'subjectLine': [this.campaign.subjectLine, Validators.required],
            'email': [this.campaign.email,[Validators.required,Validators.pattern(emailRegex)]],
            'preHeader': [this.campaign.preHeader, Validators.required],
            'message': [this.campaign.message,Validators.required],
            'emailOpened': [this.campaign.emailOpened],
            'videoPlayed': [this.campaign.videoPlayed],
            'replyVideo': [this.campaign.replyVideo],
            'socialSharingIcons': [this.campaign.socialSharingIcons],
            'userId': [this.campaign.userId]
        },{
            validator: validateCampaignName('campaignName',this.names,this.isAdd,this.name)
        });

        
        this.campaignForm.valueChanges
            .subscribe( data => this.onValueChanged( data ) );

        this.onValueChanged(); // (re)set validation messages now
        
    }
    //campaign form value changed method 
    onValueChanged( data?: any ) {
        if ( !this.campaignForm ) { return; }
        const form = this.campaignForm;
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

    /**********Campaign Video Form Validation*********************/
    validateVideoForm() {
        this.videoForm = this.fb.group( {
            'videoFileId': [this.videoId,  Validators.required],
            'sortingVideo':[this.sortVideos[0]]
        });

        this.videoForm.valueChanges
            .subscribe( data => this.onVideoFormValueChanged( data ) );

        this.onVideoFormValueChanged(); // (re)set validation messages now

    }

    onVideoFormValueChanged( data?: any ) {
        if ( !this.videoForm ) { return; }
        const form = this.videoForm;
        if(this.videoForm['_status']=="VALID"){this.isVideoSelected=true}
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
    
    
    /**********Campaign EmailTemplate Validation*********************/
    validateEmailTemplateForm() {
        this.emailTemplateForm = this.fb.group( {
            'emailTemplateId': [this.emailTemplateId,Validators.required]
        });

        this.emailTemplateForm.valueChanges
            .subscribe( data => this.onEmailTemplateFormValueChanged( data ) );

        this.onEmailTemplateFormValueChanged(); // (re)set validation messages now

    }

    onEmailTemplateFormValueChanged( data?: any ) {
        if ( !this.emailTemplateForm ) { return; }
        const form = this.emailTemplateForm;
        if(this.emailTemplateForm['_status']=="VALID"){this.isEmailTemplateSelected=true}
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



    builcampaignLaunchForm(): void {
        this.campaignLaunchForm = this.fb.group( {
            'scheduleCampaign': [this.campaign.scheduleCampaign,Validators.required],
            'launchTime': [this.campaign.launchTime],
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
            'required': 'campaignName is required.',
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

    launchCampaign() {
        swal( { title: 'Saving Campaign', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        let self = this;
        $('[name="campaignContact[]"]:checked').each(function(){
           self.campaign.userListIds.push($(this).val());
        });
        var data = {
                'campaignName': this.campaignForm.value.campaignName,
                'fromName': this.campaignForm.value.fromName,
                'subjectLine': this.campaignForm.value.subjectLine,
                'email': this.campaignForm.value.email,
                'preHeader': this.campaignForm.value.preHeader,
                'message': this.campaignForm.value.message,
                'emailOpened': this.campaignForm.value.emailOpened,
                'videoPlayed': this.campaignForm.value.videoPlayed,
                'replyVideo': this.campaignForm.value.replyVideo,
                'socialSharingIcons': this.campaignForm.value.socialSharingIcons,
                'userId':this.campaign.userId,
                'selectedVideoId':this.campaign.selectedVideoId,
                'userListIds':self.campaign.userListIds,
                "optionForSendingMials": "MOBINAR_SENDGRID_ACCOUNT",
                "scheduleCampaign": this.campaignLaunchForm.value.scheduleCampaign,
                'launchTime':this.campaignLaunchForm.value.launchTime,
                'campaignId':this.campaign.campaignId,
                'selectedEmailTemplateId':this.emailTemplateForm.value.emailTemplateId
        }
       console.log(data);
        this.campaignService.saveCampaign( data )
            .subscribe(
            data => {
                console.log(data);
                if(data.message=="success"){
                        if(this.isAdd){
                            this.campaignForm.reset();
                            this.videoForm.reset();
                            this.emailTemplateForm.reset();
                            this.campaignLaunchForm.reset();
                            $('input:checkbox').removeAttr('checked');
                            this.campaign.userListIds = [];
                        }
                    this.launchSuccess = true;
                    swal.close();
                }else{
                    swal( "Please Contact Admin", data, "error" );
                }
            },
            error => {
                swal( error, "", "error" );
            },
            () => console.log( "Done" )
            );
        return false;

    }

    ngOnDestroy() {
        this.campaignService.campaign = undefined;
        this.names = [];
        this.name = "";
        if(!this.launchSuccess){
           if(this.isAdd){
               this.saveCampaign();
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
                   self.saveCampaign();
               })
           }
          

        }
       
         }
    
    saveCampaign(){
        let self = this;
        $('[name="campaignContact[]"]:checked').each(function(){
           self.campaign.userListIds.push($(this).val());
        });
        var data = {
                'campaignName': this.campaignForm.value.campaignName,
                'fromName': this.campaignForm.value.fromName,
                'subjectLine': this.campaignForm.value.subjectLine,
                'email': this.campaignForm.value.email,
                'preHeader': this.campaignForm.value.preHeader,
                'message': this.campaignForm.value.message,
                'emailOpened': this.campaignForm.value.emailOpened,
                'videoPlayed': this.campaignForm.value.videoPlayed,
                'replyVideo': this.campaignForm.value.replyVideo,
                'socialSharingIcons': this.campaignForm.value.socialSharingIcons,
                'userId':this.campaign.userId,
                'selectedVideoId':this.campaign.selectedVideoId,
                'userListIds':self.campaign.userListIds,
                "optionForSendingMials": "MOBINAR_SENDGRID_ACCOUNT",
                "scheduleCampaign": this.campaignLaunchForm.value.scheduleCampaign,
                'launchTime':this.campaignLaunchForm.value.launchTime,
                'campaignId':this.campaign.campaignId,
                'selectedEmailTemplateId':this.emailTemplateForm.value.emailTemplateId
            }
        console.log(data);
        this.campaignService.saveCampaign( data )
        .subscribe(
        data => {
            console.log(data);
            if(data.message=="success"){
                    if(this.isAdd){
                        this.campaignForm.reset();
                        this.videoForm.reset();
                        this.emailTemplateForm.reset();
                        this.campaignLaunchForm.reset();
                    }
                this.launchSuccess = true;
               // swal.close();
            }else{
                //swal( "Please Contact Admin", data, "error" );
            }
        },
        error => {
           // swal(error, "", "error" );
        },
        () => console.log( "Campaign Added" )
        );
    }
    
    getEmailTemplatePreview(emailTemplate:EmailTemplate){
        this.emailTemplateHtmlPreivew = emailTemplate.body;
    }
    contactListItems:any[];
    loadUsers(id:number){
        swal( { title: 'Loading Contacts', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        this.contactService.loadUsersOfContactList( id ).subscribe(
                data => {
                    this.contactListItems = data;
                    console.log(this.contactListItems);
                    swal.close();
                },
                error =>
                () => console.log( "MangeContactsComponent loadUsersOfContactList() finished" )
            )
    }
    
    
    sendTestEmail(emailId:string){
        swal( { title: 'Sending Test Email', text: "Please Wait...", showConfirmButton: false, imageUrl: "assets/images/loader.gif" });
        let self = this;
        $('[name="campaignContact[]"]:checked').each(function(){
           self.campaign.userListIds.push($(this).val());
        });
        var data = {
                'campaignName': this.campaignForm.value.campaignName,
                'fromName': this.campaignForm.value.fromName,
                'subjectLine': this.campaignForm.value.subjectLine,
                'email': this.campaignForm.value.email,
                'preHeader': this.campaignForm.value.preHeader,
                'message': this.campaignForm.value.message,
                'emailOpened': this.campaignForm.value.emailOpened,
                'videoPlayed': this.campaignForm.value.videoPlayed,
                'replyVideo': this.campaignForm.value.replyVideo,
                'socialSharingIcons': this.campaignForm.value.socialSharingIcons,
                'userId':this.campaign.userId,
                'selectedVideoId':this.campaign.selectedVideoId,
                'userListIds':self.campaign.userListIds,
                "optionForSendingMials": "MOBINAR_SENDGRID_ACCOUNT",
                "scheduleCampaign": this.campaignLaunchForm.value.scheduleCampaign,
                'launchTime':this.campaignLaunchForm.value.launchTime,
                'campaignId':this.campaign.campaignId,
                'selectedEmailTemplateId':this.emailTemplateForm.value.emailTemplateId,
                'testEmailId':emailId
            }
        console.log(data);
        
        this.campaignService.sendTestEmail(data)
        .subscribe(
        data => {
           console.log(data);
           if(data.message=="CAMPAIGN_FOUND"){
               swal("Mail Sent Successfully", "", "success")
           }else{
             swal( "Please Contact Admin", data, "error" );
           }
        },
        error => {
        swal(error, "", "error" );
        },
        () => console.log( "Test Mail Sent")
        );
    }
    
    checkAll(ev:any){
        this.contactsPagination.pagedItems.forEach(x => x.state = ev.target.checked);
        if(ev.target.checked){
            if($('[name="campaignContact[]"]:checked').length==0){
                this.isContactListSelected = true;
            }
        }else{
            if($('[name="campaignContact[]"]:checked').length>0){
                this.isContactListSelected = false;
            }
        }
      
    }
    
    isAllChecked() {
        return this.contactsPagination.pagedItems.every(_ => _.state);
      }
    
    
    addIds(event:any,id:number){
        if($('[name="campaignContact[]"]:checked').length>0){
            this.isContactListSelected = true;
        }else{ this.isContactListSelected = false;}
    }
    
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
    
    
    getNumberOfContactItemsPerPage(items:any){
        try{
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

}
