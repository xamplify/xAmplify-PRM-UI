import { Component, OnInit } from '@angular/core';
import { CallIntegrationService } from 'app/core/services/call-integration.service';
import { ReferenceService } from 'app/core/services/reference.service';
import AircallPhone from 'aircall-everywhere';

@Component({
  selector: 'app-aircall-dialer',
  templateUrl: './aircall-dialer.component.html',
  styleUrls: ['./aircall-dialer.component.css'],
  providers: [CallIntegrationService]
})
export class AircallDialerComponent implements OnInit {

  phone:any;

  constructor(private referenceService: ReferenceService, public callIntegrationService: CallIntegrationService) { }

  ngOnInit() {
    this.phone = new AircallPhone({
      domToLoadPhone: '#phone',
      onLogin: settings => {
        console.log("aircall phone loaded-- "+ settings.user.email);
      },
      onLogout: () => {
        console.log("aircall phone logged out.");
      },
    });
    // this.phone.on('outgoing_call', callInfos => {
    //   console.log("outgoing call------+917095640095");
    // });
    this.phone.on('incoming_call', callInfos => {
      this.referenceService.openModalPopup("addCallModalPopup");
    });
    this.referenceService.aircallPhone = this.phone;
  }

  closeCallModal() {
    this.referenceService.closeModalPopup('addCallModalPopup');
  }

}
