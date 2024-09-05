import { Role } from './role';
import { CampaignAccess } from '../../campaigns/models/campaign-access';
import { CompanyProfileDTO } from '../../dashboard/company-profile/models/company-profile-dto';

export class User {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName:string;
    fullName: string;
    contactCompany: string;
    contactCompanyId: number;
    jobTitle: string;
    emailId: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
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
    roles: Array<Role> = new Array<Role>();
    hasCompany: boolean = false;

    isShowDetails = false;
    companyLogo: string = "";

    companyName:string = "";
    vendorSignUp:boolean = false;
    hasPassword = false;
    
    vertical: string = "";
    region: string = "";
    partnerType: string = "";
    category: string = "";
    campaignAccessDto:CampaignAccess = new CampaignAccess();
    legalBasis = [];
    legalBasisString = [];

    companyProfileName: string;
    preferredLanguage:string;

    contactsLimit:number;
    mdfAmount:any;
    notifyPartners = false;
    disableNotifyPartnersOption = false;
    teamMemberGroupId = 0;
    selectedTeamMembersCount = 0;
    selectedTeamMemberIds = [];
    partnershipId = 0;
    selectedTeamMemberGroupName = "";

    excludedCatagory = "";

    secondAdmin : boolean = false;

    companyProfileDTO : CompanyProfileDTO = new CompanyProfileDTO();
    displayContactCompany : string;
    companyNameStatus : string;

    accountName : string;
    accountSubType : string;
    territory : string;
    companyDomain : string;
    accountOwner : string;
    website: string;
    isValidEmailIdPattern = false;
    isVanityWelcomePageRequired:boolean;

}
