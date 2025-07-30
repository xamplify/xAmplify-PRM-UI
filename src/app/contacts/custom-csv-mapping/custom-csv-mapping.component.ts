import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { ParsedCsvDto } from '../models/parsed-csv-dto';
import { DefaultContactsCsvColumnHeaderDto } from '../models/default-contacts-csv-column-header-dto';
import { CustomResponse } from 'app/common/models/custom-response';
import { FlexiFieldsRequestAndResponseDto } from 'app/dashboard/models/flexi-fields-request-and-response-dto';
import { SocialPagerService } from '../services/social-pager.service';
import { CsvRowDto } from '../models/csv-row-dto';
import { ReferenceService } from 'app/core/services/reference.service';
import { User } from 'app/core/models/user';
import { XtremandLogger } from 'app/error-pages/xtremand-logger.service';
import { XAMPLIFY_CONSTANTS } from 'app/constants/xamplify-default.constants';
import { CountryNames } from 'app/common/models/country-names';
import { ContactService } from '../services/contact.service';
import { RegularExpressions } from 'app/common/models/regular-expressions';

declare var swal: any, $: any;

@Component({
  selector: 'app-custom-csv-mapping',
  templateUrl: './custom-csv-mapping.component.html',
  styleUrls: ['./custom-csv-mapping.component.css'],
})
export class CustomCsvMappingComponent implements OnInit, OnDestroy {
  @Input() csvRows: any[];
  @Input() flexiFieldsRequestAndResponseDto: Array<FlexiFieldsRequestAndResponseDto>;
  @Output() notifyParent: EventEmitter<any>;
  @Output() notifyParentCancel: EventEmitter<any>;
  @Output() notifyParentSave : EventEmitter<any>;
  @Output() notifyParentCustomResponse : EventEmitter<any>;

  /***** XNFR-671 *****/
  xAmplifyDefaultCsvHeaders = ['First Name', 'Last Name', 'Company', 'Job Title', 'Email Id', 'Address', 'City', 'State', 'Zip Code', 'Country', 'Mobile Number', 'Contact Status'];
  firstNames = ['FirstName', 'FName','GivenName', 'PersonalName', 'ForeName', 'Initial'];
  lastNames = ['LastName', 'LName', 'Name', 'FullName', 'SurName', 'FamilyName'];
  companies = ['Company', 'ContactCompany', 'CompanyName', 'Organisation', 'Organization', 'Institution'];
  jobTitles = ['JobTitle', 'Title', 'Designation', 'Occupation', 'Position', 'Role', 'Profession'];
  emailIds = ['Email','EmailId','Email-Id','Email-Address','EmailAddress', 'Mail', 'MailId', 'ElectronicMail', 'ContactMail'];
  addresses = ['Address','Lane','AddressLane', 'Residence', 'Location', 'Street'];
  cities = ['City','CityName','Town','TownName', 'District', 'Area', 'AreaName', 'Township', 'UrbanArea', 'Municipality'];
  states = ['State', 'Region'];
  zipCodes = ['ZipCode','PinCode', 'Zip', 'Postal', 'PostalCode', 'PostalIndex', 'AreaCode', 'Pin', 'PostCode', 'ZipPostal'];
  countries = ['Country', 'Nation', 'Kingdom', 'Territory'];
  mobileNumbers = ['MobileNumber','Number','ContactNumber','CellNumber','Mobile', 'PhoneNumber', 'PhNumber', 'Contact', 'CellPhone', 'Cell', 'Phone', 'HandPhone', 'TelePhone', 'MobilePhone'];
  contactStatus = ['ContactStatus', 'Status', 'ContactStatusName', 'ContactStatusType', 'ContactState', 'ContactStage', 'StageName'];
  flexiFields = [];
  pager: any = {};
  pagedItems: any[];
  csvPager: any = {};
  csvPagedItems: any[];
  contacts: User[];
  isListLoader: boolean = false;
  mappingLoader: boolean = false;
  isResetButtonClicked: boolean = false;
  isColumnMapped: boolean = false;
  isValidEmailAddressMapped: boolean = false;
  customCsvHeaders: any[];
  duplicateMappedColumns = [];
  paginationType = '';
  regularExpressions = new RegularExpressions();
  parsedCsvDtos: Array<ParsedCsvDto> = new Array<ParsedCsvDto>();
  defaultContactsCsvColumnHeaderDtos: Array<DefaultContactsCsvColumnHeaderDto> = new Array<DefaultContactsCsvColumnHeaderDto>();
  duplicateColumnsMappedErrorResponse: CustomResponse = new CustomResponse();
  emptyHeadersIndex = [];
  /***** XNFR-671 *****/
  uploadCustomCsvHeaders = [];
  validUsersCount: number = 0;
  inValidUsersCount: number = 0;
  emptyUsersCount: number = 0;
  selectedOption: string = "";
  csvContacts: User[];
  invalidUsers: User[];
  invalidPatternEmails = [];
  csvCustomResponse = new CustomResponse();
  contactStatusStages = [];
  removedContactIds: Set<number> = new Set();
  rowIndices: number[];

  constructor(public socialPagerService: SocialPagerService, public referenceService: ReferenceService, 
    public properties: Properties, public xtremandLogger: XtremandLogger, public countryNames: CountryNames, 
    public contactService: ContactService, private cdr: ChangeDetectorRef) {
    this.notifyParent = new EventEmitter();
    this.notifyParentCancel = new EventEmitter();
    this.notifyParentSave = new EventEmitter();
    this.notifyParentCustomResponse = new EventEmitter();
  }

  ngOnInit() {
    this.loadParsedCsvDtoPagination();
    this.findContactStatusStages();
  }

  ngOnDestroy() {
    this.contactStatusStages = [];
    this.resetCustomUploadCsvFields();
    this.referenceService.closeModalPopup("csv-column-mapping-modal-popup");
    $('#invalid_Users_Model_Popup').modal('hide');
  }

  transform(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  /***** XNFR-671 *****/
  private loadParsedCsvDtoPagination(): void {
    this.isListLoader = true;
    this.paginationType = "customCsvContacts";
    let self = this;
    let csvHeaders = this.csvRows[0];
    this.parsedCsvDtos = [];
    this.customCsvHeaders = [];
    this.defaultContactsCsvColumnHeaderDtos = [];
    this.customUploadCsvHeaders();
    this.addCsvHeadersToMultiSelectDropDown(csvHeaders, self);
    const headersLength = this.customCsvHeaders.length;
    for (var i = 1; i < this.csvRows.length; i++) {
      let rows = this.csvRows[i];
      this.addEmptyToRows(rows, csvHeaders);
      let parsedCsvDto = new ParsedCsvDto();
      parsedCsvDto.rowIndex = i;
      parsedCsvDto.expanded = false;
      let emptyValues = [];
      this.iterateDTOAndCsvRows(rows, i, self, parsedCsvDto);
      let parsedCsvDtoRowsLength = parsedCsvDto.csvRows.length;
      this.updateParsedCsvDtos(parsedCsvDtoRowsLength, headersLength, parsedCsvDto, emptyValues);
    }
    this.setPage(1);
    
    this.loadUserDtoPagination();
    this.isListLoader = false;
  }

  private addEmptyToRows(rows: any, csvHeaders: any) {
    let diff = csvHeaders.length - rows.length;
    for (let i = 0; i < diff; i++) {
      rows.push("");
    }
  }

  /***** XNFR-671 *****/
  private loadUserDtoPagination() {
    const columnMappings = [
      { names: this.firstNames, index: 0 },
      { names: this.lastNames, index: 1 },
      { names: this.companies, index: 2 },
      { names: this.jobTitles, index: 3 },
      { names: this.emailIds, index: 4 },
      { names: this.addresses, index: 5 },
      { names: this.cities, index: 6 },
      { names: this.states, index: 7 },
      { names: this.zipCodes, index: 8 },
      { names: this.countries, index: 9 },
      { names: this.mobileNumbers, index: 10 },
      { names: this.contactStatus, index: 11 }
    ];

    for (let i = 0; i < this.customCsvHeaders.length; i++) {
      const headerColumn = this.customCsvHeaders[i].itemName.replace(/ /g, '').toLowerCase();
      // Check for standard column mappings
      for (const { names, index } of columnMappings) {
        if (names.some(name => headerColumn.includes(name.toLowerCase())) && this.defaultContactsCsvColumnHeaderDtos[index].mappedColumn.length == 0) {
          this.selectedMappedColumn(this.customCsvHeaders[i], this.defaultContactsCsvColumnHeaderDtos[index]);
          break; // Exit the loop once a match is found
        }
      }
      // Check for flexi fields
      const header = this.customCsvHeaders[i].itemName.toLowerCase();
      if (this.flexiFields.some(name => header.includes(name.toLowerCase()))) {
        this.defaultContactsCsvColumnHeaderDtos.forEach((dto) => {
          if (header == dto.defaultColumn.toLowerCase() && dto.mappedColumn.length == 0) {
            this.selectedMappedColumn(this.customCsvHeaders[i], dto);
          }
        });
      }
    }
    this.saveMappedColumns(false);
  }

  /***** XNFR-671 *****/
  private customUploadCsvHeaders() {
    this.flexiFieldsRequestAndResponseDto.forEach((flexiField => {
      this.xAmplifyDefaultCsvHeaders.push(flexiField.fieldName);
      this.flexiFields.push(flexiField.fieldName);
    }));
    this.xAmplifyDefaultCsvHeaders.forEach((header) => {
      const defaultContactsCsvColumnHeaderDto = new DefaultContactsCsvColumnHeaderDto();
      defaultContactsCsvColumnHeaderDto.defaultColumn = header;
      this.defaultContactsCsvColumnHeaderDtos.push(defaultContactsCsvColumnHeaderDto);
    });
  }

  /***** XNFR-671 *****/
  private addCsvHeadersToMultiSelectDropDown(headers: any, self: this) {
    let uploadCustomCsvHeader = {};
    uploadCustomCsvHeader['id'] = -1;
    uploadCustomCsvHeader['itemName'] = '-- Map a column --';
    this.uploadCustomCsvHeaders.push(uploadCustomCsvHeader);
    $.each(headers, function (index: number, header: any) {
      let updatedHeader = self.removeDoubleQuotes(header);
      if (updatedHeader.length > 0) {
        let customCsvHeader = {};
        customCsvHeader['id'] = index;
        customCsvHeader['itemName'] = updatedHeader;
        self.customCsvHeaders.push(customCsvHeader);
        self.uploadCustomCsvHeaders.push(customCsvHeader);
      } else {
        self.emptyHeadersIndex.push(index);
      }
    });
  }

  /***** XNFR-671 *****/
  private iterateDTOAndCsvRows(rows: any, i: number, self: this, parsedCsvDto: ParsedCsvDto) {
    rows = rows.filter((row, index) => !self.emptyHeadersIndex.includes(index));
    $.each(rows, function (index: number, value: any) {
      if (self.customCsvHeaders.length > index) {
        let csvRowDto = new CsvRowDto();
        let rowIndex = "R" + (index + 1);
        let columnIndex = "C" + i;
        let rowAndColumnIndex = rowIndex + ":" + columnIndex;
        csvRowDto.rowAndColumnInfo = rowAndColumnIndex;
        csvRowDto.value = $.trim(value);
        csvRowDto.columnHeader = $.trim(self.customCsvHeaders[index]['itemName']);
        parsedCsvDto.csvRows.push(csvRowDto);
      }
    });
  }

  /***** XNFR-671 *****/
  private updateParsedCsvDtos(parsedCsvDtoRowsLength: number, headersLength: number, parsedCsvDto: ParsedCsvDto, emptyValues: any[]) {
    if (parsedCsvDtoRowsLength == headersLength) {
      let csvRowsValues = parsedCsvDto.csvRows;
      $.each(csvRowsValues, function (index: number, csvRow: CsvRowDto) {
        let csvRowValue = csvRow.value;
        if (csvRowValue.length == 0) {
          emptyValues.push(csvRowValue);
        }
        let isEmptyRow = emptyValues.length == headersLength;
        parsedCsvDto.isEmptyRow = isEmptyRow;
      });
      if (!parsedCsvDto.isEmptyRow) {
        this.parsedCsvDtos.push(parsedCsvDto);
      }
    }
  }

  /***** XNFR-671 *****/
  openArrageHeadersModalPopUp() {
    console.log(this.xAmplifyDefaultCsvHeaders);
    console.log(this.customCsvHeaders);
    this.referenceService.scrollToModalBodyTopByClass();
    this.duplicateColumnsMappedErrorResponse = new CustomResponse();
    this.referenceService.openModalPopup("csv-column-mapping-modal-popup");
  }

  /***** XNFR-671 *****/
  expandRows(selectedFormDataRow: any, selectedIndex: number) {
    selectedFormDataRow.expanded = !selectedFormDataRow.expanded;
    if (selectedFormDataRow.expanded) {
      $('#csv-contacts-row-' + selectedIndex).css("background-color", "#d3d3d357");
    } else {
      $('#csv-contacts-row-' + selectedIndex).css("background-color", "#fff");
    }
  }

  /***** XNFR-671 *****/
  mapSelectedColumn(defaultContactsCsvColumnHeaderDto: DefaultContactsCsvColumnHeaderDto) {
    let mappedColumn = defaultContactsCsvColumnHeaderDto.mappedColumn;
    defaultContactsCsvColumnHeaderDto.isColumnMapped = this.referenceService.getTrimmedData(mappedColumn) != "";
    let mappedColumns = this.defaultContactsCsvColumnHeaderDtos.map(function (dto) { return dto.mappedColumn }).filter(function (v) { return v !== '' });
    this.duplicateMappedColumns = this.referenceService.findDuplicateArrayElements(mappedColumns);
    if (this.duplicateMappedColumns != undefined && this.duplicateMappedColumns.length > 0) {
      this.duplicateColumnsMappedErrorResponse = new CustomResponse('ERROR', this.properties.duplicateColumnsMappedErrorMessage, true);
    } else {
      this.duplicateColumnsMappedErrorResponse = new CustomResponse();
    }
  }

  /***** XNFR-671 *****/
  selectedMappedColumn(event: any, defaultContactsCsvColumnHeaderDto: DefaultContactsCsvColumnHeaderDto) {
    if (event['itemName'] == '-- Map a column --') {
      defaultContactsCsvColumnHeaderDto.mappedColumn = "";
    } else if (event != undefined) {
      defaultContactsCsvColumnHeaderDto.mappedColumn = event['itemName'];
    } else {
      defaultContactsCsvColumnHeaderDto.mappedColumn = "";
    }
    this.mapSelectedColumn(defaultContactsCsvColumnHeaderDto);
  }

  /***** XNFR-671 *****/
  saveMappedColumns(isSubmitButtonClicked: boolean) {
    this.mappingLoader = true;
    this.contacts = [];
    this.duplicateColumnsMappedErrorResponse = new CustomResponse();
    try {
      this.referenceService.scrollToModalBodyTopByClass();
      this.resetMappedRows();
      let filteredColumnHeaderDtos = this.defaultContactsCsvColumnHeaderDtos.filter(function (v) { return v.isColumnMapped; });
      if (filteredColumnHeaderDtos != undefined && filteredColumnHeaderDtos.length > 0) {
        let mappedColumns = this.defaultContactsCsvColumnHeaderDtos.map(function (dto) { return dto.mappedColumn }).filter(function (v) { return v !== '' });
        this.duplicateMappedColumns = this.referenceService.findDuplicateArrayElements(mappedColumns);
        let isDuplicateColumnsMapped = this.duplicateMappedColumns != undefined && this.duplicateMappedColumns.length > 0;
        if (!isDuplicateColumnsMapped) {
          let defaultColumns = filteredColumnHeaderDtos.map(function (dto) { return dto.defaultColumn }).filter(function (v) { return v !== '' });
          if (defaultColumns.indexOf(this.xAmplifyDefaultCsvHeaders[4]) > -1) {
            this.iterateDtoAndAddMappedRows(filteredColumnHeaderDtos);
            let firstNameRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[0]);
            let lastNameRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[1]);
            let companyRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[2]);
            let jobTitleRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[3])
            let emailIdRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[4]);
            let addressRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[5]);
            let cityRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[6]);
            let stateRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[7]);
            let zipCodeRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[8]);
            let countryRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[9]);
            let mobileNumberRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[10]);
            let contactStatusRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[11]);
            let flexiFieldRows = this.getMappedFlexiFields(filteredColumnHeaderDtos);
            let rowsLength = 0;
            if (emailIdRows != undefined) {
              rowsLength = emailIdRows[0].length;
            } else {
              rowsLength = 0;
            }
            this.iterateAndAddToUsers(rowsLength, firstNameRows, lastNameRows, companyRows, jobTitleRows,
              emailIdRows, addressRows, cityRows, stateRows, zipCodeRows, countryRows, mobileNumberRows, contactStatusRows, flexiFieldRows, this.contacts);
            let invalidEmailIds = this.contacts.filter(function (contact) {
              return contact.isValidEmailIdPattern == false
            }).map(function (dto) {
              return dto.isValidEmailIdPattern
            });
            this.isValidEmailAddressMapped = invalidEmailIds != undefined && invalidEmailIds.length == 0;
            this.paginationType = "csvContacts";
            this.setPage(1);
            this.isColumnMapped = true;
            if(isSubmitButtonClicked) {
              this.referenceService.closeModalPopup("csv-column-mapping-modal-popup");
            }
            this.notifyParent.emit(this.contacts);
          } else {
            this.duplicateColumnsMappedErrorResponse = new CustomResponse('ERROR', this.properties.emailAddressMandatoryMessage, true);
          }
        } else {
          this.duplicateColumnsMappedErrorResponse = new CustomResponse('ERROR', this.properties.duplicateColumnsMappedErrorMessage, true);
        }
      } else {
        this.duplicateColumnsMappedErrorResponse = new CustomResponse('ERROR', this.properties.emailAddressMandatoryMessage, true);
      }
      this.mappingLoader = false;
    } catch (error) {
      this.mappingLoader = false;
      this.duplicateColumnsMappedErrorResponse = new CustomResponse('ERROR', 'Unable to map columns.Please try after sometime.', true);
    }
  }

  /***** XNFR-671 *****/
  private getMappedFlexiFields(filteredColumnHeaderDtos: DefaultContactsCsvColumnHeaderDto[]) {
    let flexiFieldRows = [];
    for (let i = 12; i < this.xAmplifyDefaultCsvHeaders.length; i++) {
      let mappedRows = this.getMappedRows(filteredColumnHeaderDtos, this.xAmplifyDefaultCsvHeaders[i]);
      flexiFieldRows.push({
        headerColumn: this.xAmplifyDefaultCsvHeaders[i],
        value: mappedRows
      });
    }
    return flexiFieldRows;
  }

  /***** XNFR-671 *****/
  private resetMappedRows() {
    $.each(this.defaultContactsCsvColumnHeaderDtos, function (_index: number, dto: DefaultContactsCsvColumnHeaderDto) {
      dto.mappedRows = [];
    });
  }

  /***** XNFR-671 *****/
  resetMappedColumns() {
    this.isListLoader = true;
    this.duplicateColumnsMappedErrorResponse = new CustomResponse();
    this.mappingLoader = true;
    this.isResetButtonClicked = false;
    setTimeout(() => {
      try {
        $.each(this.defaultContactsCsvColumnHeaderDtos, function (_index: number, dto: DefaultContactsCsvColumnHeaderDto) {
          dto.mappedColumn = "";
          dto.selectedItems = [];
          dto.isColumnMapped = false;
          dto.mappedRows = [];
        });
        this.isResetButtonClicked = true;
        this.isColumnMapped = false;
        this.paginationType = "customCsvContacts";
        this.setPage(1);
        this.contacts = [];
        this.notifyParent.emit(this.contacts);
        this.loadUserDtoPagination();
        this.isListLoader = false;
        this.mappingLoader = false;
      } catch (error) {
        this.isListLoader = false;
        this.mappingLoader = false;
        this.xtremandLogger.error(error);
      }
    }, 100);
  }

  /***** XNFR-671 *****/
  private iterateAndAddToUsers(rowsLength: number, firstNameRows: any[][], lastNameRows: any[][], companyRows: any[][], jobTitleRows: any[][],
    emailIdRows: any[][], addressRows: any[][], cityRows: any[][], stateRows: any[][], zipCodeRows: any[][], countryRows: any[][], mobileNumberRows: any[][],
    contactStatusRows: any[][], flexiFieldRows: any[][], mappedContactUsers: User[]) {
    for (var i = 0; i < rowsLength; i++) {
      let user = new User();
      /***First Name****/
      this.addFirstNames(firstNameRows, user, i);
      /***Last Name****/
      this.addLastNames(lastNameRows, user, i);
      /***Company****/
      this.addCompanyNames(companyRows, user, i);
      /***Job Title****/
      this.addJobTitles(jobTitleRows, user, i);
      /***Email Id****/
      this.setEmailAddress(emailIdRows, user, i);
      /***Address****/
      this.addAddress(addressRows, user, i);
      /**City****/
      this.addCities(cityRows, user, i);
      /**State****/
      this.addStates(stateRows, user, i);
      /**Zip Code****/
      this.addZipCodes(zipCodeRows, user, i);
      /**Country****/
      this.addCountries(countryRows, user, i);
      /**Mobile Number****/
      this.addMobileNumbers(mobileNumberRows, user, i);
      /***Territory***/
      this.addTerritory(user, i);
      /*** Contact Status***/
      this.addContactStatus(contactStatusRows, user, i);
      /****Flexi-Fields****/
      this.addFlexiFields(flexiFieldRows, user, i);
      user.id = this.rowIndices[i];
      mappedContactUsers.push(user);
    }
  }

  /***** XNFR-671 *****/
  private addFlexiFields(flexiFieldRows: any[][], user: User, i: number) {
    if (flexiFieldRows != undefined && flexiFieldRows.length > 0) {
      this.flexiFieldsRequestAndResponseDto.forEach((flexiField) => {
        let flexiFieldsData = new FlexiFieldsRequestAndResponseDto;
        flexiFieldsData.id = flexiField.id;
        flexiFieldsData.fieldName = flexiField.fieldName;
        flexiFieldRows.forEach((mappedFlexiFields) => {
          if (flexiField.fieldName == this.removeDoubleQuotes(mappedFlexiFields['headerColumn'])) {
            let mappedFlexiFieldValues = mappedFlexiFields['value'];
            if (mappedFlexiFieldValues != undefined && mappedFlexiFieldValues.length > 0) {
              flexiFieldsData.fieldValue = this.capitalizeFirstLetter(mappedFlexiFieldValues[0][i]);
            }
          }
        });
        user.flexiFields.push(flexiFieldsData);
      });
    }
  }

  private addContactStatus(contactStatusRows: any[][], user: User, i: number) {
    if (contactStatusRows != undefined && contactStatusRows.length > 0) {
      let contactStatus = contactStatusRows[0];
      user.contactStatus = contactStatus[i];
    }
  }

  private addTerritory(user: User, i: number) {
    user.territory = this.countryNames.countries[0];
  }

  /***** XNFR-671 *****/
  private addMobileNumbers(mobileNumberRows: any[][], user: User, i: number) {
    if (mobileNumberRows != undefined && mobileNumberRows.length > 0) {
      let mobileNumbers = mobileNumberRows[0];
      user.mobileNumber = mobileNumbers[i];
    }
  }

  /***** XNFR-671 *****/
  private addCountries(countryRows: any[][], user: User, i: number) {
    if (countryRows != undefined && countryRows.length > 0) {
      let countries = countryRows[0];
      user.country = this.capitalizeFirstLetter(countries[i]);
    }
  }

  /***** XNFR-671 *****/
  private addZipCodes(zipCodeRows: any[][], user: User, i: number) {
    if (zipCodeRows != undefined && zipCodeRows.length > 0) {
      let zipCodes = zipCodeRows[0];
      user.zipCode = zipCodes[i];
    }
  }

  /***** XNFR-671 *****/
  private addStates(stateRows: any[][], user: User, i: number) {
    if (stateRows != undefined && stateRows.length > 0) {
      let states = stateRows[0];
      user.state = this.capitalizeFirstLetter(states[i]);
    }
  }

  /***** XNFR-671 *****/
  private addCities(cityRows: any[][], user: User, i: number) {
    if (cityRows != undefined && cityRows.length > 0) {
      let cities = cityRows[0];
      user.city = this.capitalizeFirstLetter(cities[i]);
    }
  }

  /***** XNFR-671 *****/
  private addJobTitles(jobTitleRows: any[][], user: User, i: number) {
    if (jobTitleRows != undefined && jobTitleRows.length > 0) {
      let jobTitles = jobTitleRows[0];
      user.jobTitle = this.capitalizeFirstLetter(jobTitles[i]);
    }
  }

  /***** XNFR-671 *****/
  private addAddress(jobTitleRows: any[][], user: User, i: number) {
    if (jobTitleRows != undefined && jobTitleRows.length > 0) {
      let jobTitles = jobTitleRows[0];
      user.address = this.capitalizeFirstLetter(jobTitles[i]);
    }
  }

  /***** XNFR-671 *****/
  private setEmailAddress(emailIdRows: any[][], user: User, i: number) {
    if (emailIdRows != undefined && emailIdRows.length > 0) {
      let emailIds = emailIdRows[0];
      let emailId = emailIds[i];
      user.emailId = emailId;
      if (emailId != undefined && $.trim(emailId).length > 0) {
        user.isValidEmailIdPattern = this.validateEmail(emailId);
      }
    }
  }

  /***** XNFR-671 *****/
  private addCompanyNames(companyRows: any[][], user: User, i: number) {
    if (companyRows != undefined && companyRows.length > 0) {
      let companyNames = companyRows[0];
      user.contactCompany = this.capitalizeFirstLetter(companyNames[i]);
    }
  }

  /***** XNFR-671 *****/
  private addLastNames(lastNameRows: any[][], user: User, i: number) {
    if (lastNameRows != undefined && lastNameRows.length > 0) {
      let lastNames = lastNameRows[0];
      user.lastName = this.capitalizeFirstLetter(lastNames[i]);
    }
  }

  /***** XNFR-671 *****/
  private addFirstNames(firstNameRows: any[][], user: User, i: number) {
    if (firstNameRows != undefined && firstNameRows.length > 0) {
      let firstNames = firstNameRows[0];
      user.firstName = this.capitalizeFirstLetter(firstNames[i]);
    }
  }

  /***** XNFR-671 *****/
  private getMappedRows(filteredColumnHeaderDtos: DefaultContactsCsvColumnHeaderDto[], headerColumn: string) {
    return filteredColumnHeaderDtos.filter(function (x) {
      return x != undefined && x.defaultColumn == headerColumn;
    }).map(function (dto) {
      return dto != undefined && dto.mappedRows;
    });
  }

  /***** XNFR-671 *****/
  private iterateDtoAndAddMappedRows(filteredColumnHeaderDtos: DefaultContactsCsvColumnHeaderDto[]) {
    this.rowIndices = [];
    const rowsToMap = this.parsedCsvDtos.filter(dto => !this.removedContactIds.has(dto.rowIndex));
    for (const dto of filteredColumnHeaderDtos) {
      for (const parsed of rowsToMap) {
        for (const csvRow of parsed.csvRows) {
          if (csvRow.columnHeader === dto.mappedColumn) {
            dto.mappedRows.push(csvRow.value);
          }
        }
      }
    }
    this.rowIndices = rowsToMap.map(r => r.rowIndex);
  }

  /***** XNFR-671 *****/
  private resetCustomUploadCsvFields() {
    this.parsedCsvDtos = [];
    this.defaultContactsCsvColumnHeaderDtos = [];
    this.customCsvHeaders = [];
    this.duplicateMappedColumns = [];
    this.duplicateColumnsMappedErrorResponse = new CustomResponse();
    this.isListLoader = false;
    this.mappingLoader = false;
    this.isResetButtonClicked = false;
    this.isColumnMapped = false;
    this.contacts = [];
    this.isValidEmailAddressMapped = false;
    this.flexiFields = [];
    this.validUsersCount = 0;
    this.inValidUsersCount = 0;
    this.emptyUsersCount = 0;
    this.selectedOption = "";
    this.csvContacts = [];
    this.invalidUsers = [];
    this.invalidPatternEmails = [];
    this.removedContactIds = new Set();
    this.csvCustomResponse = new CustomResponse();
    this.referenceService.goToTop();
  }

  /***** XNFR-671 *****/
  validateEmailAddressPattern(user: User) {
    user.isValidEmailIdPattern = this.validateEmail(user.emailId);
    this.showSuccessMessage();
  }

  /***** XNFR-671 *****/
  removeContact(user: User) {
    this.isListLoader = true;
    this.removedContactIds.add(user.id);
    this.contacts = this.contacts.filter((contact) => contact.id != user.id);
    const totalContacts = this.contacts.length;
    const totalPages = Math.ceil(totalContacts / 12);
    if (this.pager.currentPage > totalPages) {
      this.setPage(totalPages);
    } else{
      this.setPage(this.pager.currentPage);
    }
    let emailAddress = this.contacts.map(function (contact) { return contact.emailId });
    console.log(emailAddress);
    this.showSuccessMessage();
    this.cancelContacts();
    this.isListLoader = false;
  }

  /***** XNFR-671 *****/
  showSuccessMessage() {
    if (this.contacts.every(contact => contact.isValidEmailIdPattern)) {
      this.isValidEmailAddressMapped = true;
    } else {
      this.isValidEmailAddressMapped = false;
    }
  }

  /***** XNFR-671 *****/
  cancelContacts() {
    if (this.contacts.length == 0) {
      this.resetCustomUploadCsvFields();
      this.notifyParentCancel.emit();
    } else {
      this.notifyParent.emit(this.contacts);
    }
  }

  setPage(page: number) {
    if (this.paginationType == "csvContacts") {
      this.pager = this.socialPagerService.getPager(this.contacts.length, page, XAMPLIFY_CONSTANTS.pageSize);
      this.pagedItems = this.contacts.slice(this.pager.startIndex, this.pager.endIndex + 1);
    } else if (this.paginationType == "customCsvContacts") {
      this.pager = this.socialPagerService.getPager(this.parsedCsvDtos.length, page, XAMPLIFY_CONSTANTS.pageSize);
      this.pagedItems = this.parsedCsvDtos.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  }

  setInvalidUsersPage(page: number) {
    this.csvPager = this.socialPagerService.getPager(this.invalidUsers.length, page, XAMPLIFY_CONSTANTS.pageSize);
    this.csvPagedItems = this.invalidUsers.slice(this.csvPager.startIndex, this.csvPager.endIndex + 1);
  }

  removeDoubleQuotes(input: string) {
    if (input != undefined) {
      return input.trim().replace('"', '').replace('"', '');
    } else {
      return "";
    }
  }

  removeEmptyEmailIdsFromContactsDto() {
    this.contacts = this.contacts.filter(user => user.emailId.length > 0);
  }

  /***** XNFR-718 *****/
  saveCustomUploadCsvContactList() {
    const emailCounts = this.contacts.reduce((acc, user) => {
      if (user.emailId.length == 0) {
        acc.empty++;
      } else if (this.validateEmail(user.emailId)) {
        acc.valid++;
      } else {
        acc.invalid++;
      }
      return acc;
    }, { valid: 0, invalid: 0, empty: 0 });
    this.validUsersCount = emailCounts.valid;
    this.inValidUsersCount = emailCounts.invalid;
    this.emptyUsersCount = emailCounts.empty;
    if (this.contacts.length == this.validUsersCount) {
      this.notifyParent.emit(this.contacts);
      this.notifyParentSave.emit();
    } else {
      this.referenceService.openModalPopup("Custom_Csv_Modal_Popup");
    }
  }

  /***** XNFR-718 *****/
  CloseCustomCsvModelPopup() {
    this.selectedOption = "";
    this.referenceService.closeModalPopup("Custom_Csv_Modal_Popup");
  }

  /***** XNFR-718 *****/
  saveCustomCsvContacts() {
    this.csvContacts = this.contacts.filter(user => this.validateEmail(user.emailId));
    this.CloseCustomCsvModelPopup();
    if (this.csvContacts.length == 0) {
      this.notifyParentCustomResponse.emit();
    } else {
      this.contacts = this.contacts.filter(user => this.validateEmail(user.emailId));
      this.notifyParent.emit(this.contacts);
      this.notifyParentSave.emit();
    }
  }

  /***** XNFR-718 *****/
  updateCustomCsvContacts() {
    let self = this;
    this.invalidUsers = [];
    this.mappingLoader = true;
    $.each(self.contacts, function (index: number, user: any) {
      if (!user.isValidEmailIdPattern) {
        let invalidUser = new User();
        invalidUser.id = user.id;
        invalidUser.emailId = user.emailId;
        invalidUser.isValidEmailIdPattern = user.isValidEmailIdPattern;
        self.invalidUsers.push(invalidUser);
      }
    });
    this.invalidUsers = this.invalidUsers.filter(user => user.emailId.length > 0);
    this.inValidUsersCount = this.invalidUsers.length;
    this.setInvalidUsersPage(1);
    this.CloseCustomCsvModelPopup();
    this.referenceService.openModalPopup("invalid_Users_Model_Popup");
    this.mappingLoader = false;
  }

  /***** XNFR-718 *****/
  closeInvalidUsersModalPopup() {
    this.invalidUsers = [];
    this.selectedOption = "";
    this.csvCustomResponse = new CustomResponse();
    this.referenceService.closeModalPopup("invalid_Users_Model_Popup");
  }

  /***** XNFR-718 *****/
  saveInvalidUsers() {
    let self = this;
    this.isListLoader = true;
    this.mappingLoader = true;
    $.each(self.invalidUsers, function (index: number, invalidUser: any) {
      if (!invalidUser.isValidEmailIdPattern) {
        self.invalidPatternEmails.push(invalidUser.emailId);
      }
    });

    if (this.invalidPatternEmails.length == 0) {
      $.each(self.contacts, function (index: number, user: any) {
        $.each(self.invalidUsers, function (id: number, invalidUser: any) {
          if (user.id == invalidUser.id) {
            user.emailId = invalidUser.emailId;
            user.isValidEmailIdPattern = invalidUser.isValidEmailIdPattern;
          }
        });
      });
      this.removeEmptyEmailIdsFromContactsDto();
      this.setPage(1);
      this.notifyParent.emit(this.contacts);
      this.closeInvalidUsersModalPopup();
      this.showSuccessMessage();
    } else {
      this.csvCustomResponse = new CustomResponse('ERROR', "We found invalid email id(s) please remove... " + this.invalidPatternEmails, true);
      this.invalidPatternEmails = [];
    }
    this.isListLoader = false;
    this.mappingLoader = false;
  }

  /***** XNFR-718 *****/
  removeInvalidUser(user: User) {
    this.isListLoader = true;
    this.mappingLoader = true;
    this.removedContactIds.add(user.id);
    this.contacts = this.contacts.filter((contact) => contact.id != user.id);
    this.invalidUsers = this.invalidUsers.filter((contact) => contact.id != user.id);
    const totalContacts = this.invalidUsers.length;
    const totalPages = Math.ceil(totalContacts / 12);
    if (this.csvPager.currentPage > totalPages) {
      this.setInvalidUsersPage(totalPages);
    } else{
      this.setInvalidUsersPage(this.csvPager.currentPage);
    }
    this.setPage(1);
    this.showSuccessMessage();
    if (this.contacts.length == 0) {
      this.closeInvalidUsersModalPopup();
    }
    this.cancelContacts();
    this.isListLoader = false;
    this.mappingLoader = false;
  }

  /***** XNFR-772 *****/
  validateZipCode(inputString: string): boolean {
    const regex = /^[^0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
    return inputString && (regex.test(inputString) || inputString.length > 10);
  }

  /***** XNFR-772 *****/
  validateMobileNumber(inputString: string): boolean {
    return inputString && (!/^\d+$/.test(inputString) || inputString.length > 20);
  }

  /***** XNFR-772 *****/
  validateEmail(inputString: string): boolean {
    return this.regularExpressions.EMAIL_ID_PATTERN.test(inputString);
  }

  /***** XNFR-772 *****/
  dropDownCountryValue(user: User, event: any) {
    user.country = event == 'Select Country' ? "" : event;
  }

  /***** XNFR-772 *****/
  capitalizeFirstLetter(inputString: string) {
    return inputString ? inputString.charAt(0).toUpperCase() + inputString.slice(1) : inputString;
  }

  /***** XNFR-775 *****/
  allowNumericAndSpecial(event: KeyboardEvent): boolean {
    const charCode = event.charCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    const allowedSpecialChars = [32, 33, 35, 36, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126];
    if (allowedSpecialChars.includes(charCode)) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  /***** XNFR-762 *****/
  mobileNumberEventEmitter(event: any, user: User) {
    user.mobileNumber = event.mobileNumber;
    user.countryCode = event.selectedCountry.code;
    user.isValidMobileNumber = event.isValidMobileNumber;
    this.cdr.detectChanges();
  }

  findContactStatusStages() {
    this.isListLoader = true;
    this.contactStatusStages = [];
    this.contactService.findContactStatusStages().subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.contactStatusStages = response.data;
          this.contactStatusStages.unshift({ id: null, stageName: 'Select Contact Status' });
        }
        this.isListLoader = false;
      }, (error: any) => {
        this.isListLoader = false;
        console.error('Error occured in findContactStatusStages()' + error);
      });
  }

  isContactStatusPresent(user: User): boolean {
    return this.contactStatusStages.some(stage => stage.stageName === user.contactStatus);
  }

  onContactStatusChange(status: any, user: User) {
    const isInvalidStatus = !status || status.stageName === 'Select Contact Status';

    if (isInvalidStatus) {
      user.contactStatusId = null;
      user.contactStatus = '';
    } else {
      user.contactStatusId = status.id;
      user.contactStatus = status.stageName;
    }
  }

  updateContactStatus(user: User) {
    if (!this.isContactStatusPresent(user)) return;

    const selectedStatus = this.contactStatusStages.find(
      status => status.stageName === user.contactStatus
    );

    if (selectedStatus) {
      this.onContactStatusChange(selectedStatus, user);
      user.userStatus = selectedStatus;
    }
  }

}
