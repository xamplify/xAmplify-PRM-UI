import { CsvRowDto } from "./csv-row-dto";

export class ParsedCsvDto {
    expanded = false;
    csvRows:Array<CsvRowDto> = new Array<CsvRowDto>();
}
