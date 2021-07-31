
import { ErrorHandler, Injectable } from '@angular/core';
declare var swal: any;
@Injectable()
export class ClearChunkFile implements ErrorHandler {
  handleError(error: any): void {
    console.log(error);
    let message = error.message;
    console.log("chunk"+message);
    let emptyChunk = 'Loading chunk 0 failed';
    if (message!=undefined && message!="" && message.indexOf('chunk') > -1 && message.indexOf(emptyChunk)<0) {
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
