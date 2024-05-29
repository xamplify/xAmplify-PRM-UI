export class OpportunityTypes {
    id: number;
    leadTicketType: string = "";
    dealTicketType: string = "";
    defaultLeadTicketType: boolean = false;
    defaultDealTicketType: boolean = false;
    won: boolean = false;
    lost: boolean = false;
    markAs: string = "";
    displayIndex: number;
    canDelete: boolean = true;
    private: boolean;
}
