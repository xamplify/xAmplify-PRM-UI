import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CalendarIntegrationService } from 'app/core/services/calendar-integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
declare var swal: any, $: any;

@Component({
	selector: 'app-calendar-integration-settings',
	templateUrl: './calendar-integration-settings.component.html',
	styleUrls: ['./calendar-integration-settings.component.css'],
	providers: [CalendarIntegrationService]
})
export class CalendarIntegrationSettingsComponent implements OnInit {

	@Input() integrationType: string;
	@Output() closeEvent = new EventEmitter<any>();
	@Output() unlinkEvent = new EventEmitter<any>();
	@Output() refreshEvent = new EventEmitter<any>();

	customResponse: CustomResponse = new CustomResponse();
	httpRequestLoader: HttpRequestLoader = new HttpRequestLoader();

	ngxloading: boolean;
	activeCalendarDetails: any;
	calendarDetails: any;
	schedulingUrl: string;
	showSchedulingUrlTab: boolean = false;
	isValidURL: boolean = false;

	constructor(public referenceService: ReferenceService, public authenticationService: AuthenticationService, public calendarIntegrationService: CalendarIntegrationService, public properties:Properties) { }

	ngOnInit() {
		this.getIntegrationDetails();
	}

	getIntegrationDetails() {
		this.ngxloading = true;
		let self = this;
		self.calendarIntegrationService.getIntegrationDetails(this.integrationType.toLowerCase())
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
						this.calendarDetails = data.data;
					}
				},
				error => {
					this.ngxloading = false;
				}
			);
	}

	activateCalendar() {
		try {
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "Click Yes to mark this as your active Calendar",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, activate!'

			}).then(function () {
				let request: any = {};
				request.type = self.integrationType;
				self.setActiveCalendar(request);
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.referenceService.showServerError(this.httpRequestLoader);
		}
	}

	setActiveCalendar(request: any) {
		this.ngxloading = true;
		this.calendarIntegrationService.setActiveCalendar(request)
			.subscribe(
				data => {
					this.ngxloading = false;
					if (data.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
						this.getIntegrationDetails();
						this.refreshEvent.emit();
					}
				});
	}

	unlinkCalendar() {
		try {
			let self = this;
			swal({
				title: 'Are you sure?',
				text: "Unlinking calendar, click Yes to continue.",
				type: 'warning',
				showCancelButton: true,
				swalConfirmButtonColor: '#54a7e9',
				swalCancelButtonColor: '#999',
				confirmButtonText: 'Yes, delete!'

			}).then(function () {
				self.ngxloading = true;
				self.calendarIntegrationService.unlinkCalendar(self.integrationType.toLowerCase())
					.subscribe(
						data => {
							if (data.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
								self.unlinkEvent.emit(data.message);
							}
							self.ngxloading = false;
						});
			}, function (dismiss: any) {
				console.log('you clicked on option' + dismiss);
			});
		} catch (error) {
			this.referenceService.showServerError(this.httpRequestLoader);
		}
	}

	closeSettings() {
		this.closeEvent.emit();
	}

	setActiveTab(tabName: string) {
		if(tabName === 'menu1'){
			this.showSchedulingUrlTab = true;
		}
	}

	validateURL() {
		if (this.referenceService.checkIsValidString(this.calendarDetails.userUri)) {
			this.isValidURL = true;
		} else {
			this.isValidURL = false;
		}
	}

	submit() {
		this.ngxloading = true;
		this.calendarIntegrationService.checkAssociationAndUpdateSchedulingURL(this.calendarDetails.userUri).subscribe(
			response => {
				if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_OK) {
					this.customResponse = new CustomResponse('SUCCESS', 'Meeting Scheduling Link updated successfully.', true);
				} else if (response.statusCode == XAMPLIFY_CONSTANTS.HTTP_UNAUTHORIZED) {
					this.customResponse = new CustomResponse('ERROR', response.message, true);
				} else {
					this.customResponse = new CustomResponse('ERROR', 'Failed to update Meeting Scheduling link.', true);
				}
				this.ngxloading = false;
			}, error => {
				this.ngxloading = false;
				this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
			}
		)
	}

}
