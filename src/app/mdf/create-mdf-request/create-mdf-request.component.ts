import { Component, OnInit } from '@angular/core';
import { MdfService } from '../services/mdf.service';
import { MdfRequest } from '../models/mdf.request';

@Component({
  selector: 'app-create-mdf-request',
  templateUrl: './create-mdf-request.component.html',
  styleUrls: ['./create-mdf-request.component.css']
})
export class CreateMdfRequestComponent implements OnInit {

  mdfRequest: MdfRequest = new MdfRequest();
  constructor(private mdfService: MdfService) { }

  ngOnInit() {
  }

  getAllMdfRequests() {
    this.mdfService.getAllMdfRequestsForPagination().subscribe((result: any) => {
      if (result.statusCode === 200) {
        console.log("success");
      }
    }, error => {
      console.log(error);
    });
  }

  saveMdfRequest() {
    this.mdfService.saveMdfRequest(this.mdfRequest).subscribe((result: any) => {
      if (result.statusCode === 200) {
        console.log("success");
      }
    }, error => {
      console.log(error);
    });
  }

  updateMdfRequest() {
    this.mdfService.updateMdfRequest(this.mdfRequest).subscribe((result: any) => {
      if (result.statusCode === 200) {
        console.log("success");
      }
    }, error => {
      console.log(error);
    });
  }

}
