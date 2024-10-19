import { Injectable } from "@angular/core";
import { Pagination } from "app/core/models/pagination";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ReferenceService } from "app/core/services/reference.service";
import { NoteDTO } from "../models/note-dto";


@Injectable()
export class NoteService{
    
    URL = this.authenticationService.REST_URL + "/notes";
    ACCESS_TOKEN_URL = "?access_token=" + this.authenticationService.access_token;  
    
    constructor (private authenticationService:AuthenticationService, private referenceService: ReferenceService) {

    }

    saveOrUpdateNote(noteDTO: NoteDTO, isAdd : boolean){
        if (isAdd) {
            let url :string = this.URL + this.ACCESS_TOKEN_URL; 
            return this.authenticationService.callPostMethod(url, noteDTO);
        } else {
            
        }
    }

    getPaginatedNotes(notePagination:Pagination) {
        let pageableUrl = this.referenceService.getPagebleUrl(notePagination);
        let url = this.URL + "/fetch-all-notes/" + notePagination.userId + "/" + notePagination.contactId + this.ACCESS_TOKEN_URL + pageableUrl;
        return this.authenticationService.callGetMethod(url);
    }
    
}