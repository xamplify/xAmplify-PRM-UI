import { Component, OnInit,Input } from '@angular/core';
import { CustomResponse } from 'app/common/models/custom-response';
import { Properties } from 'app/common/models/properties';
import { FileUtil } from 'app/core/models/file-util';
import { HttpRequestLoader } from 'app/core/models/http-request-loader';
import { Pagination } from 'app/core/models/pagination';
import { SortOption } from 'app/core/models/sort-option';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReferenceService } from 'app/core/services/reference.service';
import { UtilService } from 'app/core/services/util.service';

declare var $:any,Papa: any;;
@Component({
  selector: 'app-add-or-manage-domains',
  templateUrl: './add-or-manage-domains.component.html',
  styleUrls: ['./add-or-manage-domains.component.css','../user-profile/my-profile/my-profile.component.css'],
  providers:[HttpRequestLoader,Properties,SortOption],
})
export class AddOrManageDomainsComponent implements OnInit {

  customResponse:CustomResponse = new CustomResponse();
  @Input() moduleName:string;
  headerText = "";
  downloadCsvText = "";
  isAddDomainsModule = false;
  isExcludeDomainModule = false;
  uploadedCsvFilePreview = false;
  domain = "";
  descriptionText = "";
  isDomainExist: boolean = false;
  validDomainFormat: boolean = true;
  validDomainPattern: boolean = false;
  isListLoader = false;
  excludedUsers: any[];
  pagination: Pagination = new Pagination();
  addedDomains: string[] = [];
  constructor(public authenticationService:AuthenticationService,public referenceService:ReferenceService,
    public httpRequestLoader:HttpRequestLoader,public properties:Properties,public fileUtil:FileUtil,public sortOption:SortOption,
	public utilService:UtilService) { }

  ngOnInit() {
    this.isAddDomainsModule = this.moduleName=="addDomains";
    this.isExcludeDomainModule = this.moduleName=="excludeDomains";
    if(this.isAddDomainsModule){
      this.headerText = "Add Domains";
      this.downloadCsvText = "Download CSV Template";
      this.descriptionText = "Adding a domain ensures that the specified domain based yours will be added as team members using your company link.";
      this.descriptionText = "Add a domain to invite team members who share your company's domain and join using your unique link, streamlining team management and identification.";
    }else if(this.isExcludeDomainModule){
      this.headerText = "Exclude A Domain";
    }
  }

  downloadEmptyCSV(){
    if(this.isAddDomainsModule){
      window.location.href = this.authenticationService.REST_URL + "domain/downloadDefaultCsv/Add-Domains.csv?access_token=" + this.authenticationService.access_token;
    }else if(this.isExcludeDomainModule){
        window.location.href = this.authenticationService.MEDIA_URL + "UPLOAD_EXCLUDE_DOMAIN_EMPTY.csv";
    }
  }


  addDomainModalOpen(){
    this.domain = "";
    $('#addDomainModal').modal('show');
  }

  addDomainModalClose(){
    $('#addDomainModal').modal('toggle');
	$("#addDomainModal .close").click();
	$('#addDomainModal').modal('hide');
	$('.modal').removeClass('show');
	this.domain = "";
	this.isDomainExist = false;
	this.validDomainFormat = true;
	this.validDomainPattern = false;
  }

  fileChange(input: any, excludetype: string) {
    this.customResponse = new CustomResponse();
		this.readFiles(input.files, excludetype);
	}

  readFiles(files: any, excludetype: string) {
		if (this.fileUtil.isCSVFile(files[0])) {
			this.isListLoader = true;
			let reader = new FileReader();
			reader.readAsText(files[0]);
			var lines = new Array();
			var self = this;
			reader.onload = function (e: any) {
				var contents = e.target.result;
				let csvData = reader.result;
				let csvRecordsArray = csvData.split(/\r|\n/);
				let headersRow = self.fileUtil.getHeaderArray(csvRecordsArray);
				let headers = headersRow[0].split(',');
				if ((headers.length == 1)) {
					if (self.validateHeaders(headers, excludetype)) {
						var csvResult = Papa.parse(contents);
						  var allTextLines = csvResult.data;
						  self.pagination = new Pagination();
							self.addedDomains = [];
							self.readExcludedDomainsCSVFileContent(allTextLines, self.pagination);
					} else {
						self.showErrorMessage(excludetype);
						self.isListLoader = false;
					}
				} else {
					self.showErrorMessage(excludetype);
					self.isListLoader = false;
				}
			}
		} else {
			self.customResponse = new CustomResponse('ERROR', self.properties.FILE_TYPE_ERROR, true);

		}
	}
  showErrorMessage(excludetype: string) {
    this.customResponse = new CustomResponse('ERROR', "Invalid Csv", true);
  }


  readExcludedDomainsCSVFileContent(allTextLines: any, pagination: Pagination) {
		this.customResponse = new CustomResponse
		for (var i = 1; i < allTextLines.length; i++) {
			if (allTextLines[i][0] && allTextLines[i][0].trim().length > 0) {
				let domain = allTextLines[i][0].trim();
				this.addedDomains.push(domain);
			}
		}
		this.pagination.page = 1;
		this.pagination.maxResults = 12;
		this.pagination.type = "csvDomains";
		//this.setPage(this.csvDomainPagination);
		this.isListLoader = false;
		if (this.addedDomains.length === 0) {
			this.customResponse = new CustomResponse('ERROR', "No domains found.", true);
			this.uploadedCsvFilePreview = false;
		}else{
			this.uploadedCsvFilePreview = true;

		}

	}

  isCSVFile(file) {
		return file.name.endsWith(".csv");
	}

	validateHeaders(headers, excludetype: string) {
		if (excludetype === 'exclude-users') {
			return (this.removeDoubleQuotes(headers[0]) == "EMAILID" || headers[0] == "EMAIL ID");
		} else if (excludetype === 'exclude-domains') {
			return (this.removeDoubleQuotes(headers[0]) == "DOMAIN NAME" || headers[0] == "DOMAINNAME" || headers[0] == "DOMAIN");
		}
	}

	removeDoubleQuotes(input: string) {
		if (input != undefined) {
			return input.trim().replace('"', '').replace('"', '');
		} else {
			return "";
		}
	}


	/********Pagination & Search Code***********/
	navigateBetweenPageNumbers(event: any) {
		this.pagination.pageIndex = event.page;
		this.findDomains(this.pagination);
	  }
	
	  searchDomains() {
		this.getAllFilteredResults(this.pagination);
	  }
	
	  searchDomainsOnKeyPress(keyCode: any) { if (keyCode === 13) { this.searchDomains(); } }
	
	  sortBy(text: any) {
		this.getAllFilteredResults(this.pagination);
	  }
	
	  getAllFilteredResults(pagination: Pagination) {
		pagination.searchKey = this.sortOption.searchKey;
		pagination = this.utilService.sortOptionValues(this.sortOption.selectedDomainDropDownOption, pagination);
		this.findDomains(pagination);
	  }


	findDomains(pagination: Pagination) {
		throw new Error('Method not implemented.');
	}




}
