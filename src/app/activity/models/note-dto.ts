
export class NoteDTO {
    id: number;
    title: string;
    content: string;
    visibility: string;
    associationType: string;
    pinned: boolean;
    createdBy: number;
    updatedBy: number;
    createdTime: string;
    updatedTime: string;
    loggedInUserId: number;
    companyId:number;
    createdByFirstName:string;
    createdByLastName:string;
    createdByCompanyName:string;
    publicNotes: boolean;
    contactId: number;
    userIds = [];
    isCompanyJourney:boolean;
}