
import { ErrorHandler, Injectable } from '@angular/core';
declare var swal: any;
@Injectable()
export class ClearChunkFile implements ErrorHandler {
  handleError(error: any): void {
    let message = error.message;
    if(message!="e.data.includes is not a function"){
      console.log(error);
    }
    let emptyChunk = 'Loading chunk 0 failed';
    if(message!=undefined && message!=""){
      let loadingChunk = message.indexOf('Loading chunk') > -1;
      let emptyChunkExits = message.indexOf(emptyChunk)<0;
      if (loadingChunk&&emptyChunkExits) {
        swal(
          {
            title: 'We are clearing the cache.',
            text: "Please Wait...",
            showConfirmButton: false,
            imageUrl: "assets/images/loader.gif",
            allowOutsideClick: false
          }
        );
        setTimeout(function () {
          window.location.reload();
        }, 5000);
  
      }
    }
    
  }
}
