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

    saveNote(noteDTO: NoteDTO) {
        noteDTO.loggedInUserId = this.authenticationService.getUserId();
        let url: string = this.URL + this.ACCESS_TOKEN_URL;
        return this.authenticationService.callPostMethod(url, noteDTO);
    }

    getPaginatedNotes(notePagination:Pagination) {
        notePagination.userId = this.authenticationService.getUserId();
        let pageableUrl = this.referenceService.getPagebleUrl(notePagination);
        let url = this.URL + "/fetch-all-notes/" + notePagination.userId + "/" + notePagination.contactId + "/" + notePagination.isCompanyJourney + this.ACCESS_TOKEN_URL + pageableUrl;
        return this.authenticationService.callGetMethod(url);
    }

    updateNote(note:NoteDTO) {
        note.loggedInUserId = this.authenticationService.getUserId();
        let url = this.URL + '/' + note.id + this.ACCESS_TOKEN_URL;
        return this.authenticationService.callPutMethod(url, note);
    }

    deleteNote(noteId:number) {
        let url = this.URL + '/delete/' + noteId + '/loggedInUserId/' + this.authenticationService.getUserId() + this.ACCESS_TOKEN_URL;
        return this.authenticationService.callDeleteMethod(url);
    }

    fetchNoteById(noteId:number) {
        let url = this.URL + '/getById/' + noteId + this.ACCESS_TOKEN_URL;
        return this.authenticationService.callGetMethod(url);
    }
    
}