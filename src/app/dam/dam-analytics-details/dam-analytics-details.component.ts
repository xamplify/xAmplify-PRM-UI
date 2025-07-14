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
  @Input() damId: any;
  constructor(public damService: DamService) {
  }

  ngOnInit() {
    this.getDamDetailsByDamId(this.damId);
  }
  getDamDetailsByDamId(damId: any) {
    this.damService.getDamDetailsById(damId).subscribe(
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
