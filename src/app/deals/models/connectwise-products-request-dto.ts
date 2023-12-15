import { ConnectwiseCatalogItemDto } from "./connectwise-catalog-item-dto";
import { ConnectwiseOpportunityDto } from "./connectwise-opportunity-dto";
import { ConnectwiseStatusDto } from "./connectwise-status-dto";

export class ConnectwiseProductsRequestDto {

    forecastType = "";
    quantity = 0;
    revenue = 0;
    cost = 0;
    catalogItem:ConnectwiseCatalogItemDto = new ConnectwiseCatalogItemDto();
    opportunity:ConnectwiseOpportunityDto = new ConnectwiseOpportunityDto();
    status:ConnectwiseStatusDto = new ConnectwiseStatusDto();

}
