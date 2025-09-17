import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReferenceService } from '../../core/services/reference.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { FormService } from '../services/form.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-add-form',
    templateUrl: './add-form.component.html',
    styleUrls: ['./add-form.component.css'],
})
export class AddFormComponent implements OnInit, OnDestroy {
    routerLink: string = "/home/forms/manage";
    isAdd = true;
    selectedForm:any;
    selectedDefaultFormId: number = 0;
    /***XNFR-433***/
    isCopyForm: boolean = false;

    constructor(private route:ActivatedRoute,public referenceService: ReferenceService, public authenticationService: AuthenticationService, public formService: FormService, private router: Router) {
        if (this.formService.form === undefined) {
            if (this.router.url.indexOf("/home/forms/edit") > -1) {
                this.navigateToManageSection();
            }
        }
        if (this.formService.form !== undefined && !this.formService.isCopyForm) {
            this.isAdd = false;
            this.selectedForm = this.formService.form;
        } else if(this.formService.formId !== undefined && this.formService.formId > 0 && !this.formService.isCopyForm){
            this.isAdd = true;
            this.selectedDefaultFormId = this.formService.formId;
        }
        /***XNFR-433***/
        else if (this.formService.isCopyForm) {
            this.isCopyForm = this.formService.isCopyForm;
            this.selectedDefaultFormId = this.formService.formId;
        }
    }

    ngOnInit() {

    }
    ngOnDestroy() {
        this.formService.form = undefined;
        this.selectedForm = undefined;
        this.selectedDefaultFormId = 0;
        this.formService.formId = 0;
        /***XNFR-433***/
        this.formService.isCopyForm = false;
        this.isCopyForm = false;
    }

    navigateToManageSection() {
        let categoryId = this.route.snapshot.params['categoryId'];
        if (categoryId > 0) {
            this.router.navigate(["/home/forms/manage/" + categoryId]);
        } else {
            this.router.navigate(["/home/forms/manage"]);
        }
    }


}
