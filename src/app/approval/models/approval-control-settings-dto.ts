export class ApprovalControlSettingsDTO {
 
    id: number;
    loggedInUserId: number;
    companyId: number;
    role: string;
    fullName: string;
    emailId: string;

    assetApprover:boolean;
    trackApprover: boolean;
    playbookApprover: boolean;

    hasDamRole: boolean;
    hasTrackRole: boolean;
    hasPlaybookRole: boolean;

    isAnyApprover: boolean = false;
        
}