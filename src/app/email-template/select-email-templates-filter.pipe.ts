import { Pipe, PipeTransform } from '@angular/core';
import { EmailTemplate } from './models/email-template';
declare var $:any;
@Pipe({
  name: 'selectEmailTemplatesFilter',
  pure: false  
})
export class SelectEmailTemplatesFilterPipe implements PipeTransform {

  transform(items: any[], filter: EmailTemplate,filteredCount:any): any {  
    if (!items || !filter) {  
        return items;  
    }  
    let filteredItems =  items.filter(item => $.trim(item.name).toLowerCase().indexOf($.trim(filter.name).toLowerCase()) !== -1);  
    filteredCount.count = filteredItems.length;
    return filteredItems;
}  
}
