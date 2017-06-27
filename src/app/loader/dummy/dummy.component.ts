import { Component, OnInit, OnDestroy} from '@angular/core';
import { EmailTemplateService } from '../../email-template/services/email-template.service';

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.css']
})
export class DummyComponent implements OnInit {

    myVal:string = "";
  constructor(private emailTemplateService:EmailTemplateService) {
      this.emailTemplateService.get( 355 )
          .subscribe(
          ( data: any ) => {
             alert("chck dta");
             console.log(data);
             this.myVal = data.body;
          },
          ( error: string ) => {
             alert("error")
          }
          );

  
  }
  ngOnDestroy() {
  
  }
  ngOnInit() {
  }

}
