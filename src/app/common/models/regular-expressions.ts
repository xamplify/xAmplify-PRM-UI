export class RegularExpressions {
    EMAIL_ID_PATTERN = /^(([a-zA-Z0-9.!#$&'*+\/=?_`{|}~-]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    PASSWORD_PATTERN = '((?=.*\\d)(?=.*[A-Za-z])(?!.* )(?=.*[^a-zA-Z0-9]).{6,20})';
    CITY_PATTERN = /[a-zA-Z]+[a-zA-Z ]+/;
    ADDRESS_PATTERN = /^[a-zA-Z0-9-\/] ?([a-zA-Z0-9-\/]|[a-zA-Z0-9-\/] )*[a-zA-Z0-9-\/]$/;
    PHONE_NUMBER_PATTERN = /^[0-9-+]+$/;
    URL_PATTERN = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/;
    LINK_PATTERN = /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])+(.[a-z])?/;
    ALPHA_NUMERIC =/^[a-z0-9]+$/;
    COLOR_CODE_PATTERN = /^#([0-9a-fA-F]{3}){1,2}$/;
    DOMAIN_PATTERN = /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/;
    ALPHABETS_PATTERN =  /^[A-Za-z\s]+$/;
    

// added one more regEx.
        FIRSTNAME_PATTERN=/[a-zA-Z]/;
        //FIRSTNAME_PATTERN=/[^a-zA-Z\s]/;



}
