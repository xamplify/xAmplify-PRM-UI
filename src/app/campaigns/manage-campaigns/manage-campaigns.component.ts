import { Component, OnInit } from '@angular/core';
import { XtremandLogger } from "../../error-pages/xtremand-logger.service";
import { ReferenceService } from "app/core/services/reference.service";
import { Router,ActivatedRoute} from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ModulesDisplayType } from 'app/util/models/modules-display-type';
@Component({
  selector: 'app-manage-campaigns',
  templateUrl: './manage-campaigns.component.html',
  styleUrls: ['./manage-campaigns.component.css']
})
export class ManageCampaignsComponent implements OnInit {

  viewType: string;
  categoryId: number;
  folderViewType: string;
	modulesDisplayType = new ModulesDisplayType();

  constructor(public authenticationService:AuthenticationService,public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, 
		private router: Router,private route: ActivatedRoute) {
        this.viewType = this.route.snapshot.params['viewType'];
        this.categoryId = this.route.snapshot.params['categoryId'];
        this.folderViewType = this.route.snapshot.params['folderViewType'];
		    this.modulesDisplayType = this.referenceService.setDefaultDisplayType(this.modulesDisplayType);
        if(this.viewType==undefined){
            this.viewType = this.modulesDisplayType.isListView ? 'l' : this.modulesDisplayType.isGridView ?'g':'';
        }
	}


  goToManageCampaigns(){
		this.referenceService.navigateToManageCampaignsByViewType(this.folderViewType,this.viewType,this.categoryId);
  }

  ngOnInit() {
  }

}
