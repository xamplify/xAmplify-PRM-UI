export class ContactList {
    name = "";
    createdDate: string;
    noOfContacts: number;
    activeUsersCount: number;
    noInvalidContacts: number;
    inActiveUsersCount: number;
    noUnsubscribedContacts: number;
    invlidContactsCount: number;
    id: number;
    socialNetwork: string;
    uploadedBy: string;
    contactType: string;
    alias: string;
    isChecked: boolean;
    listOfUsers: string;
    totalRecords: string;
    userListIds: number[];
    emailId: string;
    firstName: string;
    lastName: string;
    isPartnerUserList: boolean;
    companyName: string;
    constructor(id?: number) {
        this.id = id;
    }
    publicList : boolean = false;
    assignedTo: string;
    assignedLeadsList : boolean = false;
    assignedToPartner: boolean =false;
    sharedLeads : boolean = false;
    vanityUrlFilter : boolean = false;
    vendorCompanyProfileName : string;
    synchronisedList : boolean = false;
    moduleName : string;
    externalListId : number;
    teamMemberPartnerList = false;
    loginAsUserId = 0;
    associatedCompany: string;
    companyList:boolean;
}