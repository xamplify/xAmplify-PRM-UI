export class ThemePropertiesDto {
    id: number;
    themeId: number;
    backgroundColor: string;
    buttonColor: string;
    buttonValueColor: string;
    createdBy: number;
    updatedBy: number;
    // createdDate : number;
    // updatedDate : number;
    textColor: string;
    buttonBorderColor: string;
    iconColor: string;
    iconBorderColor: string;
    iconHoverColor: string;
    textContent: string;
    moduleTypeString: string;
    showFooter: boolean;
    divBgColor: string;
    headerBackgroundColor: string;
    defaultSkin = false;
    buttonPrimaryBorderColor: string;
    buttonSecondaryColor: string;
    buttonSecondaryBorderColor: string;
    buttonSecondaryTextColor: string;
    secondaryButtonTextColor = "";
    gradiantColorOne = "";
	gradiantColorTwo = "";
}