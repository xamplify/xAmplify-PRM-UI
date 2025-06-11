import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Properties } from 'app/common/models/properties';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Partnership } from 'app/partners/models/partnership.model';
import { ParterService } from 'app/partners/services/parter.service';
declare var $, swal: any;
@Component({
  selector: 'app-partner-company-domain-modal-popup',
  templateUrl: './partner-company-domain-modal-popup.component.html',
  styleUrls: ['./partner-company-domain-modal-popup.component.css'],
  providers: [Properties]
})
export class PartnerCompanyDomainModalPopupComponent implements OnInit {
  domainId: any;
  partnership: Partnership = new Partnership();
  @Input() selectedDomain : any;
  partners: any;
  @Output() closeEvent = new EventEmitter<any>();
  @Output() notifyCloseEvent = new EventEmitter<any>();
  modalPopupLoader :boolean = false;
  domainDeactivatingDescription : any;
  count: any;

  constructor(public parterService: ParterService, private authenticationService: AuthenticationService, private properties: Properties ) { }

  ngOnInit() {
     $("#partnerCompanyDomainForm").modal('show');
     this.findPartnerCompaniesByDomain(this.selectedDomain);
  }

    ngOnDestroy(){
    $('#partnerCompanyDomainForm').modal('hide');
  }

  

  findPartnerCompaniesByDomain(selectedDomain: any) {
    this.modalPopupLoader = true;
    this.partnership.domainName = selectedDomain.domainName;
    this.partnership.domainId = selectedDomain.id;
    this.partnership.domainDeactivated = selectedDomain.domainDeactivated;
    let suffexMessage = this.authenticationService.module.isPrmCompany ? ' sharing' : ' and campaign sharing.';
    if (this.partnership.domainDeactivated) {
      this.partnership.status = 'deactivated';
      this.domainDeactivatingDescription = this.properties.DOMAIN_WHITELISTING_ACTIVATE_DOMAIN + suffexMessage;
    } else {
      this.partnership.status = 'approved';
      this.domainDeactivatingDescription = this.properties.DOMAIN_WHITELISTING_DEACTIVATE_DOMAIN + suffexMessage;
    }
    this.parterService.findPartnerCompaniesByDomain(this.partnership).subscribe(response => {
      if (response.statusCode == 200) {
        this.partners = response.data.data;
        this.count = response.data.totalCount;
        this.modalPopupLoader = false;
      }
    }, error => {
      this.modalPopupLoader = false;
    });
  }


  closePartnerCompanyDomainModal(){
  $("#partnerCompanyDomainForm").modal('hide');
  this.closeEvent.emit();
  }

  confirmAndupdateExcludedDomain(){
	let confirmButtonMessage = this.partnership.domainDeactivated  ? 'Yes, Activate it!' : 'Yes, Deactivate it!';
		let self = this;
		swal({
			title: 'Are you sure?',
			text: this.partnership.domainDeactivated ? `The domain and the <strong style="font-weight: bold; color: #ff5733;">${this.count}</strong> partnerships associated with it will be activated` : `The domain and the <strong style="font-weight: bold; color: #ff5733;">${this.count}</strong> partnerships associated with it will be deactivated`,
			type: 'warning',
			showCancelButton: true,
			swalConfirmButtonColor: '#54a7e9',
			swalCancelButtonColor: '#999',
			confirmButtonText: confirmButtonMessage
		}).then(function () {
			self.deactivateOrActivatePartner();
		}, function (dismiss: any) {
			console.log('You clicked on option: ' + dismiss);
		});
  }

  deactivateOrActivatePartner() {
    this.modalPopupLoader = true;
    if(this.partnership.domainDeactivated){
    this.partnership.status = 'approved';
    } else {
    this.partnership.status = 'deactivated';
    }
    this.parterService.updatePartnerCompaniesByDomain(this.partnership).subscribe(response => {
      if (response.statusCode == 200) {
        this.modalPopupLoader = false;
      $("#partnerCompanyDomainForm").modal('hide');
       this.notifyCloseEvent.emit(response.message);
      }});
  }

}
