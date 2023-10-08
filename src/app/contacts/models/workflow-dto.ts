export class WorkflowDto {
    id = 0;
    title ="";
    subjectId = 0;
    actionId = 0;
    timePhraseId = 0;
    rules = {};
    filterQueryJson = {};
    selectedPartnerListIds = [];
    customTemplateSelected = false;
    templateId = 0;
    notificationSubject= "";
    notificationMessage = "";
    loggedInUserId = 0;
    customDays = 1;
    queryBuilderInputString:any;
    isAdd = false;
}
