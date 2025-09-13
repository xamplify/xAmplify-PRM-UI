import { CsvRowDto } from "./csv-row-dto";

export class ParsedCsvDto {
    rowIndex: number; 
    expanded = false;
    csvRows:Array<CsvRowDto> = new Array<CsvRowDto>();
    isEmptyRow = false;
}
