import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PartnerSignatureStatusAnalyticsDTO } from 'app/contacts/models/PartnerSignatureStatusAnalyticsDtO';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DamService } from 'app/dam/services/dam.service';

@Component({
  selector: 'app-asset-signature-status-analytics',
  templateUrl: './asset-signature-status-analytics.component.html',
  styleUrls: ['./asset-signature-status-analytics.component.css']
})
export class AssetSignatureStatusAnalyticsComponent implements OnInit {

    @Input() damId : number;
    
    @Output() filterContentByType = new EventEmitter();
  
    partnerSignatureStatusAnalyticsDTO: PartnerSignatureStatusAnalyticsDTO = new PartnerSignatureStatusAnalyticsDTO();
    countsLoader: boolean = false;
  
    constructor(private damService: DamService) {
  
    }
  
    ngOnInit() {
      this.partnerSignatureStatusAnalyticsDTO.selectedCategory = 'ALL';
      this.getTileCounts();
    }
  
  
    getTileCounts() {
      this.countsLoader = true;
      this.damService.getPartnerSignatureCountDetails(this.damId)
        .subscribe(
          response => {
            this.countsLoader = false;
            if (response.data) {
              this.setTilesData(response);
            }
          },
          (error: any) => {
            this.countsLoader = false;
          }
        );
    }
  
    private setTilesData(response: any) {
      let data = response.data;
      this.partnerSignatureStatusAnalyticsDTO.allCount = data.allCount;
      this.partnerSignatureStatusAnalyticsDTO.signedCount = data.signedCount;
      this.partnerSignatureStatusAnalyticsDTO.notSignedCount = data.notSignedCount;
    }
  
    loadCompaniesByType(selectedCategory: string) {
      this.partnerSignatureStatusAnalyticsDTO.selectedCategory = selectedCategory;
      this.filterContentByType.emit(selectedCategory);
    }

}
