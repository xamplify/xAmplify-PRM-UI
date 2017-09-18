import { Contacts } from '../models/contacts';
export class ContactsByType{
    allContactsCount: number;
    invalidContactsCount: number;
    unsubscribedContactsCount: number;
    activeContactsCount: number;
    inActiveContactsCount: number;

    public contacts: Array<Contacts>;

    invalidRemovableContacts = [];
    allselectedUsers = [];
    isInvalidHeaderCheckBoxChecked: boolean = false;
    invalidDeleteSucessMessage: boolean;

    allContactData: boolean;
    activeContactsData: boolean;
    invalidContactData: boolean;
    unsubscribedContactsData: boolean;
    nonActiveContactsData: boolean;
}