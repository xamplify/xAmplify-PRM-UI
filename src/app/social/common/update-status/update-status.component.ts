import { Component, OnInit, Input, OnDestroy, ViewChild,Renderer } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { XtremandLogger } from '../../../error-pages/xtremand-logger.service';
import { SaveVideoFile } from '../../../videos/models/save-video-file';

import { SocialCampaign } from '../../models/social-campaign';
import { SocialStatusDto } from '../../models/social-status-dto';
import { SocialStatus } from '../../models/social-status';
import { SocialConnection } from '../../models/social-connection';
import { SocialStatusContent } from '../../models/social-status-content';
import { SocialStatusProvider } from '../../models/social-status-provider';

import { ContactList } from '../../../contacts/models/contact-list';
import { CustomResponse } from '../../../core/models/custom-response';

import { ResponseType } from '../../../core/models/response-type';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { PagerService } from '../../../core/services/pager.service';
import { SocialService } from '../../services/social.service';
import { VideoFileService } from '../.././../videos/services/video-file.service';
import { ContactService } from '../.././../contacts/services/contact.service';
import { VideoUtilService } from '../../../videos/services/video-util.service';
import { Pagination } from '../../../core/models/pagination';
import { CallActionSwitch } from '../../../videos/models/call-action-switch';
import { ReferenceService } from '../../../core/services/reference.service';
import { Properties } from '../../../common/models/properties';
import { Country } from '../../../core/models/country';
import { Timezone } from '../../../core/models/timezone';
import { CampaignService } from 'app/campaigns/services/campaign.service';
import { AddFolderModalPopupComponent } from 'app/util/add-folder-modal-popup/add-folder-modal-popup.component';

/*****XNFR-222******/
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { SortOption } from 'app/core/models/sort-option';
import { UtilService } from 'app/core/services/util.service';
/*****XNFR-222*****/


declare var $:any, flatpickr:any, videojs:any, swal: any;

@Component({
	selector: 'app-update-status',
	templateUrl: './update-status.component.html',
	styleUrls: ['./update-status.component.css', '../../../../assets/css/video-css/video-js.custom.css'],
	providers: [PagerService, Pagination, CallActionSwitch, Properties,HttpRequestLoader,SortOption]
})
export class UpdateStatusComponent implements OnInit, OnDestroy {
	@Input('isSocialCampaign') isSocialCampaign = false;
	@Input('alias') alias: string;
	videoUrl: string;
	posterImage: string;
	videoGifImage: string;
	videoJSplayer: any;
	selectedVideo: SaveVideoFile;
	userId: number;
	isCampaignNameExist: boolean;
	isRedirectEnabled: boolean;
	socialCampaign = new SocialCampaign();
	socialStatus = new SocialStatus();
	selectedAccounts: number = 0;
	isCustomizeButtonClicked: boolean = false;
	socialStatusList = new Array<SocialStatus>();
	socialStatusResponse = new Array<SocialStatus>();
	socialStatusProviders = new Array<SocialStatusProvider>();
	isAllSelected: boolean = false;
	loading: boolean = false;
	loadingCalendar: boolean = false;
	socialConnections = new Array<SocialConnection>();
	countries: Country[];
	timezones: Timezone[];
	countryId: number;
	scheduledTimeInString: string;

	previewContactList = new ContactList();
	socialStatusDtos = new Array<any>();
	customResponse = new CustomResponse();

	contactListsPagination: Pagination = new Pagination();
	videosPagination: Pagination = new Pagination();
	paginationType: string;
	location: any;
	isEditSocialStatus: boolean = false;
	isPreviewVideo: boolean = false;
	campaignNames = [];
	events = [];
	selectedSocialProviderId: number;
	savedURL: string;
	validURL: string;
	categoryNames: any;
	showRssFeed: boolean = false;
	nurtureCampaign = false;
	isSavedUrlIsInStatusMessage: boolean;
	removeOgTags: boolean = false;
	@ViewChild('addFolderModalPopupComponent') addFolderModalPopupComponent: AddFolderModalPopupComponent;
	folderCustomResponse: CustomResponse = new CustomResponse();
	marketingCompany: boolean = false;
	/***XNFR-222 ***/
	recipientsLoader:HttpRequestLoader = new HttpRequestLoader();
	recipientsSortOption: SortOption = new SortOption();
	showExpandButton: boolean;
	expandedUserList: any;
	showContactType = false;
	emptyContactsMessage: string;
	showUsersPreview: boolean;
	selectedListName: any;
	selectedListId: any;
	isContactList: boolean;
	isHeaderCheckBoxChecked: boolean;
	socialAccountsLoader:HttpRequestLoader = new HttpRequestLoader();
	buttonText = "Post Now";
	showNavigationBreadCrumbToPartner = false;
	showPostDiv = false;
	loggedInUserId = 0;
	teamMemberEmailIds:any[] = [];
	isValidFromName = true;
	/***XNFR-222 ***/
	constructor(private _location: Location, public socialService: SocialService,
		private videoFileService: VideoFileService, public properties: Properties,
		public authenticationService: AuthenticationService, private contactService: ContactService,
		private pagerService: PagerService, private router: Router, public videoUtilService: VideoUtilService,
		private logger: XtremandLogger, public callActionSwitch: CallActionSwitch, private route: ActivatedRoute,
		public referenceService: ReferenceService, public campaignService: CampaignService,
		public utilService:UtilService,public renderer:Renderer) {
		this.referenceService.renderer = this.renderer;
		this.loggedInUserId = this.authenticationService.getUserId();
		this.socialCampaign.emailNotification = true;
		this.location = this.router.url;
		this.resetCustomResponse();
		this.userId = this.authenticationService.getUserId();
		this.countries = this.referenceService.getCountries();
		this.countryId = this.countries[0].id;
		this.onSelectCountry(this.countryId);
		
	}
	resetCustomResponse() {
		this.customResponse.type = null;
		this.customResponse.statusText = null;
		this.socialStatusResponse = [];
		this.customResponse.statusArray = [];
	}
	changeChannelCampaign(event:any) {
		this.socialCampaign.channelCampaign = event;
		this.updateButtonText();
		this.contactListsPagination.pageIndex = 1;
		this.contactListsPagination.maxResults = 12;
		//this.socialCampaign.userListIds = [];//Write Logic For Only OrgAdmin & Marketing company
		this.loadContactLists(this.contactListsPagination);
	}

	setCustomResponse(type: ResponseType, statusText: string) {
		this.customResponse.type = type;
		this.customResponse.statusText = statusText;
		$('html, body').animate({
			scrollTop: $('.page-content').offset().top
		}, 500);
	}
	videoControllColors(videoFile: SaveVideoFile) {
		this.videoUtilService.videoColorControlls(videoFile);
		const rgba = this.videoUtilService.transparancyControllBarColor(videoFile.controllerColor, videoFile.transparency);
		$('.video-js .vjs-control-bar').css('cssText', 'background-color:' + rgba + '!important');
	}
	previewVideo(videoFile: SaveVideoFile) {
		this.resetCustomResponse();
		this.selectedVideo = videoFile;
		this.posterImage = videoFile.imagePath;
		this.videoUrl = this.selectedVideo.videoPath;
		this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
		this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
		if (this.selectedVideo.is360video) {
			this.play360video(this.selectedVideo);
		} else {
			$('#newPlayerVideo').empty();
			$('#videoId').remove();
			$('.p-video').remove();
			this.videoUtilService.normalVideoJsFiles();
			const str = '<video id="videoId"  poster=' + this.posterImage + ' preload="none"  autoplay= "false" class="video-js vjs-default-skin" controls></video>';
			$('#newPlayerVideo').append(str);
			this.videoUrl = this.selectedVideo.videoPath;
			this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
			this.videoUrl = this.videoUrl + '_mobinar.m3u8?access_token=' + this.authenticationService.access_token;
			$('#newPlayerVideo video').append('<source src=' + this.videoUrl + ' type="application/x-mpegURL">');
			$('#videoId').css('height', '315px');
			$('#videoId').css('width', '100%');
			$('.video-js .vjs-tech').css('width', '100%');
			$('.video-js .vjs-tech').css('height', '100%');
			const self = this;
			const overrideNativevalue = true;
			this.videoJSplayer = videojs('videoId', {
			 playbackRates: [0.5, 1, 1.5, 2],
				autoplay: true,
				html5: {
					hls: {
						overrideNative: overrideNativevalue
					},
					nativeVideoTracks: !overrideNativevalue,
					nativeAudioTracks: !overrideNativevalue,
					nativeTextTracks: !overrideNativevalue
				}
			});
		}
		this.videoControllColors(videoFile);
		$('#list-videos-table > tbody > tr').click(function() {
			$('input[type=radio]', this).attr('checked', 'checked');
		}
		);
	}
	play360video(videoFile) {
		this.resetCustomResponse();
		$('#newPlayerVideo').empty();
		$('.h-video').remove();
		this.videoUtilService.player360VideoJsFiles();
		const str = '<video id=videoId  poster=' + this.posterImage + ' class="video-js vjs-default-skin" crossorigin="anonymous" controls></video>';
		$('#newPlayerVideo').append(str);
		this.videoUrl = this.selectedVideo.videoPath;
		this.videoUrl = this.videoUrl.substring(0, this.videoUrl.lastIndexOf('.'));
		this.videoUrl = this.videoUrl + '.mp4?access_token=' + this.authenticationService.access_token;
		$('#newPlayerVideo video').append('<source src="' + this.videoUrl + '" type="video/mp4">');
		const player = videojs('videoId', { autoplay: false, playbackRates: [0.5, 1, 1.5, 2] });
		const self = this;
		player.panorama({
			autoMobileOrientation: true,
			clickAndDrag: true,
			clickToToggle: true,
			callback: function() {
				player.ready(function() {
					player.play();
					$('.video-js .vjs-control-bar .vjs-VR-control').css('cssText', 'color:' + self.selectedVideo.playerColor + '!important');
				});
			}
		});
		this.videoControllColors(videoFile);
		$('#videoId').css('width', '100%');
		$('#videoId').css('height', '315px');
	}

	selectVideo(videoFile: SaveVideoFile) {
		this.selectedVideo = videoFile;
	}

	addVideo() {
		this.resetCustomResponse();
		this.socialStatus.statusMessage = this.selectedVideo.title;
		const socialStatusContent: SocialStatusContent = new SocialStatusContent();
		socialStatusContent.videoId = this.selectedVideo.id;
		socialStatusContent.fileName = this.selectedVideo.title;
		socialStatusContent.fileType = 'video';
		socialStatusContent.filePath = this.selectedVideo.gifImagePath;
		this.socialStatus.socialStatusContents = [];
		this.socialStatus.socialStatusContents[0] = (socialStatusContent);
		$('#listVideosModal').modal('hide');
		//  this.videoJSplayer.dispose();
	}

	removeItem(socialStatus: SocialStatus, socialStatusContent: SocialStatusContent) {
		this.resetCustomResponse();
		socialStatus.socialStatusContents = socialStatus.socialStatusContents.filter(item => item.fileName !== socialStatusContent.fileName);
	}

	validateImageUpload(files: any, socialStatus: SocialStatus) {
		this.resetCustomResponse();
		this.customResponse.statusArray = [];
		const uploadedFilesCount = files.length;
		const existingFilesCount = socialStatus.socialStatusContents.length;
		if ((uploadedFilesCount + existingFilesCount) > 4) {
			this.setCustomResponse(ResponseType.Error, 'You can upload maximum 4 images.');
			return false;
		} else if ((socialStatus.socialStatusContents.length === 1) &&
			(Array.from(socialStatus.socialStatusContents)[0].fileType === 'video')) {
			this.setCustomResponse(ResponseType.Error, 'You can include up to 4 photos or 1 video in a post.');
			return false;
		} else {
			for (const file of files) {
				if (file.size > 3145728) {
					// File size should not be more than 3 MB
					this.setCustomResponse(ResponseType.Error, 'Accepted image size is less than 3MB');
					this.customResponse.statusArray.push('The Uploaded Image: ' + file.name + ' size is ' + Math.round(file.size / 1024 / 1024 * 100) / 100 + ' MB');
					return false;
				}
				if (!file.type.startsWith("image")) {
					this.setCustomResponse(ResponseType.Error, "We can't quite use that type of file. Could you try one of the following instead: JPG, JPEG, GIF, PNG?");
					return false;
				}
			}
			return true;
		}
	}
	fileChange(event: any, socialStatus: SocialStatus) {
		const files = event.target.files;
		if (this.validateImageUpload(files, socialStatus)) {
			if (files.length > 0) {
				const formData: FormData = new FormData();
				for (const file of files) {
					formData.append('files', file, file.name);
				}

				this.socialService.uploadMedia(formData)
					.subscribe(
						data => {
							for (const i of Object.keys(data)) {
								const socialStatusContent = data[i];
								if (socialStatus.validLink) {
									socialStatus.ogImage = socialStatusContent.completeFilePath;
								} else {
									socialStatus.socialStatusContents.push(socialStatusContent);
								}
							}
						},
						error => console.log(error),
						() => console.log('Finished')
					);
			}
		} else {
		}

	}

	updateAgain(socialStatus: SocialStatus) {
		this.initializeSocialStatus();
		this.socialStatus.statusMessage = socialStatus.statusMessage;
		this.socialStatus.shareNow = true;
		this.updateStatus();
	}

	validate() {
		this.referenceService.scrollSmoothToDiv("content-div");
		let isValid = true;
		if(this.showNavigationBreadCrumbToPartner){
			let self = this;
			$.each(this.socialStatusProviders,function(_index:number,socialStatusProvider:any){
				let soicalStatusList = socialStatusProvider.socialStatusList;
				soicalStatusList.forEach(data => {
					if (!data.statusMessage && data.socialStatusContents.length === 0 && !data.validLink) {
						self.setCustomResponse(ResponseType.Error, 'Status can not be empty');
						isValid = false;
						return false;
					}
				});
			});
		}else{
			this.socialStatusList.forEach(data => {
				if (!data.statusMessage && data.socialStatusContents.length === 0 && !data.validLink) {
					this.setCustomResponse(ResponseType.Error, 'Status can not be empty');
					isValid = false;
					return false;
				}
			});
		}
		if (isValid)
			return this.isSocialCampaign ? this.isValidSocialCampaign() : this.isValidUpdateStatus();
	}

	isSocialAccountsSelected() {
		if (this.selectedAccounts < 1 && (!this.socialCampaign.channelCampaign && !this.socialCampaign.nurtureCampaign)) {
			this.setCustomResponse(ResponseType.Error, 'Please select the accounts to post the status.');
			return false;
		} else {
			return true;
		}
	}

	isValidSocialCampaign() {
		this.validateCampaignName(this.socialCampaign.campaignName);
		let isValid = true;
		isValid = this.isSocialAccountsSelected();

		if (!this.socialCampaign.campaignName) {
			isValid = false;
			this.setCustomResponse(ResponseType.Error, 'Please provide campaign name');
		} else if (this.isCampaignNameExist) {
			isValid = false;
			this.setCustomResponse(ResponseType.Error, 'Please provide another campaign name');
		}else if(!this.isValidFromName){
			isValid = false;
			this.setCustomResponse(ResponseType.Error, 'Please provide from name');
		} else if (!this.alias && (this.socialCampaign.campaignName && this.socialCampaign.userListIds.length === 0)) {
			isValid = false;
			this.setCustomResponse(ResponseType.Error, 'Please select one or more recipient lists.');
		}
		return isValid;
	}

	isValidUpdateStatus() {
		return this.isSocialAccountsSelected();
	}

	redistributeSocialCampaign() {
		this.resetCustomResponse();
		this.socialCampaign.socialStatusProviderList = [];
		this.socialCampaign.userId = this.userId;
		this.socialCampaign.parentCampaignId = this.socialCampaign.campaignId;
		this.socialCampaign.campaignId = null;
		this.socialCampaign.channelCampaign = false;
		this.socialCampaign.nurtureCampaign = true;
		this.socialStatusProviders.forEach(data => {
			if (data.selected)
				this.socialCampaign.socialStatusProviderList.push(data)
		});
		if (this.validate()) {
			let selectedPostsLength = $('#selected-posts').length;
			if(selectedPostsLength>0){
				this.redistribute();
			}else{
				this.setCustomResponse(ResponseType.Error, 'Please select one or more posts');
			}
		}
	}

	private redistribute() {
		this.loading = true;
		let message = this.socialCampaign.userListIds.length>0 ? 'We are posting on social media and deploying the campaign':'We are posting on social media';
		this.referenceService.showSweetAlertProceesor(message);
		this.socialCampaign.alias =  this.alias;
		this.socialService.redistributeSocialCampaign(this.socialCampaign)
			.subscribe(
				data => {
					if (data.access) {
						this.isRedirectEnabled = true;
						this.socialStatusResponse = data.socialStatusList;
						if (data.publishStatus !== 'FAILURE') {
							let message = this.socialCampaign.shareNow ? 'redistributed' : 'scheduled';
							this.setCustomResponse(ResponseType.Success, 'Campaign ' + message + ' successfully.');
						}
						else if (data.publishStatus === 'FAILURE')
							this.setCustomResponse(ResponseType.Error, 'An Error occurred while redistributing the social campaign.');
						$('input:checkbox').removeAttr('checked');
						$('#contact-list-table tr').removeClass("highlight");
					} else {
						this.authenticationService.forceToLogout();
					}

				},
				error => {
					this.setCustomResponse(ResponseType.Error, 'An Error occurred while redistributing the social campaign.');
					this.customResponse.statusArray = [];
					this.customResponse.statusArray.push(error);
					this.loading = false;
					this.referenceService.closeSweetAlert();
				},
				() => {
					this.initializeSocialStatus();
					this.socialCampaign.userListIds = [];
					this.loading = false;
					this.referenceService.closeSweetAlert();
				}
			);
	}

	createSocialCampaign() {
		this.resetCustomResponse();
		this.socialCampaign.socialCampaign = this.isSocialCampaign;
		this.socialCampaign.nurtureCampaign = false;
		if (this.validate()) {
			if(this.socialCampaign.shareNow){
				if(this.socialCampaign.channelCampaign && this.selectedAccounts==0){
					this.referenceService.showSweetAlertProcessingLoader(this.properties.deployingCampaignMessage);
				}else if(this.selectedAccounts>0){
					this.referenceService.showSweetAlertProcessingLoader(this.properties.postingOnSocialMedia);
				}
			}else{
				this.referenceService.showSweetAlertProcessingLoader(this.properties.schedulingCampaignMessage);
			}
			this.socialStatusResponse = [];
			this.socialCampaign.userId = this.userId;
			this.socialCampaign.socialStatusList = this.socialStatusList;
			if(this.socialCampaign.socialStatusProviderList.length==0){
				this.socialStatusProviders.forEach(data => {
					if (data.selected)
						this.socialCampaign.socialStatusProviderList.push(data)
				});
			}
			this.socialService.createSocialCampaign(this.socialCampaign)
				.subscribe(
					data => {
						if (data.access) {
							this.isRedirectEnabled = true;
							this.socialStatusResponse = data.socialStatusList;
							if (data.publishStatus !== 'FAILURE') {
								let message = this.socialCampaign.shareNow ? 'launched' : 'scheduled';
								if(this.socialCampaign.shareNow){
									this.setCustomResponse(ResponseType.Success, this.properties.campaignLaunchedMessage);
								}else{
									this.setCustomResponse(ResponseType.Success, 'Campaign ' + message + ' successfully.');
								}
								
							}
							else if (data.publishStatus === 'FAILURE')
								this.setCustomResponse(ResponseType.Error, 'An Error occurred while creating the social campaign.');

							$('input:checkbox').removeAttr('checked');
							$('#contact-list-table tr').removeClass("highlight");
						} else {
							this.authenticationService.forceToLogout();
						}
					},
					error => {
						this.setCustomResponse(ResponseType.Error, 'An Error occurred while creating the social campaign.');
						this.customResponse.statusArray = [];
						this.customResponse.statusArray.push(error);
						this.loading = false;
						this.referenceService.closeSweetAlert();
					},
					() => {
						this.initializeSocialStatus();
						this.socialCampaign.userListIds = [];
						this.loading = false;
						this.referenceService.closeSweetAlert();
					}
				);
		}
	}





	redirect() {
		if (this.authenticationService.isOnlyPartner()) {
			this.router.navigate(['home/campaigns/partner/social']);
		}
		else {
			this.router.navigate(['/home/campaigns/manage']);
		}
	}

	goToManage() {
		this.loading = true;
		this.router.navigate(['home/campaigns/manage']);
	}

	updateStatus() {
		if (this.validate()) {
			this.loading = true;
			this.socialStatusResponse = [];
			this.socialService.postStatus(this.socialStatusList)
				.subscribe(
					data => {
						this.initializeSocialStatus();
						$('#calendar').fullCalendar('removeEvents');
						this.socialStatusResponse = data;
						this.customResponse.statusText = null;
						this.socialStatusList.forEach(data => {
							data.removeOgTags = false;
						});
					},
					error => {
						this.loading = false;
						this.setCustomResponse(ResponseType.Error, 'Error while posting the update.');
					},
					() => {
						this.loading = false;
						this.listEvents();
					}
				);
		}
	}

	shareLater() {
		this.resetCustomResponse();
		let isValid = true;
		if (this.countryId === 0) {
			isValid = false;
			this.setCustomResponse(ResponseType.Error, 'Please select your country from the dropdown list');
		}

		if (!this.scheduledTimeInString) {
			isValid = false;
			this.setCustomResponse(ResponseType.Error, 'Please select schedule date and time');
		}
		if (isValid) {
			this.socialCampaign.shareNow = false;
			this.socialCampaign.scheduledTimeInString = this.scheduledTimeInString;
			this.socialCampaign.timeZone = $('#timezoneId option:selected').val();
			this.socialCampaign.country = $.trim($('#social-campaign-countryName option:selected').text());
			this.socialStatusList.forEach(data => {
				data.shareNow = false;
				data.scheduledTimeInString = this.scheduledTimeInString;
				data.timeZone = $('#timezoneId option:selected').val();
			});
			this.shareNow();
		}
	}

	shareNow() {
		this.socialStatusList.forEach(data => {
			data.userId = this.userId;
			if (data.shareNow) {
				data.scheduledTime = new Date();
				data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			}
		});
		if (!this.isSocialCampaign){
			this.updateStatus();
		}	else if (this.isSocialCampaign && !this.alias){
			this.createSocialCampaign();
		}else if (this.isSocialCampaign && this.alias){
			this.redistributeSocialCampaign();
		}
			
	}

	deleteStatus(socialStatus: SocialStatus) {
		this.loading = true;
		this.socialService.deleteStatus(socialStatus)
			.subscribe(
				data => {
					this.setCustomResponse(ResponseType.Success, 'Status has been deleted successfully.');
					$('#calendar').fullCalendar('removeEvents');
					this.listEvents();
					this.initializeSocialStatus();
				},
				error => {
					this.loading = false;
					this.setCustomResponse(ResponseType.Error, error)
				},
				() => this.loading = false
			);
	}

	initializeSocialStatus() {
		this.socialStatusList = [];
		this.isAllSelected = false;
		this.selectedAccounts = 0;
		this.socialStatus = new SocialStatus();
		let socialStatus = new SocialStatus();
		socialStatus.userId = this.userId;
		this.socialCampaign.userListIds = [];
		socialStatus.id = null;
		this.socialStatusList.push(socialStatus);
		this.listSocialStatusProviders();
		this.isEditSocialStatus = false;
	}

	listSocialConnections() {
		this.referenceService.loading(this.socialAccountsLoader,true);
		this.socialService.listAccounts(this.userId, 'ALL', 'ALL')
			.subscribe(
				result => {
					this.socialService.socialConnections = result;
					this.socialConnections = result;
					
				},
				error => {
					this.logger.errorPage(error);
				},
				() => {
					this.initializeSocialStatus();
					if (this.referenceService.selectedFeed !== "" && this.referenceService.selectedFeed !== undefined) {
						this.populateRssFeed(this.referenceService.selectedFeed);
						this.referenceService.selectedFeed = "";
					} else if (this.socialService.selectedCustomFeed != "" && this.socialService.selectedCustomFeed !== undefined) {
						this.setSocialShareData(this.socialService.selectedCustomFeed, false);
						this.socialService.selectedCustomFeed = "";
					} else if (this.socialService.partnerFeed != "" && this.socialService.partnerFeed !== undefined) {
						this.setSocialShareData(this.socialService.partnerFeed, true);
						this.socialService.partnerFeed = "";
					}
					this.referenceService.loading(this.socialAccountsLoader,false);
				});
	}


	setSocialShareData(selectedFeed: any, isPartnerFeed: boolean) {
		this.socialStatus = new SocialStatus();
		this.socialStatus.statusMessage = selectedFeed.statusMessage;
		let images = selectedFeed.socialStatusContents;
		let self = this;
		$.each(images, function(_index: number, exSocialStatusContent: SocialStatusContent) {
			let socialStatusContent = new SocialStatusContent();
			socialStatusContent.fileName = exSocialStatusContent.fileName;
			socialStatusContent.filePath = exSocialStatusContent.filePath;
			socialStatusContent.fileSize = exSocialStatusContent.fileSize;
			socialStatusContent.fileType = exSocialStatusContent.fileType;
			socialStatusContent.videoId = exSocialStatusContent.videoId;
			self.socialStatus.socialStatusContents.push(socialStatusContent);
		});
		this.socialStatus.userId = this.userId;
		if (isPartnerFeed) {
			this.socialStatus.parentFeed = new SocialStatus();
			this.socialStatus.parentFeed.id = selectedFeed.id;
		}
		this.socialStatusList[0] = this.socialStatus;
	}



	listSocialStatusProviders() {
		this.socialStatusProviders = new Array<SocialStatusProvider>();
		for (const i in this.socialConnections) {
			if (this.socialConnections[i].active) {
				const socialStatusProvider = new SocialStatusProvider();
				socialStatusProvider.socialConnection = this.socialConnections[i];
				this.socialStatusProviders.push(socialStatusProvider);
			}
		}
	}
	openListVideosModal(socialStatus: SocialStatus) {
		this.socialStatus = socialStatus;
		$('#listVideosModal').modal('show');
		if (this.videosPagination.pagedItems.length === 0) {
			$('#preview-section').hide();
			this.listVideos(this.videosPagination);
		}
	}

	closeListVideosModal() {
		$('#listVideosModal').modal('hide');
		// this.videoJSplayer.dispose();
		this.closeModal();
	}

	editSocialStatus(socialStatus: SocialStatus) {
		this.resetCustomResponse();
		$('#fc-event-' + socialStatus.id).modal('hide');
		$('html,body').animate({ scrollTop: 0 }, 'slow');
		this.initializeSocialStatus();
		this.isEditSocialStatus = true;
		socialStatus.shareNow = true;
		this.socialStatusList[0] = socialStatus;
		this.socialStatusProviders = [];
		this.socialStatusProviders[0] = socialStatus.socialStatusProvider;
		this.toggleSelectAll();
	}

	showScheduleOption(divId: string) { $('#' + divId).removeClass('hidden'); $('#post-actions-button-group').addClass('hidden'); }
	hideScheduleOption(divId: string) {
		$('#' + divId).addClass('hidden');
		$('#post-actions-button-group').removeClass('hidden');
		this.resetCustomResponse();
	}

	videoPlayListSource(videoUrl: string) {
		this.videoUrl = videoUrl;
		const self = this;
		this.videoJSplayer.src({ src: self.videoUrl, type: 'application/x-mpegURL' });
	}

	/*****************LOAD VIDEOS WITH PAGINATION START *****************/

	listVideos(videosPagination: Pagination) {
		this.paginationType = 'updatestatusvideos';
		//this.videoFileService.videoType = 'myAssets';
		this.videoFileService.loadVideoFiles(videosPagination)
			.subscribe((result: any) => {
				if (result.totalRecords > 0) {
					$('#preview-section').show();
					videosPagination.totalRecords = result.totalRecords;
					videosPagination = this.pagerService.getPagedItems(videosPagination, result.list);
					// this.previewVideo(videosPagination.pagedItems[0]);
				}
			});
		() => console.log('listVideos() completed:')
	}

	/*****************LOAD VIDEOS WITH PAGINATION END *****************/

	/*****************LOAD CONTACTLISTS WITH PAGINATION START *****************/
	loadContactLists(contactListsPagination: Pagination) {
		this.recipientsLoader.isHorizontalCss = true;
        this.referenceService.loading(this.recipientsLoader, true);
		if (this.alias != undefined) {
			this.loadContactsLeadsAndPartners(contactListsPagination);
		} else {
			if(this.socialCampaign.channelCampaign){
				contactListsPagination.filterValue = true;
				contactListsPagination.filterKey = "isPartnerUserList";
			}else{
				contactListsPagination.filterValue = false;
        		contactListsPagination.filterKey = null;
			}
			contactListsPagination.channelCampaign = this.socialCampaign.channelCampaign;
			contactListsPagination.isLoading = true;
			this.paginationType = 'updatestatuscontactlists';
			if (this.authenticationService.isOnlyPartner()) { this.socialCampaign.isPartner = false; }
			this.contactService.findContactsAndPartnersForCampaign(contactListsPagination)
				.subscribe(
					(response: any) => {
						let data = response.data;
						contactListsPagination.totalRecords = data.totalRecords;
						contactListsPagination = this.pagerService.getPagedItems(contactListsPagination, data.list);
						var contactIds = this.contactListsPagination.pagedItems.map(function (a) { return a.id; });
						var items = $.grep(this.socialCampaign.userListIds, function (element:any) {
							return $.inArray(element, contactIds) !== -1;
						});
						if (items.length == contactIds.length) {
							this.isHeaderCheckBoxChecked = true;
						} else {
							this.isHeaderCheckBoxChecked = false;
						}
					},
					(error: any) => {
						this.logger.errorPage(error);
					},
					() => {
						this.referenceService.loading(this.recipientsLoader, false);
						contactListsPagination.isLoading = false;
					}
				);
		}

	}

	loadContactsLeadsAndPartners(contactListsPagination: Pagination) {
		if (this.authenticationService.companyProfileName !== undefined && this.authenticationService.companyProfileName !== '') {
			this.contactListsPagination.vendorCompanyProfileName = this.authenticationService.companyProfileName;
			this.contactListsPagination.vanityUrlFilter = true;
		}
		if (this.socialCampaign.nurtureCampaign) {
			contactListsPagination.editCampaign = true;
			contactListsPagination.campaignId = this.socialCampaign.campaignId;
			contactListsPagination.parentCampaignId = this.socialCampaign.parentCampaignId;
		} else {
			contactListsPagination.editCampaign = false;
			contactListsPagination.parentCampaignId = this.socialCampaign.campaignId;
		}
		contactListsPagination.userId = this.authenticationService.getUserId();
		this.campaignService.listCampaignUsers(contactListsPagination)
			.subscribe(
				(response: any) => {
					let data = response.data;
					contactListsPagination.totalRecords = data.totalRecords;
					contactListsPagination = this.pagerService.getPagedItems(contactListsPagination, data.list);
					this.referenceService.loading(this.recipientsLoader, false);
				},
				(error: string) => this.logger.errorPage(error),
				() => this.logger.info("Finished loadContactList()")
			);
	}

	/*****************LOAD CONTACTLISTS WITH PAGINATION END *****************/

	/*****************LOAD CONTACTS BY CONTACT LIST ID WITH PAGINATION START *****************/


	setPage(event: any) {
		if (event.type === 'updatestatuscontactlists' && this.paginationType !== 'loadAllContacts') {
			this.contactListsPagination.pageIndex = event.page;
			this.referenceService.goToDiv("social-content-editor-div");
			this.loadContactLists(this.contactListsPagination);
		}
		else if (event.type === 'updatestatuscontactlists' && this.paginationType === 'loadAllContacts') {
			this.contactListsPagination.pageIndex = event.page;
			this.loadContactLists(this.contactListsPagination);
		}
		else if (event.type === 'updatestatusvideos') {
			this.videosPagination.pageIndex = event.page;
			this.listVideos(this.videosPagination);
		}
	}
	paginationDropDown(pagination: Pagination) {
		if (this.paginationType === 'updatestatuscontactlists') { this.loadContactLists(pagination); }
		else if (this.paginationType === 'updatestatusvideos') { this.listVideos(pagination); }
		else if (this.paginationType === 'loadAllContacts') { this.loadContactLists(pagination) }
	}
	closeModal() {
		this.paginationType = 'updatestatuscontactlists';
		this.videosPagination = new Pagination();
	}
	/*****************LOAD CONTACTS BY CONTACT LIST ID WITH PAGINATION END *****************/

	constructCalendar() {
		const self = this;
		$('#calendar').fullCalendar({
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
			timeFormat: 'h:mm a',
			timezone: 'local',
			eventOrder: "-start",
			eventLimit: true,
			viewRender: function(view: any, element: any) {
				self.listEvents();
			},
			eventRender: function(event: any, element: any) {
				element.find('.fc-time').addClass('fc-time-title mr5');
				element.find('.fc-title').addClass('fc-time-title ml5');
				element.find('.fc-time-title').wrapAll('<div class="fc-right-block col-xs-11 flex pull-right p0 mr-10"></div>');

				const socialStatusProvider = event.data.socialStatusProvider;
				let str = '';
				if ('FACEBOOK' === socialStatusProvider.socialConnection.source) {
					str += '<i class="fa fa-social pull-right fa-facebook white p-10"></i>';
					element.css('background', '#3b5998');
				} else if ('TWITTER' === socialStatusProvider.socialConnection.source) {
					str += '<i class="fa fa-social pull-right fa-twitter  white p-10"></i>';
					element.css('background', '#1da1f2');
				} else if ('GOOGLE' === socialStatusProvider.socialConnection.source) {
					str += '<i class="fa fa-social pull-right fa-google  white p-10"></i>';
					element.css('background', '#d95535');
				} else if ('LINKEDIN' === socialStatusProvider.socialConnection.source) {
					str += '<i class="fa fa-social pull-right fa-linkedin  white p-10"></i>';
					element.css('background', '#007bb5');
				}

				element.find('.fc-right-block')
					.after($(`<div id = ${event.id} class="fc-left-block col-xs-1 p0"> ${str} </div>`));
                /*$(element).popover({
                    container: 'body',
                    html: true,
                    placement: 'auto',
                    trigger: 'hover',
                    content: function() {
                        return $('#fc-' + event.id).html();
                    }
                });*/
			},
			eventClick: function(event) {
				self.editSocialStatus(event.data.socialStatus);
			}
		});
	}

	listEvents() {
		$('#calendar').fullCalendar('removeEvents');
		var view = $('#calendar').fullCalendar('getView');
		var request = { startTime: view.start._d, endTime: view.end._d, userId: this.userId };
		this.loadingCalendar = true;
		this.socialService.listEvents(request).subscribe(
			data => {
				this.events = [];
				for (const i of Object.keys(data)) {
					const socialStatus = data[i];
					const socialStatusDto = new SocialStatusDto();
					socialStatusDto.socialStatus = socialStatus;
					socialStatusDto.socialStatusContents = socialStatus.socialStatusContents;
					socialStatusDto.socialStatusProvider = socialStatus.socialStatusProvider;

					this.socialStatusDtos.push(socialStatusDto);

					let event: any = {
						id: socialStatus.id + '-' + socialStatusDto.socialStatusProvider.id,
						title: socialStatus.statusMessage.substring(0, 10),
						start: socialStatus.scheduledTime,
						data: socialStatusDto,
						editable: false,
						allDay: false
					};
					// $('#calendar').fullCalendar('renderEvent', event, true);
					this.events.push(event);
				}
				$('#calendar').fullCalendar('addEventSource', this.events);
			},
			error => {
				console.log(error);
				this.loadingCalendar = false;
			},
			() => {
				this.loadingCalendar = false;
			}
		);
	}



	getSocialCampaign(socialCampaignAlias: string) {
		this.socialService.getSocialCampaignByAlias(socialCampaignAlias)
			.subscribe(
				data => {
					this.socialCampaign = data;
					this.socialCampaign.shareNow = true;
					this.socialCampaign.isPartner = true;
					this.socialCampaign.userListIds = [];
					this.socialStatusList = [];
					this.isCustomizeButtonClicked = true;
					let categoryIds = this.categoryNames.map(function(a: any) { return a.id; });
					this.socialCampaign.categoryId = categoryIds[0];
				},
				error => this.router.navigate(['/home/error/404']),
				() => {
					this.listAllTeamMemberEmailIds();
					this.loadContactLists(this.contactListsPagination);
					this.listSocialStatusProviders();
				}
			);
	}

	toggleContactLists() {
		this.socialCampaign.isPartner = !this.socialCampaign.isPartner;
		this.contactListsPagination.pageIndex = 1;
		this.loadContactLists(this.contactListsPagination);
	}
	loadCampaignNames(userId: number) {
		this.campaignService.getCampaignNames(userId).subscribe(data => { this.campaignNames.push(data); },
			error => console.log(error), () => console.log("Campaign Names Loaded"));
	}

	validateCampaignName(campaignName: string) {
		if (campaignName === undefined)
			return false;
		const lowerCaseCampaignName = $.trim(campaignName.toLowerCase()); //Remove all spaces
		this.isCampaignNameExist = this.campaignNames!=undefined && this.campaignNames.length>0 && this.campaignNames[0].includes(lowerCaseCampaignName) ? true : false;
	}

	ngOnInit() {
		this.showNavigationBreadCrumbToPartner = this.alias!=undefined;
		this.showOrHidePostOption();
		flatpickr('.flatpickr', {
			enableTime: true,
			dateFormat: 'm/d/Y h:i K',
			time_24hr: false
		});
		this.authenticationService.isMarketingCompany().subscribe(
			response=>{
				this.marketingCompany = response.data;
			},error=>{
				this.logger.errorPage(error);
			},()=>{
				this.listSocialConnections();
				this.constructCalendar();
				if (this.isSocialCampaign) {
					this.socialCampaign.isPartner = this.authenticationService.isOnlyPartner() ? false : true;
					if(this.marketingCompany){
						this.socialCampaign.channelCampaign = false;
					}else{
						this.socialCampaign.channelCampaign = true;
					}
					this.loadCampaignNames(this.userId);
					this.listCategories();
					/****XNFR-222*****/
					this.updateButtonText();
					if (this.alias) {
						this.nurtureCampaign = true;
						this.checkAliasAccess(this.alias);
					} else {
						this.nurtureCampaign = false;
						this.listAllTeamMemberEmailIds();
						this.loadContactLists(this.contactListsPagination);
					}
				}
			}
		);
		

		/*************Check Rss Feed Access*********** */
		this.showRssFeedButton();

	}

	private showOrHidePostOption() {
		if (this.showNavigationBreadCrumbToPartner) {
			this.showPostDiv = this.selectedAccounts >= 1;
		} else {
			this.showPostDiv = true;
		}
	}

	showRssFeedButton() {
		this.loading = true;
		this.socialService.hasRssFeedAccess(this.userId)
			.subscribe(
				data => {
					//this.showRssFeed = data.access;
					this.showRssFeed = false;
				},
				error => {
					this.loading = false;
				},
				() => {
					this.loading = false;
				}
			);

	}

	ngOnDestroy() {
		if (this.videoJSplayer !== undefined) {
			// this.videoJSplayer.dispose();
		}
		$('.profile-video').remove();
		this.videoFileService.videoType = '';
		$('#listVideosModal').modal('hide');
		$('#contactsModal').modal('hide');
		$('#manageAccountsModal').modal('hide');
		$('#contactsModal').modal('hide');
		$('#rssModal').modal('hide');
	}

	toggleSocialStatusProvider(socialStatusProvider: SocialStatusProvider) {
		socialStatusProvider.selected = !socialStatusProvider.selected;
		this.selectedAccounts = socialStatusProvider.selected ? this.selectedAccounts + 1 : this.selectedAccounts - 1;
		this.updateButtonText();
		if (this.isSocialCampaign && this.alias) {
			if (socialStatusProvider.selected) {
				let likeSocialAccount = 0;
				this.socialCampaign.socialStatusList.forEach(data => {
					if (data.socialStatusProvider!=null && data.socialStatusProvider.socialConnection!=null &&
						data.socialStatusProvider.socialConnection.source === socialStatusProvider.socialConnection.source)
						likeSocialAccount++;
				})

				if (likeSocialAccount >= 1) {
					socialStatusProvider.socialStatusList = [];
					this.socialCampaign.socialStatusList.forEach(data => {
						if (data.socialStatusProvider!=null && data.socialStatusProvider.socialConnection!=null &&
							data.socialStatusProvider.socialConnection.source === socialStatusProvider.socialConnection.source) {
							let socialStatus = JSON.parse(JSON.stringify(data));
							socialStatus.statusMessage = data.statusMessage;
							socialStatusProvider.socialStatusList.push(socialStatus);
						}
					})
				} else {
					socialStatusProvider.socialStatusList = [];
					this.socialCampaign.socialStatusList.forEach(data => {
						let socialStatus = JSON.parse(JSON.stringify(data));
						socialStatus.statusMessage = data.statusMessage;
						socialStatusProvider.socialStatusList.push(socialStatus);
					})
				}
				socialStatusProvider.socialStatusList[0].selected = true;
			}
		} else {
			if (socialStatusProvider.selected) {
				if (this.isCustomizeButtonClicked) {
					if (this.selectedAccounts <= 1) {
						this.socialStatusList[0].socialStatusProvider = socialStatusProvider;
					} else {
						let socialStatusData = this.socialStatusList[0];
						this.socialStatusList.push(this.copyContent(socialStatusData, socialStatusProvider));
					}
				} else {
					this.socialStatusList[0].socialStatusProvider = socialStatusProvider;
				}
			} else if (!socialStatusProvider.selected) {
				if (this.isCustomizeButtonClicked) {
					// possibility to have more than one socialStatusList
					if (this.socialStatusList.length > 1) {
						this.socialStatusList = this.socialStatusList.filter(function(obj) {
							return obj.socialStatusProvider.socialConnection.id !== socialStatusProvider.socialConnection.id;
						});
					} else {
						this.socialStatusList[0] = new SocialStatus();
						delete this.socialStatusList[0].socialStatusProvider;
					}
				} else {
					if (this.selectedAccounts === 0) {
						this.socialStatusList[0] = new SocialStatus();
						delete this.socialStatusList[0].socialStatusProvider;
					}
				}
			}
		}

		this.isAllSelected = (this.selectedAccounts === this.socialStatusProviders.length) ? true : false;
		this.showOrHidePostOption();
	}

	copyContent(targetSocialStatus: SocialStatus, socialStatusProvider: SocialStatusProvider) {
		let socialStatus = new SocialStatus();

		socialStatus.statusMessage = targetSocialStatus.statusMessage;
		targetSocialStatus.socialStatusContents.forEach(data => socialStatus.socialStatusContents.push(data));
		socialStatus.socialStatusProvider = socialStatusProvider;
		socialStatus.userId = this.userId;

		socialStatus.ogImage = targetSocialStatus.ogImage;
		socialStatus.ogTitle = targetSocialStatus.ogTitle;
		socialStatus.ogDescription = targetSocialStatus.ogDescription;
		socialStatus.validLink = targetSocialStatus.validLink;
		socialStatus.parentFeed = targetSocialStatus.parentFeed;
		return socialStatus;
	}

	customizeEachNetwork() {
		let socialStatusData = this.socialStatusList[0];
		this.socialStatusList = [];
		this.socialStatusProviders.forEach(data => {
			if (data.selected) {
				this.socialStatusList.push(this.copyContent(socialStatusData, data));
			}
		})
		this.isCustomizeButtonClicked = true;
	}

	undoCustomizeEachNetwork() {
		let socialStatusData = this.socialStatusList[0];
		this.socialStatusList = [];
		this.socialStatusList[0] = new SocialStatus();
		this.isCustomizeButtonClicked = false;
		this.selectNone();
		$('html,body').animate({ scrollTop: 0 }, 'slow');
	}

	selectAll() {
		this.isAllSelected = true;
		this.selectedAccounts = 0;
		this.socialStatusProviders.forEach(data => {
			data.selected = false;
			this.toggleSocialStatusProvider(data);
		})
	}

	selectNone() {
		this.isAllSelected = false;
		this.selectedAccounts = 0;
		this.socialStatusList.length = 1;
		this.socialStatusProviders.forEach(data => data.selected = false);
	}

	toggleSelectAll() {
		this.isAllSelected = !this.isAllSelected;
		this.selectedAccounts = 0;
		if (this.isAllSelected) {
			this.socialStatusProviders.forEach(data => {
				data.selected = false;
				this.toggleSocialStatusProvider(data);
			})
		} else {
			this.socialStatusList.length = 1;
			this.socialStatusProviders.forEach(data => data.selected = false);
		}
		this.showOrHidePostOption();
		
	}

	isUrl(s): boolean {
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(s);
	}

	dismissMessage(socialStatus: SocialStatus) {
		this.socialStatusResponse = this.socialStatusResponse.filter(item => item !== socialStatus);
	}

	save() {
		this.socialService.saveAccounts(this.socialConnections)
			.subscribe(
				result => { },
				error => console.log(error),
				() => {
					this.socialService.socialConnections = this.socialConnections;

					for (const i in this.socialConnections) {
						const ssp = this.socialStatusProviders.find(item => item.socialConnection.id === this.socialConnections[i].id);
						if (this.socialConnections[i].active) {
							if (ssp) {
								// do nothing
							} else {
								const socialStatusProvider = new SocialStatusProvider();
								socialStatusProvider.socialConnection = this.socialConnections[i];
								this.socialStatusProviders.push(socialStatusProvider);
							}
						} else {
							if (ssp) {
								this.socialStatusProviders = this.socialStatusProviders.filter(item => item !== ssp);
								if (this.socialStatusList.length == 1) {
									this.socialStatusList[0].socialStatusProvider = null;
								} else
									this.socialStatusList = this.socialStatusList.filter(data => data.socialStatusProvider !== ssp)
							}
						}
					}

					this.selectNone();
					$('#manageAccountsModal').modal('hide');
				});

	}

	onSelectCountry(countryId) {
		this.timezones = this.referenceService.getTimeZonesByCountryId(countryId);
	}



	// RSS ---------------------------

	openRssModal(socialStatus: SocialStatus) {
		if (socialStatus.socialStatusProvider !== undefined && socialStatus.socialStatusProvider.socialConnection !== undefined) {
			this.selectedSocialProviderId = socialStatus.socialStatusProvider.socialConnection.id;
		}
		$('#rssModal').modal('show');
	}


	addToPost(feed: any) {
		if (this.selectedSocialProviderId === undefined) {
			this.socialStatusList.forEach(data => {
				data.statusMessage = feed.link;
				data.ogImage = feed.thumbnail ? feed.thumbnail : 'https://via.placeholder.com/100x100?text=preview';
				data.ogTitle = feed.title;
				data.ogDescription = feed.description;
				data.validLink = true;
				data.ogt = true;
			});
		} else {
			console.log(feed);
			let selectedSocialStatus = this.socialStatusList.filter(item => item.socialStatusProvider.socialConnection.id == this.selectedSocialProviderId)[0];
			selectedSocialStatus.statusMessage = feed.link;
			selectedSocialStatus.ogImage = feed.thumbnail ? feed.thumbnail : 'https://via.placeholder.com/100x100?text=preview';
			selectedSocialStatus.ogTitle = feed.title;
			selectedSocialStatus.ogDescription = feed.description;
			selectedSocialStatus.validLink = true;
			selectedSocialStatus.ogt = true;
			let itemIndex = this.socialStatusList.findIndex(item => item.socialStatusProvider.socialConnection.id == this.selectedSocialProviderId);
			this.socialStatusList[itemIndex] = selectedSocialStatus;
		}
		$('#rssModal').modal('hide');
	}

	navigateRssHome(navigateUrl: string) {
		$('#rssModal').modal('hide');
		this.router.navigate([navigateUrl]);
	}

	populateRssFeed(feed: any) {
		this.socialStatus.statusMessage = feed.link;
		this.socialStatus.ogImage = feed.thumbnail ? feed.thumbnail : 'https://via.placeholder.com/100x100?text=preview';
		this.socialStatus.ogTitle = feed.title;
		this.socialStatus.ogDescription = feed.description;
		this.socialStatus.validLink = true;
		this.socialStatus.ogt = true;
		this.socialStatusList[0] = this.socialStatus;
	}

	onKeyPress(socialStatus: any) {
		let enteredURL = socialStatus.statusMessage.trim();
		if (enteredURL.length === 0) {
			this.socialStatus.statusMessage = ""
			this.clearRssOgTagsFeed(socialStatus);
		} else {
			this.getOgTagsData(socialStatus);
		}
	}


	isUrlValid(url: string): Boolean {
		let regex = "^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$";
		var pattern = new RegExp(regex);
		return pattern.test(url);

	}

	getOgTagsData(socialStatus: any) {
		let url = socialStatus.statusMessage;
		let req = { "userId": this.userId, "q": url };
		this.socialService.getOgMetaTags(req).subscribe(data => {
			if (data.statusCode === 8105) {
				let response = data.data;
				if (response !== undefined && response !== '') {
					if (response.defaultOgImage) {
						socialStatus.ogImage = response.imageUrl;
					} else {
						socialStatus.ogImage = response.imageUrl ? response.imageUrl : 'https://via.placeholder.com/100x100?text=preview';
					}
					socialStatus.originalOgImage = socialStatus.ogImage;
					socialStatus.ogTitle = response.title;
					socialStatus.ogDescription = response.description;
					socialStatus.validLink = true;
					socialStatus.ogt = true;
					this.savedURL = url;
					this.validURL = this.savedURL;
				}
			} else {
				this.clearRssOgTagsFeed(socialStatus);

			}
		}, error => {
			this.clearRssOgTagsFeed(socialStatus);
			console.log(error);
		}, () => console.log("Campaign Names Loaded"));
	}

	clearRssOgTagsFeed(socialStatus: any) {
		this.isSavedUrlIsInStatusMessage = socialStatus.statusMessage.includes(this.validURL);
		if (this.isSavedUrlIsInStatusMessage) {
			this.savedURL = socialStatus.statusMessage;
		}
		else {
			socialStatus.ogImage = ""
			socialStatus.ogTitle = "";
			socialStatus.ogDescription = "";
			socialStatus.validLink = false;
			socialStatus.ogt = false;
			this.savedURL = '';
		}

	}

	listCategories() {
		this.loading = true;
		this.authenticationService.getCategoryNamesByUserId(this.userId).subscribe(
			(data: any) => {
				this.categoryNames = data.data;
				let categoryIds = this.categoryNames.map(function(a: any) { return a.id; });
				this.socialCampaign.categoryId = categoryIds[0];
				this.loading = false;
			},
			error => { this.logger.error("error in getCategoryNamesByUserId(" + this.userId + ")", error); },
			() => this.logger.info("Finished listCategories()"));
	}

	toggleEnable(socialConnection: SocialConnection) {
		if (socialConnection.canSaveSocialConnections) {
			socialConnection.active = !socialConnection.active;
		} else {
			swal("Sorry! you are not authorized to update this account.", "", "info");
		}
	}

	closeOgTags(targetSocialStatus: SocialStatus) {
		this.socialStatusList.forEach(data => {
			if (data.socialStatusProvider.socialConnection.id === targetSocialStatus.socialStatusProvider.socialConnection.id) {
				data.ogDescription = null;
				data.ogImage = null;
				data.ogTitle = null;
				data.ogImagePath = null;
				data.originalOgImage = null;
				data.removeOgTags = true;
			}
		});
	}

	openCreateFolderPopup(){
		this.addFolderModalPopupComponent.openPopup();
	}

	showSuccessMessage(message: any) {
		this.referenceService.showSweetAlertSuccessMessage(message);
		this.listCategories();
	}

	/***XNFR-222****/
	
	searchContactList() {
		this.getAllFilteredResults();
		
	}
	searchOnEnterKeyPress(eventKeyCode:any){
		if("13"==eventKeyCode){
			this.searchContactList();
		}
	}

	sortRecipientsList(text: any) {
        this.recipientsSortOption.selectedCampaignRecipientsDropDownOption = text;
        this.getAllFilteredResults();
    }

    getAllFilteredResults() {
		this.contactListsPagination.pageIndex = 1;
		this.contactListsPagination.searchKey = $.trim(this.recipientsSortOption.searchKey);
		if (this.contactListsPagination.searchKey != undefined && this.contactListsPagination.searchKey != null 
			&& $.trim(this.contactListsPagination.searchKey) != "") {
			this.showExpandButton = true;
		} else {
			this.showExpandButton = false;
		}
		this.contactListsPagination = this.utilService.sortOptionValues(this.recipientsSortOption.selectedCampaignRecipientsDropDownOption, this.contactListsPagination);
		this.loadContactLists(this.contactListsPagination);
    }

	viewMatchedContacts(userList: any) {
        userList.expand = !userList.expand;
        if (userList.expand) {
            if ((this.expandedUserList != undefined || this.expandedUserList != null)
                && userList != this.expandedUserList) {
                this.expandedUserList.expand = false;
            }
            this.expandedUserList = userList;
        }
    }

	/*******************************Preview*************************************/
    showContactsAlert(count: number) {
        this.emptyContactsMessage = "";
        if (count == 0) {
            this.emptyContactsMessage = "No Contacts Found For This Contact List";
        }
    }



	previewUsers(contactList: any) {
        this.showUsersPreview = true;
        this.selectedListName = contactList.name;
        this.selectedListId = contactList.id;
    }

    resetValues() {
        this.showUsersPreview = false;
        this.selectedListName = "";
        this.selectedListId = 0;
    }

	highlightRow(contactList: any, event: any) {
        let contactId = contactList.id;
        let isChecked = $('#' + contactId).is(':checked');
        if (isChecked) {
            $('#social-campaignContactListTable_' + contactId).addClass('contact-list-selected');
            this.socialCampaign.userListIds.push(contactId);
        } else {
            $('#social-campaignContactListTable_' + contactId).removeClass('contact-list-selected');
            this.socialCampaign.userListIds.splice($.inArray(contactId, this.socialCampaign.userListIds), 1);
        }
        this.contactsUtility();
        event.stopPropagation();
        
    }

	highlightContactRow(contactList: any, event: any, count: number, isValid: boolean) {
        let contactId = contactList.id;
        if (isValid) {
            this.emptyContactsMessage = "";
             if (count > 0) {
                let isChecked = $('#' + contactId).is(':checked');
                if (isChecked) {
                    //Removing Highlighted Row
                    $('#' + contactId).prop("checked", false);
                    $('#social-campaignContactListTable_' + contactId).removeClass('contact-list-selected');
                    this.socialCampaign.userListIds.splice($.inArray(contactId, this.socialCampaign.userListIds), 1);
                } else {
                    //Highlighting Row
                    $('#' + contactId).prop("checked", true);
                    $('#social-campaignContactListTable_' + contactId).addClass('contact-list-selected');
                    this.socialCampaign.userListIds.push(contactId);
                }
                this.contactsUtility();
                event.stopPropagation();
            } else {
                this.emptyContactsMessage = "Users are in progress";
            }

        }

    }
    contactsUtility() {
        var trLength = $('#social-contact-list-table tbody tr').length;
        var selectedRowsLength = $('[name="social-campaignContact[]"]:checked').length;
        if (selectedRowsLength > 0 || this.socialCampaign.userListIds.length > 0) {
            this.isContactList = true;
        } else {
            this.isContactList = false;
        }
        if (trLength != selectedRowsLength) {
            $('#checkAllExistingSocialContacts').prop("checked", false)
        } else if (trLength == selectedRowsLength) {
            $('#checkAllExistingSocialContacts').prop("checked", true);
        }
    }

    checkAll(ev: any) {
        if (ev.target.checked) {
            $('[name="social-campaignContact[]"]').prop('checked', true);
            this.isContactList = true;
            let self = this;
            $('[name="social-campaignContact[]"]:checked').each(function (index:number) {
                var id = $(this).val();
                self.socialCampaign.userListIds.push(parseInt(id));
                $('#social-campaignContactListTable_' + id).addClass('contact-list-selected');
            });
            this.socialCampaign.userListIds = this.referenceService.removeDuplicates(this.socialCampaign.userListIds);
            if (this.socialCampaign.userListIds.length == 0) { this.isContactList = false; }
        } else {
            $('[name="social-campaignContact[]"]').prop('checked', false);
            $('#social-contact-list-table tr').removeClass("contact-list-selected");
            if (this.contactListsPagination.maxResults > 30 || (this.contactListsPagination.maxResults == this.contactListsPagination.totalRecords)) {
                this.isContactList = false;
                this.socialCampaign.userListIds = [];
            } else {
                this.socialCampaign.userListIds = this.referenceService.removeDuplicates(this.socialCampaign.userListIds);
                let currentPageContactIds = this.contactListsPagination.pagedItems.map(function (a) { return a.id; });
                this.socialCampaign.userListIds = this.referenceService.removeDuplicatesFromTwoArrays(this.socialCampaign.userListIds, currentPageContactIds);
                if (this.socialCampaign.userListIds.length == 0) {
                    this.isContactList = false;
                }
            }

        }
        ev.stopPropagation();
    }

	updateButtonText(){
		this.buttonText = this.socialCampaign.channelCampaign && this.selectedAccounts==0 ? 'Share' : 'Post Now';

	}
	
	/***XNFR-222****/
	resetPost(socialStatus:any){
		this.loading = true;
		this.socialService.getSocialStatusById(socialStatus.id).subscribe(
			response=>{
				if(response.statusCode==200){
					let data = response.data;
					socialStatus.statusMessage = data.statusMessage;
					socialStatus.socialStatusContents = data.socialStatusContents;
				}else{
					this.referenceService.showSweetAlertErrorMessage("Post Not Found");
				}
				this.loading = false;
			},error=>{
				this.loading = false;
				this.referenceService.showSweetAlertServerErrorMessage();
			}
		);
	}
/***XNFR-222****/
checkAliasAccess(socialCampaignAlias: string) {
	let statusCode = 404;
		this.socialService.checkAliasAccess(socialCampaignAlias)
			.subscribe(
				response => {
					statusCode = response.statusCode;
				},
				error => this.router.navigate(['/home/error/404']),
				() => {
					if(statusCode==200){
						this.getSocialCampaign(socialCampaignAlias);
					}else{
						this.router.navigate(['/home/error/404']);
					}
				}
			);
	}

	

	listAllTeamMemberEmailIds(){
		this.loading = true;
        this.campaignService.getAllTeamMemberEmailIds(this.loggedInUserId)
        .subscribe(
        data => {
          let self = this;
          $.each(data,function(index:number,_value:any){
              self.teamMemberEmailIds.push(data[index]);
          });
		  let teamMember = this.teamMemberEmailIds.filter((teamMember)=> teamMember.id ==this.loggedInUserId)[0];
		  this.socialCampaign.fromEmail = teamMember.emailId;
		  this.socialCampaign.fromName = $.trim(teamMember.firstName+" "+teamMember.lastName);
		  this.setEmailIdAsFromName();
        },
        error => {this.loading = false;},
        () => {this.loading = false;}
        );
    }

	setLoggedInUserEmailId(){
        const userProfile = this.authenticationService.userProfile;
        this.socialCampaign.fromEmail = userProfile.emailId;
        if(userProfile.firstName !== undefined && userProfile.lastName !== undefined)
            this.socialCampaign.fromName = $.trim(userProfile.firstName + " " + userProfile.lastName);
        else if(userProfile.firstName !== undefined && userProfile.lastName == undefined)
            this.socialCampaign.fromName = $.trim(userProfile.firstName);
        else
            this.socialCampaign.fromName = $.trim(userProfile.emailId);
        this.setEmailIdAsFromName();
    }

    setFromName(){
        let user = this.teamMemberEmailIds.filter((teamMember)=> teamMember.emailId == this.socialCampaign.fromEmail)[0];
        this.socialCampaign.fromName = $.trim(user.firstName+" "+user.lastName);
        this.setEmailIdAsFromName();
    }

	setEmailIdAsFromName() {
        if (this.socialCampaign.fromName.length == 0) {
            this.socialCampaign.fromName = this.socialCampaign.fromEmail;
        }
    }
	
	validateFromName(fromName:string){
		let trimmedFromName = this.referenceService.replaceMultipleSpacesWithSingleSpace($.trim(fromName));
		this.isValidFromName = trimmedFromName!=undefined && trimmedFromName.length>0;
	}
	
}


