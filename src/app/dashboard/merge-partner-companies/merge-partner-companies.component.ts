import { Component, OnInit } from '@angular/core';
import { ReferenceService } from 'app/core/services/reference.service';


@Component({
  selector: 'app-merge-partner-companies',
  templateUrl: './merge-partner-companies.component.html',
  styleUrls: ['./merge-partner-companies.component.css']
})
export class MergePartnerCompaniesComponent implements OnInit {
  emailAddress = "";
  isvalidEmailAddressEntered = false;
  emailAddressErrorMessage = "";

  constructor(private referenceService: ReferenceService) { }

  ngOnInit() {
  }

  findDetailsByEmailAddress() {
    this.resetFormValues();
    this.emailAddress = this.referenceService.getTrimmedData(this.emailAddress);
    this.isvalidEmailAddressEntered = this.emailAddress != undefined && this.emailAddress.length > 0;
    this.emailAddressErrorMessage = this.isvalidEmailAddressEntered ? '':'Please Enter Email Address';
    if(this.isvalidEmailAddressEntered){
    }
  }




  private resetFormValues() {
    this.emailAddressErrorMessage = "";
    this.isvalidEmailAddressEntered = false;
  }
}
