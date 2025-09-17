import { ResponseType } from './response-type';

export class CustomResponse {
    type: ResponseType;
    statusText: string | null;
    statusArray: string[];
}