import { Properties } from './properties';

export class CustomResponse {
    responseType: string; //SUCCESS, ERROR, INFO
    responseMessage: string;
    isVisible: boolean;
    properties: Properties;

    constructor(responseType?: string, responseMessage?: string, isVisible?: boolean) {
        this.responseType = responseType;
        this.responseMessage = responseMessage;
        this.isVisible = isVisible;
    }
}