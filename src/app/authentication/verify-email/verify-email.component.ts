import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { XtremandLogger } from '../../error-pages/xtremand-logger.service';
import { ReferenceService } from '../../core/services/reference.service';
import { Properties } from '../../common/models/properties';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.css'],
    providers: [Properties]
})
export class VerifyEmailComponent implements OnInit {
    public alias: string;
    constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private router: Router,
        public xtremandLogger: XtremandLogger, public referenceService: ReferenceService, public properties: Properties) { }

    activateAccount() {
        this.userService.activateAccount(this.alias)
            .subscribe(
                (result: any) => {
                    this.xtremandLogger.log(result);
                    this.xtremandLogger.info("your account activated successfully")
                    this.referenceService.userProviderMessage = this.properties.ACCOUNT_ACTIVATED_SUCESS;
                    this.router.navigate(['/login']);
                });
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (param: any) => {
                this.alias = param['alias'];
            });
        this.activateAccount();
    }

}
