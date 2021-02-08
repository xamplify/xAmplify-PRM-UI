import { Component, OnInit } from '@angular/core';

declare var Metronic ,Layout ,Demo ,ComponentsEditors:any;

@Component({
  selector: 'app-email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.css','../../../assets/css/summernote.css', '../../../assets/css/bootstrap-markdown.min.css',
               '../../../assets/css/bootstrap-wysihtml5.css']
})
export class EmailEditorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    }

}
