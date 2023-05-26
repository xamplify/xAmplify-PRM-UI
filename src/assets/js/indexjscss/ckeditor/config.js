/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
		  // Add strinsert plugin
		//{ name: 'strinsert' }
	];

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	
	config.extraPlugins = 'strinsert';
	
	config.strinsert_strings = [
	                            {'value': '{{firstName}}', 'name': 'First name'},
	                            {'value': '{{lastName}}', 'name': 'Last name'},
	                            {'value': '{{fullName}}', 'name': 'Full name'},
	                            {'value': '{{emailId}}', 'name': 'Email id'},
								{'value': '{{companyName}}', 'name': 'Company Name'},
								{'value': '{{mobileNumber}}', 'name': 'Mobile Number'},
	                            {'value': '{{address}}', 'name': 'Address'},
	                            {'value': '{{zipcode}}', 'name': 'Zip Code'},
	                            {'value': '{{city}}', 'name': 'City'},
								{'value': '{{state}}', 'name': 'State'},
								{'value': '{{country}}', 'name': 'Country'},
	                           { 'name': 'Sender First Name', 'value': '{{senderFirstName}}' },
							   { 'name': 'Sender Middle Name', 'value': '{{senderMiddleName}}' },
	                           { 'name': 'Sender Last Name', 'value': '{{senderLastName}}' },
	                           { 'name': 'Sender Full Name', 'value': '{{senderFullName}}' },
	                           { 'name': 'Sender Job Title', 'value': '{{senderTitle}}' },
	                           { 'name': 'Sender Email Id', 'value': '{{senderEmailId}}' },
	                           { 'name': 'Sender Contact Number', 'value': '{{senderContactNumber}}' },
	                           { 'name': 'Sender Company', 'value': '{{senderCompany}}' },
	                           { 'name': 'Sender Company Url', 'value': '{{senderCompanyUrl}}' },
							   { 'name': 'Sender Company Instagram Url', 'value': '{{senderCompanyInstagramUrl}}' },
							   { 'name': 'Sender Company Twitter Url', 'value': '{{senderCompanyTwitterUrl}}' },
							   { 'name': 'Sender Company Address', 'value': '{{senderCompanyAddress}}' },
							   { 'name': 'Sender Company Contact Number', 'value': '{{senderCompanyContactNumber}}' },
							   { 'name': 'Sender About Us ', 'value': '{{senderAboutUs}}' },
							   { 'name': 'Sender Event Url ', 'value': '{{senderEventUrl}}' },
	                           { 'name': 'Partner About Us ', 'value': '{{partnerAboutUs}}' },
	                           { 'name': 'Sender Privacy Policy', 'value': '{{senderPrivacyPolicy}}' },
	                           { 'name': 'Unsubscribe Link', 'value': '{{unsubscribeLink}}' }
	                        ];
	                        config.strinsert_button_label = 'Merge Tags';
	                        config.strinsert_button_title = config.strinsert_button_voice = 'Insert Merge Tag(s)';
};
