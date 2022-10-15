import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { HttpClient } from "@angular/common/http";
import { DamPostDto } from '../models/dam-post-dto';
import { DamService } from '../services/dam.service';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from '../../common/models/properties';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { Pagination } from '../../core/models/pagination';
import { HttpRequestLoader } from '../../core/models/http-request-loader';
import { Tag } from 'app/dashboard/models/tag'
import { UserService } from '../../core/services/user.service';

declare var $, CKEDITOR: any;
@Component({
  selector: 'app-add-dam',
  templateUrl: './add-dam.component.html',
  styleUrls: ['./add-dam.component.css'],
  providers: [Properties, Pagination, HttpRequestLoader]
})
export class AddDamComponent implements OnInit, OnDestroy {

  ngxloading = false;
  jsonBody: any;
  damPostDto: DamPostDto = new DamPostDto();
  loggedInUserId: number = 0;
  modalPopupLoader: boolean;
  customResponse: CustomResponse = new CustomResponse();
  assetId: number = 0;
  isAdd = false;
  modalTitle = "";
  saveOrUpdateButtonText = "";
  name = "";
  description = "";
  validForm = false;
  nameErrorMessage = "";
  isPartnerView = false;
  vendorCompanyLogoPath = "";
  partnerCompanyLogoPath = "";
  isValidName = false;
  isValidDescription = false;
  beeContainerInput = {};
  tags: Array<Tag> = new Array<Tag>();
	tagFirstColumnEndIndex: number = 0;
	tagsListFirstColumn: Array<Tag> = new Array<Tag>();
	tagsListSecondColumn: Array<Tag> = new Array<Tag>();
	tagSearchKey: string = "";
	tagsLoader: HttpRequestLoader = new HttpRequestLoader();
  openAddTagPopup: boolean = false;
	ckeConfig: any;
	@ViewChild("ckeditor") ckeditor: any;
  isCkeditorLoaded: boolean = false;
  descriptionErrorMessage: string;
 /***XNFR-169*****/
 categoryNames: any;
 filteredCategoryNames: any;
 showFolderDropDown = false;
  constructor(private xtremandLogger: XtremandLogger, public router: Router, private route: ActivatedRoute, public properties: Properties, private damService: DamService, private authenticationService: AuthenticationService, public referenceService: ReferenceService, private httpClient: HttpClient, public userService: UserService) {
    this.loggedInUserId = this.authenticationService.getUserId();
  }

  ngOnInit() {
    this.ngxloading = true;
    this.beeContainerInput['module'] = "dam";
    if (this.router.url.indexOf('/edit') > -1) {
      this.assetId = parseInt(this.route.snapshot.params['id']);
      if (this.assetId > 0) {
        this.isPartnerView = this.router.url.indexOf('/editp') > -1;
        this.isAdd = false;
        this.modalTitle = "Update Details";
        this.saveOrUpdateButtonText = "Update";
        this.listCategories();
        this.getById();
      } else {
        this.goToManageSectionWithError();
      }
    } else {
      this.isAdd = true;
      this.modalTitle = "Add Details";
      this.saveOrUpdateButtonText = "Save";
      this.listCategories();
      this.httpClient.get("assets/config-files/bee-default-asset.json").subscribe(data => {
        this.jsonBody = JSON.stringify(data);
        this.beeContainerInput['jsonBody'] = this.jsonBody;
        this.ngxloading = false;
      });
    }
  }

  ngOnDestroy() {
    $('#addAssetDetailsPopup').modal('hide');
    this.openAddTagPopup = false;
  }

  goToManageSectionWithError() {
    this.referenceService.showSweetAlertErrorMessage("Invalid Id");
    this.referenceService.goToRouter("/home/dam");
  }

  getById() {
    this.damService.getById(this.assetId, this.isPartnerView).subscribe((result: any) => {
      if (result.statusCode === 200) {
        let dam = result.data;
        if (dam != undefined) {
          this.jsonBody = dam.jsonBody;
          this.beeContainerInput['jsonBody'] = this.jsonBody;
          this.damPostDto.name = dam.assetName;
          this.damPostDto.description = dam.description;
          this.name = dam.assetName;
          this.validForm = true;
          this.isValidName = true;
          this.isValidDescription = true;
          this.nameErrorMessage = "";
          this.description = dam.description;
          this.vendorCompanyLogoPath = dam.vendorCompanyLogo;
          this.partnerCompanyLogoPath = dam.partnerCompanyLogo;
          this.beeContainerInput['vendorCompanyLogoPath'] = this.vendorCompanyLogoPath;
          this.beeContainerInput['partnerCompanyLogoPath'] = this.partnerCompanyLogoPath;
          if(dam.tagIds == undefined){
            this.damPostDto.tagIds = new Array<number>();
          } else {
            this.damPostDto.tagIds = dam.tagIds;
          }
        } else {
          this.goToManageSectionWithError();
        }
        this.ngxloading = false;
      }else{
        this.referenceService.goToPageNotFound();
      }
    }, error => {
      this.xtremandLogger.log(error);
      this.ngxloading = false;
      this.goBack();
      this.referenceService.showSweetAlertServerErrorMessage();
    });
  }

  goBack() {
    this.ngxloading = true;
    if (this.isPartnerView) {
      this.referenceService.goToRouter("/home/dam/shared");
    } else {
      if(this.isAdd){
        this.referenceService.goToRouter("/home/dam/select");
      }else{
        this.referenceService.goToRouter("/home/dam/manage");
      }
    }
  }

  readBeeTemplateData(event: any) {
    this.ngxloading = true;
    this.damPostDto.jsonBody = event.jsonContent;
    this.damPostDto.htmlBody = event.htmlContent;
    if(!this.isPartnerView){
      this.listTags(new Pagination());
      $('#addAssetDetailsPopup').modal('show');
      this.ngxloading = false;
    }else{
      this.saveOrUpdate(false);
    }
   
  }

  hidePopup() {
    $('#addAssetDetailsPopup').modal('hide');
    if (!this.isAdd || this.isPartnerView) {
      if ($.trim(this.damPostDto.name).length == 0) {
        this.damPostDto.name = this.name;
      }
      if ($.trim(this.damPostDto.description).length == 0) {
        this.damPostDto.description = this.description;
      }
      this.validateForm('name');
      this.validateForm('description');
      this.validateFields();
    }
  }

  validateForm(columnName:string){
    if(columnName=="name"){
      this.isValidName = $.trim(this.damPostDto.name)!=undefined && $.trim(this.damPostDto.name).length>0;
    }else if(columnName=="description"){
      this.isValidDescription = $.trim(this.damPostDto.description)!=undefined && $.trim(this.damPostDto.description).length>0 && $.trim(this.damPostDto.description).length < 5000;
      this.updateDescriptionErrorMessage();
    }
    this.validateFields();
  }

  validateFields() {
    this.validForm = this.isValidName && this.isValidDescription;
  }

  updateDescriptionErrorMessage(){
		if($.trim(this.damPostDto.description).length < 5000){
			this.descriptionErrorMessage = "";
		} else {
			this.descriptionErrorMessage = "Description can't exceed 5000 characters.";
		}
  }
  
  saveOrUpdate(saveAs:boolean) {
    this.getCkEditorData();
    this.nameErrorMessage = "";
    this.customResponse = new CustomResponse();
    this.modalPopupLoader = true;
    this.damPostDto.createdBy = this.loggedInUserId;
    if (this.isPartnerView) {
      this.updatePublishedAsset();
    } else {
      if (!this.isAdd && !saveAs) {
        this.damPostDto.id = this.assetId;
      }
      this.damService.save(this.damPostDto).subscribe((result: any) => {
        this.hidePopup();
        this.referenceService.isCreated = true;
        this.referenceService.goToRouter("/home/dam/manage");
        this.modalPopupLoader = false;
      }, error => {
        this.showErrorMessageOnSaveOrUpdate(error);
      });
    }


  }

  updatePublishedAsset() {
    this.damPostDto.id = this.assetId;
    this.damService.updatePublishedAsset(this.damPostDto).subscribe((result: any) => {
      this.hidePopup();
      this.referenceService.isUpdated = true;
      this.referenceService.goToRouter("/home/dam/shared");
      this.modalPopupLoader = false;
    }, error => {
      this.xtremandLogger.errorPage(error);
    });
  }

  showErrorMessageOnSaveOrUpdate(error: any) {
    this.modalPopupLoader = false;
    let statusCode = JSON.parse(error['status']);
    if (statusCode == 409) {
      this.validForm = false;
      this.nameErrorMessage = "Already exists";
    } else {
      this.customResponse = new CustomResponse('ERROR', this.properties.serverErrorMessage, true);
    }
  }

  saveAs(){
    this.referenceService.showSweetAlertInfoMessage();
  }

	goToManageDam() {
		this.ngxloading = true;
      if (this.isPartnerView) {
      			this.referenceService.goToRouter("/home/dam/shared");
          }else{		
				this.referenceService.goToRouter("home/dam/manage");
		}
	}
	
	goToSelect(){
		this.ngxloading = true;
		this.referenceService.goToRouter("home/dam/select");
	}

   /*****************List Tags*******************/
 listTags(pagination: Pagination) {
  pagination.userId = this.loggedInUserId;
  pagination.maxResults = 0;
  let self = this;
  this.referenceService.startLoader(this.tagsLoader);
  this.userService.getTagsSearchTagName(pagination)
    .subscribe(
      response => {
        const data = response.data;
        this.tags = data.tags;
        let length = this.tags.length;
        if ((length % 2) == 0) {
          this.tagFirstColumnEndIndex = length / 2;
          this.tagsListFirstColumn = this.tags.slice(0, this.tagFirstColumnEndIndex);
          this.tagsListSecondColumn = this.tags.slice(this.tagFirstColumnEndIndex);
        } else {
          this.tagFirstColumnEndIndex = (length - (length % 2)) / 2;
          this.tagsListFirstColumn = this.tags.slice(0, this.tagFirstColumnEndIndex + 1);
          this.tagsListSecondColumn = this.tags.slice(this.tagFirstColumnEndIndex + 1);
        }
        this.referenceService.stopLoader(this.tagsLoader);
      },
      (error: any) => {
        this.customResponse = this.referenceService.showServerErrorResponse(this.tagsLoader);
        this.referenceService.stopLoader(this.tagsLoader);
      },
      () => this.xtremandLogger.info('Finished listTags()')
    );
}

searchTags() {
  let pagination: Pagination = new Pagination();
  pagination.searchKey = this.tagSearchKey;
  this.listTags(pagination);
}

tagEventHandler(keyCode: any) { if (keyCode === 13) { this.searchTags(); } }

updateSelectedTags(tag: Tag, checked: boolean) {
  let index = this.damPostDto.tagIds.indexOf(tag.id);
  if (checked == undefined) {
    if (index > -1) {
      this.damPostDto.tagIds.splice(index, 1);
    } else {
      this.damPostDto.tagIds.push(tag.id);
    }
  } else if (checked) {
    this.damPostDto.tagIds.push(tag.id);
  } else {
    this.damPostDto.tagIds.splice(index, 1);
  }
  console.log(this.damPostDto.tagIds)
}

addTag() {
  this.openAddTagPopup = true;
}

resetTagValues(message: any) {
  this.openAddTagPopup = false;
  this.showSuccessMessage(message);
  this.listTags(new Pagination());
}

showSuccessMessage(message: any) {
  if (message != undefined) {
    this.customResponse = new CustomResponse('SUCCESS', message, true);
  }
}

onReady(event: any) {
  this.isCkeditorLoaded = true;
}

getCkEditorData() {
  if(CKEDITOR!=undefined){
  for (var instanceName in CKEDITOR.instances) {
    CKEDITOR.instances[instanceName].updateElement();
    this.damPostDto.description = CKEDITOR.instances[instanceName].getData();
  }
  }
}

/*****************List Categories*******************/
listCategories() {
  this.ngxloading = true;
  this.authenticationService.getCategoryNamesByUserId(this.loggedInUserId).subscribe(
    (data: any) => {
      this.categoryNames = data.data;
      this.filteredCategoryNames = this.categoryNames;
      this.ngxloading = false;
      this.showFolderDropDown = true;
    },
    error => {
      this.ngxloading = false;
      this.showFolderDropDown = true;
    });
}
getSelectedCategoryId(categoryId:number){
    this.damPostDto.categoryId = categoryId;
}

}
