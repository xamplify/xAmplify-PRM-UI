import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileIcon'
})
export class SelectAssetTypeFilterPipe implements PipeTransform {

   private readonly iconMap = new Map<string, string>([
    ['png', 'fa-file-image'], ['jpg', 'fa-file-image'],
    ['jpeg', 'fa-file-image'], ['bmp', 'fa-file-image'],
    ['gif', 'fa-file-image'], ['svg', 'fa-file-image'],
    ['avif', 'fa-file-image'],

    ['pdf', 'fa-file-pdf'], ['designpdf', 'fa-file-pdf'],

    ['doc', 'fa-file-word'], ['docx', 'fa-file-word'],

    ['xls', 'fa-file-excel'], ['xlsx', 'fa-file-excel'],

    ['csv', 'fa-file-csv'],

    ['ppt', 'fa-file-powerpoint'], ['pptx', 'fa-file-powerpoint'],

    ['zip', 'fa-file-archive'], ['rar', 'fa-file-archive'],
    ['gz',  'fa-file-archive'],  ['7z',  'fa-file-archive'],

    ['exe', 'fa-file-code'], ['sh',  'fa-file-code'],
    ['bat', 'fa-file-code'], ['jar', 'fa-file-code'],
    ['html', 'fa-file-code'], ['htm', 'fa-file-code'],
    ['xml', 'fa-file-code'],  ['js',  'fa-file-code'], ['ts',  'fa-file-code'],

    ['mp4', 'fa-file-video'], ['avi', 'fa-file-video'],
    ['mkv', 'fa-file-video'], ['mov', 'fa-file-video'],
    ['webm', 'fa-file-video'],
    ['mp3', 'fa-file-audio'], ['wav', 'fa-file-audio'],

    ['ics', 'fa-calendar']
  ]);

    transform(input: string | null | undefined, fallback = 'fa-file'): string {
    if (!input) { return fallback; }

     const ext = input.toLowerCase()
                     .split('/').pop()!            
                     .split('.').pop()!;          

    return this.iconMap.get(ext) || fallback;
  }

}
