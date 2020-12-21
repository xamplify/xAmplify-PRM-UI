export class RegularExpressions {
    EMAIL_ID_PATTERN = /^(([a-zA-Z0-9.!#$&'*+\/=?_`{|}~-]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    PASSWORD_PATTERN = '((?=.*\\d)(?=.*[A-Za-z])(?!.* )(?=.*[^a-zA-Z0-9]).{6,20})';
    CITY_PATTERN = /[a-zA-Z]+[a-zA-Z ]+/;
    ADDRESS_PATTERN = /^[a-zA-Z0-9-\/] ?([a-zA-Z0-9-\/]|[a-zA-Z0-9-\/] )*[a-zA-Z0-9-\/]$/;
    PHONE_NUMBER_PATTERN = /^[0-9-+]+$/;
    URL_PATTERN = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;
    ALPHA_NUMERIC =/^[a-z0-9]+$/;
    COLOR_CODE_PATTERN = /^#([0-9a-fA-F]{3}){1,2}$/;

}
