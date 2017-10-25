import { Role } from './role';
export class User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    fullName: string;
    contactCompany: string;
    jobTitle: string;
    emailId: string;
    address: string;
    city: string;
    country: string;
    mobileNumber: string;
    interests: string;
    occupation: string;
    description: string;
    websiteUrl: string;
    profileImagePath: string;
    displayName: string;
    id: number;
    userId: number;
    isChecked: boolean;
    userListIds: number[];
    alias: string;
    userDefaultPage: string;
    roles:Array<Role> = new Array<Role>();
    hasCompany:boolean = false;
}
