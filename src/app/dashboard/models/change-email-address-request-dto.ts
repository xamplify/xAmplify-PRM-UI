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
    campaignEmailAddressUpdatedSuccessfully = false;
    accessTokenRemovedSuccessfully = false;
}
