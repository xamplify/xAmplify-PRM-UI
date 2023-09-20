import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { XtremandLogger } from "app/error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { DamUploadPostDto } from 'app/dam/models/dam-upload-post-dto';
import { DamService } from 'app/dam/services/dam.service';
import { Properties } from 'app/common/models/properties';

declare var $: any, swal: any;
@Component({
	selector: 'app-delete-assets',
	templateUrl: './delete-assets.component.html',
	styleUrls: ['./delete-assets.component.css'],
	providers: [Properties]
})
export class DeleteAssetsComponent implements OnInit,OnDestroy {
	
	@Input() asset: any;
	@Output() deleteAssetLoaderEmitter = new EventEmitter();
	@Output() deleteAssetSuccessEmitter = new EventEmitter();
	@Output() deleteAssetCancelEmitter = new EventEmitter();
	@Output() deleteAssetFailEmitter = new EventEmitter();
	properties: Properties = new Properties();
	constructor(public authenticationService: AuthenticationService, public xtremandLogger: XtremandLogger, public referenceService: ReferenceService,
		public damService: DamService) { }

	ngOnInit() {
		this.confirmDelete(this.asset);
	}
	ngOnDestroy(): void {
		swal.close();
	}

	confirmDelete(asset: any) {
		let self = this;
		swal({
			title: 'Are you sure?',
			text: "You won't be able to undo this action!",
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: 'Yes, delete it!'

		}).then(function () {
			self.deleteById(asset);
		}, function (dismiss: any) {
			self.deleteAssetCancelEmitter.emit();
		});
	}

	deleteById(asset: any) {
		this.deleteAssetLoaderEmitter.emit();
		let currentUrl = this.referenceService.getCurrentRouteUrl();
		/****XBI-1661***/
		if(currentUrl.indexOf("dam")>-1){
			this.referenceService.goToTop();
		}
		/****XBI-1661***/
		let damUploadPostDto = new DamUploadPostDto();
		damUploadPostDto.loggedInUserId = this.authenticationService.getUserId();
		damUploadPostDto.id = asset.id;
		this.damService.delete(damUploadPostDto)
			.subscribe(
				(response: any) => {
					if (response.statusCode === 200) {
						this.deleteAssetSuccessEmitter.emit(response);
					} else {
						this.deleteAssetFailEmitter.emit(response.message);						
					}
				},
				(_error: string) => {
					this.referenceService.showSweetAlertErrorMessage(this.properties.serverErrorMessage);
					this.deleteAssetCancelEmitter.emit();
				}
			);
	}

}
