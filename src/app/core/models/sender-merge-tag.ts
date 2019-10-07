export class SenderMergeTag {
    
    senderFirstName = "{{senderFirstName}}";
    senderLastName = "{{senderLastName}}";
    senderFullName = "{{senderFullName}}";
    senderEmailId = "{{senderEmailId}}";
    senderContactNumber = "{{senderContactNumber}}";
    senderCompany = "{{senderCompany}}";
    senderCompanyUrl = "{{senderCompanyUrl}}";
    senderCompanyContactNumber = "{{senderCompanyContactNumber}}";
    aboutUs = "{{aboutUs}}";
    
    senderFirstNameGlobal = /{{senderFirstName}}/g;
    senderLastNameGlobal = /{{senderLastName}}/g;
    senderFullNameGlobal = /{{senderFullName}}/g;
    senderEmailIdGlobal = /{{senderEmailId}}/g;
    senderContactNumberGlobal = /{{senderContactNumber}}/g;
    senderCompanyGlobal = /{{senderCompany}}/g;
    senderCompanyUrlGlobal = /{{senderCompanyUrl}}/g;
    senderCompanyContactNumberGlobal = /{{senderCompanyContactNumber}}/g;
    aboutUsGlobal = /{{aboutUs}}/g;
    
}
