export class ChangeEmailAddressRequestDto {
    existingEmailAddress ="";
    existingEmailAddressErrorMessage = "";
    isValidExistingEmailAddress = false;


    updatedEmailAddress = "";
    updatedEmailAddressErrorMessage = "";
    isValidUpdatedEmailAddress = false;

    updateUserProfileLoader = true;
    updateCampaignEmailLoader = true;
    removeAccessTokenLoader = true;
}
