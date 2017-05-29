import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { EmailTemplateService } from '../services/email-template.service';
import { UserService } from '../../core/services/user.service';
import { PagerService } from '../../core/services/pager.service';
import { ReferenceService} from '../../core/services/reference.service';

import { Pagination} from '../../core/models/pagination';
import { EmailTemplate } from '../models/email-template';
declare var Metronic ,Layout ,Demo,swal ,TableManaged:any;

@Component({
  selector: 'app-manage-template',
  templateUrl: './manage-template.component.html',
  styleUrls: ['./manage-template.component.css','../../../assets/css/video-css/ribbons.css'],
  providers:[Pagination]
})
export class ManageTemplateComponent implements OnInit {
	 isPreview = false;
	    emailTemplate:EmailTemplate;
	    emailPreview:string;
	    emailTemplates:any[];
	    pager: any = {};
	    pagedItems: any[];
	    public totalRecords :number=1;
	    public searchKey :string="";
	    
	    templatesDropDown = [
	                         {'name':'All Email Templates','value':''},
	                         {'name':'Uploaded Regular Templates','value':'regularTemplate'},
	                         {'name':'Uploaded Video Templates','value':'videoTemplate'},
	                         {'name':'Regular Templates','value':'beeRegularTemplate'},
	                         {'name':'Video Templates','value':'beeVideoTemplate'}
	                         
	                        ];
	    
	    sortByDropDown  = [
	                       {'name':'Sort By','value':''},
	                       {'name':'Name(A-Z)','value':'name-ASC'},
	                       {'name':'Name(Z-A)','value':'name-DESC'},
	                       {'name':'Created Date(ASC)','value':'createdTime-ASC'},
	                       {'name':'Created Date(DESC)','value':'createdTime-DESC'}
	                       ];
	    
	    numberOfItemsPerPage = [
	                            {'name':'10','value':'10'},
	                            {'name':'20','value':'20'},
	                            {'name':'30','value':'30'},
	                            {'name':'40','value':'40'},
	                            {'name':'50','value':'50'},
	                            {'name':'---All---','value':'0'},
	                            ]
	    
	    public selectedTemplate:any = this.templatesDropDown[0];
	    public selectedSortedOption:any = this.sortByDropDown[0];
	    public itemsSize:any = this.numberOfItemsPerPage[0];
	                            
	    constructor(private emailTemplateService:EmailTemplateService,private userService:UserService,private router:Router, 
	            private pagerService: PagerService,private refService:ReferenceService,private pagination:Pagination) {
	    }
	    
	    listEmailTemplates(pagination:Pagination){
	        try{
	           this.emailTemplateService.listTemplates(pagination,this.userService.loggedInUserData.id)
	            .subscribe(
	                (data:any) => {
	                    this.emailTemplates = data.emailTemplates;
	                    this.totalRecords = data.totalRecords;
	                    pagination.totalRecords = data.totalRecords;
	                    pagination = this.pagerService.getPagedItems(pagination, data.emailTemplates);
	                    this.refService.showInfo("Finished listEmailTemplates in manageTemplatesComponent",this.emailTemplates);
	                },
	                (error:string) => {
	                    this.refService.showError(error, "listEmailTemplates","ManageTemplatesComponent")
	                }
	            );
	        }catch(error){
	            this.refService.showError(error, "listEmailTemplates","ManageTemplatesComponent")
	        }
	       
	    }
	    
	    setPage(page: number) {
	        try{
	            this.pagination.pageIndex = page;
	            this.listEmailTemplates(this.pagination);
	        }catch(error){
	            this.refService.showError(error, "setPage","ManageTemplatesComponent")
	        }
	    }
	    
	    
	    
	    searchTemplates(){
	        try{
	            this.getAllFilteredResults(this.pagination);
	            
	        }catch(error){
	            this.refService.showError(error, "searchTemplates","ManageTemplatesComponent")
	        }
	        
	    }
	    
	    getSelectedEmailTemplate(text:any){
	        try{
	            this.selectedTemplate = text;
	            this.getAllFilteredResults(this.pagination);
	        }catch(error){
	            this.refService.showError(error, "getSelectedEmailTemplate","ManageTemplatesComponent");
	        }
	        
	    }
	    
	    
	    getAllFilteredResults(pagination:Pagination){
	        try{
	            this.pagination.pageIndex = 1;
	            this.pagination.searchKey = this.searchKey;
	            this.pagination.filterBy = this.selectedTemplate.value;
	            let sortedValue = this.selectedSortedOption.value;
	            if(sortedValue!=""){
	                let options:string[] = sortedValue.split("-");
	                this.pagination.sortcolumn = options[0];
	                this.pagination.sortingOrder = options[1];
	            }
	            
	            if(this.itemsSize.value==0){
	                this.pagination.maxResults = this.pagination.totalRecords;
	            }else{
	                this.pagination.maxResults = this.itemsSize.value;
	            }
	            this.listEmailTemplates(this.pagination);
	        }catch(error){
	            this.refService.showError(error, "getAllFilteredResults","ManageTemplatesComponent")
	        }
	    }
	    
	    
	    getSortedResult(text:any){
	        try{
	            this.selectedSortedOption = text;
	            this.getAllFilteredResults(this.pagination);
	        }catch(error){
	            this.refService.showError(error, "getSortedResult","ManageTemplatesComponent");
	        }
	        
	    }
	    
	    getNumberOfItemsPerPage(items:any){
	        try{
	            this.itemsSize = items;
	            this.getAllFilteredResults(this.pagination);
	        }catch(error){
	            this.refService.showError(error, "getNumberOfItemsPerPage","ManageTemplatesComponent");
	        }
	    }
	    edit(id:number){
	            this.emailTemplateService.getById(id)
	            .subscribe(
	                (data:EmailTemplate) => {
	                    this.emailTemplateService.emailTemplate = data;
	                    if(data.regularTemplate || data.videoTemplate){
	                        this.router.navigate(["/home/emailtemplate/updateTemplate"]);
	                    }else{
	                        this.router.navigate(["/home/emailtemplate/createTemplate"]);
	                    }
	                    this.refService.showInfo("Finsished edit() in manageTemplatesComponent",data)
	                    
	                },
	                (error:string) => {
	                    this.refService.showError(error, "edit","ManageTemplatesComponent");
	                }
	            );
	        
	    }
	    
	    
	    ngOnInit(){
	         try{
	             Metronic.init(); 
	             Layout.init();
	             Demo.init();
	            // TableManaged.init();
	             this.listEmailTemplates(this.pagination);
	         }catch(error){
	             this.refService.showError(error, "ngOnInit","ManageTemplatesComponent");
	         }
	       
	    }       
	    
	  
	    
	    confirmDeleteEmailTemplate(id:number){
	        try{
	            let self = this;
	            swal( {
	                title: 'Are you sure?',
	                text: "You won't be able to revert this!",
	                type: 'warning',
	                showCancelButton: true,
	                confirmButtonColor: '#3085d6',
	                cancelButtonColor: '#d33',
	                confirmButtonText: 'Yes, delete it!'

	            }).then( function() {
	                self.deleteEmailTemplate(id);
	            })
	        }catch(error){
	            this.refService.showError(error, "confirmDeleteEmailTemplate","ManageTemplatesComponent");
	        }
	       
	    }
	    
	    deleteEmailTemplate(id:number){
	        this.emailTemplateService.delete(id)
	        .subscribe(
	        (data:string) => {
	            document.getElementById('emailTemplateListDiv_'+id).remove();
	            this.refService.showInfo("Email Template Deleted Successfully","")
	        },
	        (error:string) => {  this.refService.showError(error, "deleteEmailTemplate","ManageTemplatesComponent");}
	        );
	    }
	    
	    

}
