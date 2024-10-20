import { User } from "app/core/models/user";

export class ContactsRequestDto {
    contactListName = "";

    externalListId = 0;

    socialNetwork = "";

    contactType = "";

    publicList = false;

    users: User[];

    loggedInUserId = 0;

    userListId = 0;


}
