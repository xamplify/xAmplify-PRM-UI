export class SenderMergeTag {
    
    senderFirstName = "{{senderFirstName}}";
    senderLastName = "{{senderLastName}}";
    senderFullName = "{{senderFullName}}";
    senderTitle = "{{senderTitle}}";
    senderEmailId = "{{senderEmailId}}";
    senderContactNumber = "{{senderContactNumber}}";
    senderCompany = "{{senderCompany}}";
    senderCompanyUrl = "{{senderCompanyUrl}}";
    senderCompanyContactNumber = "{{senderCompanyContactNumber}}";
    aboutUs = "{{partnerAboutUs}}";
    
    senderFirstNameGlobal = /{{senderFirstName}}/g;
    senderLastNameGlobal = /{{senderLastName}}/g;
    senderFullNameGlobal = /{{senderFullName}}/g;
    senderTitleGlobal = /{{senderTitle}}/g;
    senderEmailIdGlobal = /{{senderEmailId}}/g;
    senderContactNumberGlobal = /{{senderContactNumber}}/g;
    senderCompanyGlobal = /{{senderCompany}}/g;
    senderCompanyUrlGlobal = /{{senderCompanyUrl}}/g;
    senderCompanyContactNumberGlobal = /{{senderCompanyContactNumber}}/g;
    aboutUsGlobal = /{{partnerAboutUs}}/g;
    
}
