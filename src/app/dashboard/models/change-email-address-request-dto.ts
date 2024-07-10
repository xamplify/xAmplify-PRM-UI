export class ChangeEmailAddressRequestDto {
    existingEmailAddress ="";
    existingEmailAddressErrorMessage = "";
    isValidExistingEmailAddress = false;


    updatedEmailAddress = "";
    updatedEmailAddressErrorMessage = "";
    isValidUpdatedEmailAddress = false;

    updateUserProfileLoader = false;
    updateCampaignEmailLoader = false;
    removeAccessTokenLoader = false;

    emailAddressUpdatedSuccessfully = false;
    emailAddressUpdateError = false;
    campaignEmailAddressUpdatedSuccessfully = false;
    campaignEmailAddressUpdateError = false;
    accessTokenRemovedSuccessfully = false;
    accessTokenRemovedError = false;

    displayEmailAddressFields = true;

    isEmailAddressUpdatedSuccessfully = false;

    removeLoaders(){
        this.updateUserProfileLoader = false;
        this.updateCampaignEmailLoader = false;
        this.removeAccessTokenLoader = false;
    }
}
