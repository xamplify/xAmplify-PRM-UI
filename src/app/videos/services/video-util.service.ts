import { Injectable } from '@angular/core';

@Injectable()
export class VideoUtilService {
 public videoSizes = ['1280 × 720', '560 × 315', '853 × 480', '640 × 360'];
 public publishUtil = [{ id: 1, name: 'PRIVATE' }, { id: 2, name: 'PUBLIC' }, { id: 3, name: 'UNLISTED' }];
 public  formErrors = {
        'title': '', 'viewBy': '', 'categoryId': '',  'tags': '',  'imageFile': '',  'gifImagePath': '',
        'description': '', 'upperText': '',  'lowerText': '',
    };

  constructor() { }
  validateEmail(email: string) {
        const validation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return validation.test(email);
    }

  convertHexToRgba(hex: string, opacity: number) {
        hex = hex.replace('#', '');
        let r: number, g: number, b: number;
        if (hex.length === 3) {
            r = parseInt(hex.substring(0, 1), 16);
            g = parseInt(hex.substring(1, 2), 16);
            b = parseInt(hex.substring(2, 3), 16);
        }  else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        const result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
        return result;
    }

}
