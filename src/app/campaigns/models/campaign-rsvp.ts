//import { Form } from 'app/forms/models/form';
import { FormSubmit } from '../../forms/models/form-submit';

export class CampaignRsvp {
    message: string;
    alias: string;
    eventCampaignRsvp: string;
    additionalCount:number;
    formSubmitDTO = new FormSubmit();
}
