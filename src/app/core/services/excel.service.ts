import {Injectable} from '@angular/core';
import {utils, WorkBook, writeFile} from 'xlsx';
import {ApiBaseService} from './api-base.service';

@Injectable()
export class ExcelService extends ApiBaseService {

  public exportToExcel(dataArray, sheetNameArray, fileName): void {

    const wb: WorkBook = {SheetNames: [], Sheets: {}};

    sheetNameArray.forEach((sheetName, i) => {
      wb.SheetNames.push(sheetName);
      wb.Sheets[sheetName] = utils.json_to_sheet(dataArray[i])
    });
    writeFile(wb, fileName + '.xlsx', {
      bookType: 'xlsx', bookSST: true, type: 'binary'
    });
  }
}
