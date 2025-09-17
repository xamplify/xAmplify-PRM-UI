import { CsvDto } from 'app/core/models/csv-dto';
import { Injectable } from '@angular/core';
import { ReferenceService } from '../services/reference.service';
declare var $:any;
@Injectable()
export class FileUtil {

    csvDto:CsvDto = new CsvDto();
    constructor(private referenceService:ReferenceService) {}

    isCSVFile(file) {
        return file.name.endsWith(".csv");
    }

    getHeaderArray(csvRecordsArr) {
        let headers = csvRecordsArr[0].split(';');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    validateHeaders(origHeaders, fileHeaaders) {
        if (origHeaders.length != fileHeaaders.length) {
            return false;
        }

        var fileHeaderMatchFlag = true;
        for (let j = 0; j < origHeaders.length; j++) {
            if (origHeaders[j] != fileHeaaders[j]) {
                fileHeaderMatchFlag = false;
                break;
            }
        }
        return fileHeaderMatchFlag;
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray, headerLength) {
        var dataArr = []
        for (let i = 0; i < csvRecordsArray.length-1; i++) {
            let data = csvRecordsArray[i].split(';');
            if (data.length == headerLength) {
                let col = [];
                for (let j = 0; j < data.length; j++) {
                    col.push(data[j]);
                }
                dataArr.push(col);
            }else{
                return null;
            }
        }
        return dataArr;
    }

    readCsv(event:any,moduleName:string){
        let csvDto = new CsvDto();
        csvDto.moduleName = moduleName;
        var files = event.srcElement.files;
        if(this.isCSVFile(files[0])){
            var input = event.target;
            var reader = new FileReader();
            reader.readAsText(input.files[0]);
            reader.onload = (data) => {
                let csvData = reader.result;
                let csvRecordsArray = csvData['split'](/\r\n|\n/);
                let headersRow = this.getHeaderArray(csvRecordsArray);
                let headers = headersRow[0].split(',');
                if (this.validateCsvHeader(headers,csvDto.moduleName)) {
                   csvDto.csvRecords = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
                  if (csvDto.csvRecords.length > 1) {
                    this.validateCsvData(csvDto);
                  } else {
                    csvDto.isCsvError = true;
                    csvDto.csvErrorMessage = 'You Cannot Upload Empty File';
                  }
                } else {
                    csvDto.isCsvError = true;
                    csvDto.csvErrorMessage = 'Invalid Csv';
                    this.csvDto = csvDto;
                    console.log(this.csvDto.isCsvError);

                }
              }
        }else{
            csvDto.isCsvError = true;
            csvDto.csvErrorMessage = "Please Import csv file only";
        }
        return csvDto;
       
    }
    validateCsvHeader(headers: any, moduleName: string) {
        if("agency"==moduleName){
            return (headers[0] == "Email Id" && headers[1] == "First Name" && headers[2] == "Last Name" && headers[2] == "Company Name");
        }
        
    }

    validateCsvData(csvDto:CsvDto) {
        let csvRecords = csvDto.csvRecords;
        let names = csvRecords.map(function (a) { return a[0].split(',')[0].toLowerCase() });
        let duplicateEmailIds = this.referenceService.returnDuplicates(names);
        if (duplicateEmailIds.length == 0) {
          for (var i = 1; i < csvRecords.length; i++) {
            let rows = csvRecords[i];
            let row = rows[0].split(',');
            let emailId = row[0];
            if (emailId != undefined && $.trim(emailId).length > 0) {
              if (!this.referenceService.validateEmailId(emailId)) {
                csvDto.csvErrors.push(emailId + " is invalid email address.");
              }
            }
          }
        } else {
          for (let d = 0; d < duplicateEmailIds.length; d++) {
            let emailId = duplicateEmailIds[d];
            if (emailId != undefined && $.trim(emailId).length > 0) {
                csvDto.csvErrors.push(duplicateEmailIds[d] + " is duplicate email address.");
            }
          }
        }
      }

}
