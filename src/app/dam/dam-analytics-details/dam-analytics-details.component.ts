import { Component, OnInit, Input } from '@angular/core';
import { DamService } from '../services/dam.service';
import { DamPostDto } from '../models/dam-post-dto';
@Component({
  selector: 'app-dam-analytics-details',
  templateUrl: './dam-analytics-details.component.html',
  styleUrls: ['./dam-analytics-details.component.css']
})
export class DamAnalyticsDetailsComponent implements OnInit {
  damPostDto: DamPostDto = new DamPostDto();
  @Input() contentId: any;
  @Input() contentType: string;
  isDam: boolean = false;
  isTrack: boolean = false;
  isPlaybook: boolean = false;
  constructor(public damService: DamService) {
  }

  ngOnInit() {
    if(this.contentType == 'DAM'){
        this.isDam = true;
    } else if (this.contentType == 'TRACK') {
        this.isTrack = true;
    } else if (this.contentType == 'PLAYBOOK') {
        this.isPlaybook = true;
    }
    this.getDamDetailsByDamId();
  }
  getDamDetailsByDamId() {
    this.damService.getDamDetailsById(this.contentId, this.contentType).subscribe(
      response => {
        if (response.statusCode === 200) {
          this.damPostDto = response.data;
        } else {
          console.error("Error fetching DAM details:", response);
        }
      },
      error => {
        console.error("Error fetching DAM details:", error);
      }
    );
  }
}
