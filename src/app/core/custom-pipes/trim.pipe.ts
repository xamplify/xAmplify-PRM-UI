import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimText',
  pure: false
})
export class TrimPipe implements PipeTransform {
  transform(value: string): any { 
    return value.trim()
  }
  
}