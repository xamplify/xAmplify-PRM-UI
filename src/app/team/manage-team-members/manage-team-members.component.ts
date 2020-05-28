import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CallActionSwitch } from '../../videos/models/call-action-switch';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { FileUtil } from '../../core/models/file-util';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TeamMember } from '../models/team-member';
import { Status } from '../models/status.enum';
import { TeamMemberUi } from '../models/team-member-ui';
import { TeamMemberService } from '../services/team-member.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { Pagination } from '../../core/models/pagination';
import { PagerService } from '../../core/services/pager.service';
import { CustomResponse } from '../../common/models/custom-response';
import { UserService } from "app/core/services/user.service";
import { UtilService } from '../../core/services/util.service';
import {VanityURLService} from 'app/vanity-url/services/vanity.url.service';

declare var $, swal: any;
@Component({
	selector: 'app-manage-team-members',
	templateUrl: './manage-team-members.component.html',
	styleUrls: ['./manage-team-members.component.css'],
	providers: [Pagination, HttpRequestLoader, FileUtil, CallActionSwitch]
})
export class ManageTeamMembersComponent implements OnInit {

	public httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();
	public teamMemberModulesLoader:HttpRequestLoader = new HttpRequestLoader();
	uiError: string;
	teamMemberModules: Array<any>;
	teamMembers: Array<any>;
	teamMemberUi: TeamMemberUi;
	isLoggedInAsTeamMember: boolean;
	loggedInUserId:number = 0;
	loginAsTeamMemberAccess: any;
	superiorRole:string = "";
	isOrgAdmin = false;
	moduleNames:Array<string>;

	videoAccess = false;
	campaignAccess = false;
	designAccess = false;
	socialShareAccess = false;
	statsAccess = false;
	partnersAccess = false;
	contactsAccess = false;
	selectedId: number = 0;
	deletePopupLoader = false;
	isOnlyPartner = false;
	items2: any[] = [];
	emailIds: any[] = [];
	teamMemberIdToDelete: number = 0;
	selectedTeamMemberEmailId: string = "";
	allEmailIds: string[] = [];
	loading = false;
	selectedItem: any = '';
	inputChanged: any = '';
	constructor(public logger: XtremandLogger, public referenceService: ReferenceService, private teamMemberService: TeamMemberService,
		public authenticationService: AuthenticationService, private pagerService: PagerService, public pagination: Pagination,
		private fileUtil: FileUtil, public callActionSwitch: CallActionSwitch, public userService: UserService, private router: Router,
		 public utilService: UtilService,private vanityUrlService:VanityURLService) {
		this.isLoggedInAsTeamMember = this.utilService.isLoggedAsTeamMember();
		this.loggedInUserId = this.authenticationService.getUserId();
		this.vanityUrlService.isVanityURLEnabled();
	}

	ngOnInit() {
		this.listTeamMemberModules();
		this.listAllTeamMembers(this.pagination);
	}

	listTeamMemberModules() {
		try {
			this.referenceService.loading(this.teamMemberModulesLoader, true);
			this.teamMemberModulesLoader.isHorizontalCss = true;
			let input = {};
			input['userId'] = this.authenticationService.getUserId();
			this.teamMemberService.listTeamMemberModules(input)
				.subscribe(
					data => {
						let response = data.data;
						if (data.statusCode == 200) {
							this.teamMemberModules = response.modules;
							this.moduleNames = this.teamMemberModules.map(function (a) { return a.moduleName; });
							this.videoAccess = this.moduleNames.indexOf('Video')>-1;
							this.campaignAccess = this.moduleNames.indexOf('Campaign')>-1;
							this.designAccess = this.moduleNames.indexOf('Design')>-1;
							this.socialShareAccess = this.moduleNames.indexOf('Social Share')>-1;
							this.statsAccess = this.moduleNames.indexOf('Stats')>-1;
							this.partnersAccess = this.moduleNames.indexOf('Partners')>-1;
							this.contactsAccess = this.moduleNames.indexOf('Contacts')>-1;
							this.superiorRole = response.superiorRole;
							this.isOrgAdmin = this.superiorRole ==" Org Admin" || this.superiorRole =="Org Admin & Partner";
							this.isOnlyPartner = this.superiorRole == "Partner";
						} else {
							this.showUIError("Please pass the userId as input");
						}
						this.referenceService.loading(this.teamMemberModulesLoader, false);
					},
					error => {
						this.logger.errorPage(error);
					},
					() => this.logger.info("Finished listTeamMembers()")
				);
		} catch (error) {
			this.showUIError(error);
		}
	}


	listAllTeamMembers(pagination: Pagination) {
		try {
			this.referenceService.loading(this.httpRequestLoader, true);
			pagination.userId =this.loggedInUserId;
			this.teamMemberService.listTeamMembers(pagination)
				.subscribe(
					data => {
						let response = data.data;
						this.loginAsTeamMemberAccess = response.loginAsTeamMemberModuleAccess;
						this.teamMembers = response.teamMembers;
						pagination.totalRecords = response.totalRecords;
						pagination = this.pagerService.getPagedItems(pagination, this.teamMembers);
						this.referenceService.loading(this.httpRequestLoader, false);
					},
					error => {
						this.logger.errorPage(error);
					},
					() => this.logger.info("Finished listAllTeamMembers()")
				);
		} catch (error) {
			this.showUIError(error);
		}
	}


	showUIError(error) {
		this.uiError = 'Oops! Something went wrong';
		this.logger.error(error);
	}


	refreshList(){
		this.pagination.pageIndex = 1;
		this.pagination.searchKey = "";
		this.listAllTeamMembers(this.pagination);
	}

	addAllAuthorities(e, team: TeamMember, tableId: string, index: number) {
		try {
			var table = $(e.target).closest('tr');
			$('td input:checkbox', table).prop('checked', e.target.checked);
			if (e.target.checked) {
				this.setAllRoles(team);
			} else {
				this.removeAllRoles(team);
			}
		} catch (error) {
			this.showUIError(error);
		}

	}

	setAllRoles(team: TeamMember) {
		    team.video = this.videoAccess;
			team.emailTemplate = this.designAccess;
			team.form = this.designAccess;
			team.landingPage = this.designAccess;
			team.design = this.designAccess;			
			team.stats = this.statsAccess;
			team.socialShare = this.socialShareAccess;
			team.partners = this.partnersAccess;
			team.contact = this.contactsAccess;
	}
	removeAllRoles(team: TeamMember) {
		team.video = false;
		team.campaign = false;
		team.emailTemplate = false;
		team.landingPage = false;
		team.form = false;
		team.design = false;
		team.stats = false;
		team.contact = false;
		team.socialShare = false;
		team.partners = false;
	}

	countCheckedCheckBoxesLength(team: TeamMember, index: number, tableId: string) {
		try {
			let length = $('#' + tableId + ' .module-checkbox-' + index + ':checked').length;
			if(this.moduleNames.length>3){
				/**********Vendor/Org Admin Team Members******/
				let allSelected = (this.contactsAccess && length == 7) || (!this.contactsAccess && length == 6);
				if(allSelected){
					team.all = true;
					this.setAllRoles(team);
				}else {
					team.all =  false;
					team.secondOrgAdmin = false;
					if(length==0){
						this.removeAllRoles(team);
					}
				}

			}else{
			/**********Partner Team Members******/
			if(length==2){
				team.all = true;
				this.setAllRoles(team);
			}else{
				team.all = false;
				this.removeAllRoles(team);
			}
			}
		} catch (error) {
			this.showUIError(error);
		}
	}

	changeOrgAdminStatus(event: any, index: number, team: TeamMember) {
		$('#empty-roles-div').hide();
		if (event) {
			this.enableAsOrgAdmin(event, index, team);
		} else {
			this.disableAsAnOrgAdmin(event, index, team);
		}
	}

	disableAsAnOrgAdmin(event: any, index: number, team: TeamMember) {
		team.secondOrgAdmin = false;
	}

	enableAsOrgAdmin(event: any, index: number, team: TeamMember) {
		this.setAllRoles(team);
		team.all = true;
		team.secondOrgAdmin = event;
	}

	changeTeamMemberStatus(teamMember: TeamMember, event: any) {
		if (event) {
			teamMember.status = Status.APPROVE;
			teamMember.enabled = event;
		} else {
			teamMember.status = Status.DECLINE;
			teamMember.enabled = event;
			teamMember.secondOrgAdmin = false;
		}
	}

	showPopup(teamMember: TeamMember) {
		this.selectedId = 0;
		this.deletePopupLoader = true;
		$('#delete-team-member-popup').modal('show');
		this.teamMemberService.listEmailIdsForTransferData(this.loggedInUserId, this.isOnlyPartner)
			.subscribe(
				data => {
					this.setDropDownData(data);
					this.emailIds = this.items2.filter((item) => item.id !== teamMember.teamMemberId);
					this.teamMemberIdToDelete = teamMember.teamMemberId;
					this.selectedTeamMemberEmailId = teamMember.emailId;
					this.deletePopupLoader = false;
				},
				error => {
					$('#delete-team-member-popup').modal('hide');
					this.referenceService.showSweetAlertErrorMessage('Something went wrong.Please try after sometime');

				},
				() => this.logger.log("showPopup() done")
			);

	}

	setDropDownData(data: any) {
		let self = this;
		self.items2 = [];
		$.each(data, function (index, value) {
			let emailId = data[index].emailId;
			let id = data[index].id;
			let obj = { 'id': id, 'emailId': emailId };
			self.items2.push(obj);
		});
	}

	hidePopup() {
		this.selectedItem = "";
		this.inputChanged = "";
		$('input').val('');
		$('#delete-team-member-popup').modal('hide');
	}


	goToCampaignAnalytics(teamMemberId: number) {
		this.loading = true;
		this.router.navigate(['/home/campaigns/manage/tm/' + teamMemberId])
	}

	/**************Search TeamMembers***************/
	searchTeamMembers() {
		this.pagination.pageIndex = 1;
		this.listAllTeamMembers(this.pagination);
	}
/**************Pagination TeamMembers***************/
	setPage(event: any) {
		this.pagination.pageIndex = event.page;
		this.listAllTeamMembers(this.pagination);
	}
	eventHandler(keyCode: any) { if (keyCode === 13) { this.searchTeamMembers(); } }
}
