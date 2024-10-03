import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
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

declare var swal: any, $: any;

@Component({
  selector: 'app-custom-csv-mapping',
  templateUrl: './custom-csv-mapping.component.html',
  styleUrls: ['./custom-csv-mapping.component.css'],
})
export class CustomCsvMappingComponent implements OnInit, OnDestroy {
  @Input() csvRows: any[];
  @Input() flexiFieldsRequestAndResponseDto: Array<FlexiFieldsRequestAndResponseDto>;
  @Input() isXamplifyCsvFormatUploaded: boolean = false;
  @Output() notifyParent: EventEmitter<any>;

  /***** XNFR-671 *****/
  xAmplifyDefaultCsvHeaders = ['First Name', 'Last Name', 'Company', 'Job Title', 'Email Id', 'Address', 'City', 'State', 'Zip Code', 'Country', 'Mobile Number'];
  pager: any = {};
  pagedItems: any[];
  contacts: User[];
  isListLoader: boolean = false;
  mappingLoader: boolean = false;
  isResetButtonClicked: boolean = false;
  isColumnMapped: boolean = false;
  isValidEmailAddressMapped: boolean = false;
  customCsvHeaders: any[];
  duplicateMappedColumns = [];
  paginationType = '';
  parsedCsvDtos: Array<ParsedCsvDto> = new Array<ParsedCsvDto>();
  defaultContactsCsvColumnHeaderDtos: Array<DefaultContactsCsvColumnHeaderDto> = new Array<DefaultContactsCsvColumnHeaderDto>();
  duplicateColumnsMappedErrorResponse: CustomResponse = new CustomResponse();
  /***** XNFR-671 *****/

  constructor(public socialPagerService: SocialPagerService, public referenceService: ReferenceService, public properties: Properties,
    public xtremandLogger: XtremandLogger) { this.notifyParent = new EventEmitter(); }

  ngOnInit() {
    this.loadParsedCsvDtoPagination();
  }

  ngOnDestroy() {
    this.resetCustomUploadCsvFields();
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
    this.addFlexiFieldsToDefaultCsvHeaders();
    this.customUploadCsvHeaders();
    this.addCsvHeadersToMultiSelectDropDown(csvHeaders, self);
    const headersLength = this.customCsvHeaders.length;
    for (var i = 1; i < this.csvRows.length; i++) {
      let rows = this.csvRows[i];
      this.addEmptyToRows(rows, csvHeaders);
      let parsedCsvDto = new ParsedCsvDto();
      parsedCsvDto.expanded = false;
      let emptyValues = [];
      this.iterateDTOAndCsvRows(rows, i, self, parsedCsvDto);
      let parsedCsvDtoRowsLength = parsedCsvDto.csvRows.length;
      this.updateParsedCsvDtos(parsedCsvDtoRowsLength, headersLength, parsedCsvDto, emptyValues);
    }
    this.setPage(1);
    
    if (this.isXamplifyCsvFormatUploaded) {
      this.loadUserDtoPagination();
    }
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
    for (let i = 0; i < this.customCsvHeaders.length; i++) {
      this.selectedMappedColumn(this.customCsvHeaders[i], this.defaultContactsCsvColumnHeaderDtos[i]);
    }
    this.saveMappedColumns();
  }

  /***** XNFR-671 *****/
  private addFlexiFieldsToDefaultCsvHeaders() {
    this.flexiFieldsRequestAndResponseDto.forEach((flexiField => {
      this.xAmplifyDefaultCsvHeaders.push(flexiField.fieldName);
    }));
  }

  /***** XNFR-671 *****/
  private customUploadCsvHeaders() {
    this.xAmplifyDefaultCsvHeaders.forEach((header) => {
      const defaultContactsCsvColumnHeaderDto = new DefaultContactsCsvColumnHeaderDto();
      defaultContactsCsvColumnHeaderDto.defaultColumn = header;
      this.defaultContactsCsvColumnHeaderDtos.push(defaultContactsCsvColumnHeaderDto);
    });
  }

  /***** XNFR-671 *****/
  private addCsvHeadersToMultiSelectDropDown(headers: any, self: this) {
    $.each(headers, function (index: number, header: any) {
      let updatedHeader = self.removeDoubleQuotes(header);
      let customCsvHeader = {};
      customCsvHeader['id'] = index;
      customCsvHeader['itemName'] = updatedHeader;
      self.customCsvHeaders.push(customCsvHeader);
    });
  }

  /***** XNFR-671 *****/
  private iterateDTOAndCsvRows(rows: any, i: number, self: this, parsedCsvDto: ParsedCsvDto) {
    $.each(rows, function (index: number, value: any) {
      let csvRowDto = new CsvRowDto();
      let rowIndex = "R" + (index + 1);
      let columnIndex = "C" + i;
      let rowAndColumnIndex = rowIndex + ":" + columnIndex;
      csvRowDto.rowAndColumnInfo = rowAndColumnIndex;
      csvRowDto.value = $.trim(value);
      csvRowDto.columnHeader = $.trim(self.customCsvHeaders[index]['itemName']);
      parsedCsvDto.csvRows.push(csvRowDto);
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
    if (event != undefined) {
      defaultContactsCsvColumnHeaderDto.mappedColumn = event['itemName'];
    } else {
      defaultContactsCsvColumnHeaderDto.mappedColumn = "";
    }
    this.mapSelectedColumn(defaultContactsCsvColumnHeaderDto);
  }

  /***** XNFR-671 *****/
  saveMappedColumns() {
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
            let self = this.iterateDtoAndAddMappedRows(filteredColumnHeaderDtos);
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
            let flexiFieldRows = this.getMappedFlexiFields(filteredColumnHeaderDtos);
            let rowsLength = 0;
            if (emailIdRows != undefined) {
              rowsLength = emailIdRows[0].length;
            } else {
              rowsLength = 0;
            }
            this.iterateAndAddToUsers(rowsLength, firstNameRows, lastNameRows, companyRows, jobTitleRows,
              emailIdRows, addressRows, cityRows, stateRows, zipCodeRows, countryRows, mobileNumberRows, flexiFieldRows, this.contacts);
            let invalidEmailIds = this.contacts.filter(function (contact) {
              return contact.isValidEmailIdPattern == false
            }).map(function (dto) {
              return dto.isValidEmailIdPattern
            });
            this.isValidEmailAddressMapped = invalidEmailIds != undefined && invalidEmailIds.length == 0;
            this.paginationType = "csvContacts";
            self.setPage(1);
            this.isColumnMapped = true;
            this.referenceService.closeModalPopup("csv-column-mapping-modal-popup");
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
    for (let i = 11; i < this.xAmplifyDefaultCsvHeaders.length; i++) {
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
        this.mappingLoader = false;
        this.paginationType = "customCsvContacts";
        this.setPage(1);
        this.contacts = [];
        this.notifyParent.emit(this.contacts);
        this.isListLoader = false;
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
    flexiFieldRows: any[][], mappedContactUsers: User[]) {
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
      /****Flexi-Fields****/
      this.addFlexiFields(flexiFieldRows, user, i);
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
              flexiFieldsData.fieldValue = mappedFlexiFieldValues[0][i];
            }
          }
        });
        user.flexiFields.push(flexiFieldsData);
      });
    }
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
      user.country = countries[i];
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
      user.state = states[i];
    }
  }

  /***** XNFR-671 *****/
  private addCities(cityRows: any[][], user: User, i: number) {
    if (cityRows != undefined && cityRows.length > 0) {
      let cities = cityRows[0];
      user.city = cities[i];
    }
  }

  /***** XNFR-671 *****/
  private addJobTitles(jobTitleRows: any[][], user: User, i: number) {
    if (jobTitleRows != undefined && jobTitleRows.length > 0) {
      let jobTitles = jobTitleRows[0];
      user.jobTitle = jobTitles[i];
    }
  }

  /***** XNFR-671 *****/
  private addAddress(jobTitleRows: any[][], user: User, i: number) {
    if (jobTitleRows != undefined && jobTitleRows.length > 0) {
      let jobTitles = jobTitleRows[0];
      user.address = jobTitles[i];
    }
  }

  /***** XNFR-671 *****/
  private setEmailAddress(emailIdRows: any[][], user: User, i: number) {
    if (emailIdRows != undefined && emailIdRows.length > 0) {
      let emailIds = emailIdRows[0];
      let emailId = emailIds[i];
      user.emailId = emailId;
      if (emailId != undefined && $.trim(emailId).length > 0) {
        user.isValidEmailIdPattern = this.referenceService.validateEmailId(emailId);
      }
    }
  }

  /***** XNFR-671 *****/
  private addCompanyNames(companyRows: any[][], user: User, i: number) {
    if (companyRows != undefined && companyRows.length > 0) {
      let companyNames = companyRows[0];
      user.companyName = companyNames[i];
    }
  }

  /***** XNFR-671 *****/
  private addLastNames(lastNameRows: any[][], user: User, i: number) {
    if (lastNameRows != undefined && lastNameRows.length > 0) {
      let lastNames = lastNameRows[0];
      user.lastName = lastNames[i];
    }
  }

  /***** XNFR-671 *****/
  private addFirstNames(firstNameRows: any[][], user: User, i: number) {
    if (firstNameRows != undefined && firstNameRows.length > 0) {
      let firstNames = firstNameRows[0];
      user.firstName = firstNames[i];
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
    let self = this;
    $.each(filteredColumnHeaderDtos, function (index: number, dto: DefaultContactsCsvColumnHeaderDto) {
      let mappedColumn = dto.mappedColumn;
      $.each(self.parsedCsvDtos, function (parsedCsvDtoIndex: number, parsedCsvDto: ParsedCsvDto) {
        let csvRows = parsedCsvDto.csvRows;
        $.each(csvRows, function (csvRowIndex: number, csvRowDto: CsvRowDto) {
          let column = csvRowDto.columnHeader;
          if (column == mappedColumn) {
            dto.mappedRows.push(csvRowDto.value);
          }
        });
      });
    });
    return self;
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
    this.referenceService.goToTop();
  }

  /***** XNFR-671 *****/
  validateEmailAddressPattern(user: User) {
    user.isValidEmailIdPattern = this.referenceService.validateEmailId(user.emailId);
  }

  /***** XNFR-671 *****/
  removeContact(index: number) {
    this.contacts = this.referenceService.removeArrayItemByIndex(this.contacts, index);
    $('#mapped-csv-column-row' + index).remove();
    $('#expanded-table-row' + index).remove();
    let emailAddress = this.contacts.map(function (contact) { return contact.emailId });
    console.log(emailAddress);
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

  removeDoubleQuotes(input: string) {
    if (input != undefined) {
      return input.trim().replace('"', '').replace('"', '');
    } else {
      return "";
    }
  }

}
