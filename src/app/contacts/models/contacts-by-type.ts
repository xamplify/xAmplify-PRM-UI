import { Contacts } from '../models/contacts';
import { User } from '../../core/models/user';
import { Pagination } from '../../core/models/pagination';

export class ContactsByType {
    allContactsCount: number = 0;
    invalidContactsCount: number = 0;
    unsubscribedContactsCount: number = 0;
    activeContactsCount: number = 0;
    inactiveContactsCount: number = 0;
    validContactsCount : number =0;
    excludedContactsCount : number = 0;

    contacts: Array<User> = new Array<User>();
    listOfAllContacts: any;
    contactListAssociatedCampaigns: any;
    selectedCategory: string = '';
    pagination: Pagination = new Pagination();
    contactPagination: Pagination = new Pagination();
    isLoading: boolean = false;

    invalidRemovableContacts = [];
    allselectedUsers = [];
    isInvalidHeaderCheckBoxChecked: boolean = false;
    invalidDeleteSucessMessage: boolean;
}