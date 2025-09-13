# xamplify-prm-ui

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.2.

## Installation

To get started locally, follow these instructions:

1.Install the node.js version 8.11 or above, if you have not done yet. After installing, check the node version with `node -v`.

2.Install the `@angular/cli` version `1.4.2`, Now project current version is 1.4.2. For installing the cli run below command.
`npm install -g @angular/cli@1.4.2`
check if the cli installed properly or not with `ng --version` command

3.Clone the `xamplify-prm-ui` project to your local computer using `git`

4.Run `npm install` to download the node modules of your project. Those files will help you to run the project locally.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## AGM GOOGLE MAP INSTALLTION Required Changes

Run `npm install @agm/core@1.0.0-beta.2 --save`  if you `get agm map` issue.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `xtremandApp/` directory. Use the `-prod` flag for a production build.

## Build Xamplify Production
Run `node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod --env=prod`. The build artifacts will be stored in the `xtremandApp/` directory

## Build Release Xamplify Testing
Run `node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod --env=release`. The build artifacts will be stored in the `xtremandApp/` directory

## Build Social Ubuntu Development Testing
Run `node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng build --prod --env=qa`. The build artifacts will be stored in the `xtremandApp/` directory

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# branch1-26062018

## Authentication Module:
1.	scrolling to particular div issue fixed in the intro page
2.	title length issue fixed in notification page
3.	message corrected in forgot password page
4.	xAmplify wording changes done in the intro page.

## Core Module:
1.	first name length issue fixed in top navbar page

## Dashboard Module:
1.	commented total partner tab in dashboard and code refactored in the intro page.
2.	showing correct analytics loader changes from the dashboard
3.	Ui wording changes fixed in edit company page
4.	company address format changed in edit company page.
5.	Issue Fixed: donut chart percentage shows the wrong percentage in the dashboard page
6.	state field added in the edit company page.
7.	x, y-axis UI changes in the video-based report and play video and editvideo button alignment changes
8.	changed the wording X-Amplify to xAmplify in edit company page.
9.	fixed sort issue in opened and clicked report and title length issue
10.	first name length issue fixed in my profile page
11.	campaign name length issue fixed in the report page
12.	UI issues fixed in my profile page
13.	Added Campaign Type field for the dash board heat map.
14.	title length issue fixed in profile lock and edit company profile page
15.	default image added if image src not found in vendor report page
16.	changed create templates to view templates for partner account

## Partners Module:
1.	Inactive and non-active partner tiles corrected
2.	inactive to Unregistered text corrected in manage partner page
3.	added the ellipsis in add partner page.
4.	length issue fixed in partner report page
5.	Done UI changes for showing state and zip code in add partner, edit partner page

## Contact Module:
1.	Changed the Contact to Phone in add contact page and changed the option not selected error message in add contact page
2.	Changed the wording inactive to Unregistered in edit contact page.
3.	contactByType null issue fixed in edit contact page.
4.	contact list name length issue fixed in manage contact page, edit contact page
5.	sweetalert input name maxlength issue fixed in edit and manage contact page
6.	company name length and uploaded by name length issue fixed in manage contact page
7.	while updating contact list name length issue fixed in edit contact page
8.	elipsis added for emailId, first name, last Name and job title in contact module
9.	Added the UI changes state and zip fielda and also changed the code for adding state zip fields in contact and partner module.
10.	State and zipcode fields added for updating user in contact and partner page

## Videos Module:
1.	Changed the Viewer Details popup wordings.
2.	pagination UI alignment issue fixed in manage videos page
3.	Fix code for Discrepancies between Video's viewer details 
4.	edit video validations changes
5.	upload video screen Notes UI changes, 
6.	edit and create campaign buttons aligned correctly in manage videos
7.	x and y-axis labels added for skipped played chart in video-based report
8.	title length issue fixed in manage videos and video based report page
9.	length issue fixed in trellis chart dashboard, video-based report page
10.	upload user name length issue fixed in play videos, manage videos
11.	ui issues fixed in upload videos page
12.	Video thumbnail component created
13.	video thumbnail code added and default images added
14.	Video thumb nail code re factored and length issues fixed
15.	added gif image in manage videos when mouse over and mouse leave
16.	Y-axis and X-axis actually need descriptive labels

## Email templates Module:
1.	buttons aligned correctly in manage templates
2.	"Why does Vendor manage templates screen have a Partner tab?" Fixed
3.	Hiding Default Template When Through Partner got selected
4.	Auto Email template save functionality done for bee plugins
5.	Draft email template ribbon color changed to orange
6.	Email Template & Campaign Search Issue Fixed
7.	Completed Email template auto save functionality.

## Campaign module:
1.	Campaign name title length issue fixed in analytics page
2.	view in browser buttons alignment issue fixed
3.	social campaign loader added and title length issues fixed
4.	code formatted in analytics loader and removed unused variables
5.	UI correction in campaign analytics page.
6.	Following issue fixed. Create campaign - partner videos tab
7.	title length issue fixed in analytics
8.	Code changes for showing distinct email action count in campaign analytics page.
9.	title length issue fixed in campaigns and UI issues fixed
10.	Length issue and UI corrections fixed in create a campaign page
11.	Show hide email log actions history fix.
12.	contact list name select error message changed in edit partner campaign page
13.	video thumbnail code changes in preview campaign page
14.	space between the + and the word Auto-response in each of this button

## Social module:
1.	Default image added if image src not found in social accounts page.

## Global:
1.	E2E Test Files
2.	upload video test case created
3.	test cases added for upload videos and dashboard page
4.	upload and dash board page Test functions added
5.	camera open close test function added in upload videos
6.	upload video test cases added and video file added
7.	Implemented Pivotal based view reports
8.	Fixed the download functionality issue.
9.	Environment files change for prod and QA and dev
