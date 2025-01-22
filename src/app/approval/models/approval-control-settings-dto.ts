export class ApprovalControlSettingsDTO {
 
    id: number;
    loggedInUserId: number;
    companyId: number;
    role: string;
    firstName: string;
    emailId: string;
    assetApprover:boolean;
    trackApprover: boolean;
    playbookApprover: boolean;
    hasDamRole: boolean;
    hasTrackRole: boolean;
    hasPlaybookRole: boolean;
    anyApprover: boolean = false;
    anyAdminOrSupervisor: boolean = false;
        
}