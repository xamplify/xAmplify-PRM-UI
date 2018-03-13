export class RegularExpressions {
 EMAIL_ID_PATTERN = /^[A-Za-z0-9]+(\.[_A-Za-z0-9]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
 PASSWORD_PATTERN = '((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})';
 CITY_PATTERN = /[a-zA-Z]+[a-zA-Z ]+/;
 ADDRESS_PATTERN = /^[a-zA-Z0-9-\/] ?([a-zA-Z0-9-\/]|[a-zA-Z0-9-\/] )*[a-zA-Z0-9-\/]$/;
}
