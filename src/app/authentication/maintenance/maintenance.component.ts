import { Component, OnInit, ElementRef, AfterViewInit, HostListener} from '@angular/core';

declare var $;
@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  route:string;
  constructor(private el: ElementRef) {}

  ngOnInit(): void {  $('#underMaintenanceSite').hide(); }

  // number countdown start
  ngAfterViewInit(): void {
    this.animateCount();
    this.animateCount1();
  }
  animateCount() {
    const element = this.el.nativeElement.querySelector('.count');
    const finalValue = parseInt(element.innerText, 10);
    let currentValue = 0;

    const animationInterval = setInterval(() => {
      if (currentValue < finalValue) {
        currentValue++;
        element.innerText = currentValue.toString();
      } else {
        clearInterval(animationInterval);
      }
    }, 40);
  }

  animateCount1() {
    const element = this.el.nativeElement.querySelector('.count1');
    const finalValue = parseInt(element.innerText, 10);
    let currentValue = 0;

    const animationInterval = setInterval(() => {
      if (currentValue < finalValue) {
        currentValue++;
        element.innerText = currentValue.toString();
      } else {
        clearInterval(animationInterval);
      }
    }, 40); // Adjust the interval for the desired animation speed
  }
   // number countdown end

  // header navbar start
  isNavbarBackgroundVisible: boolean = false;

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollY = window.scrollY;
    this.isNavbarBackgroundVisible = scrollY > 50;
  }
    // header navbar end

 alertClick(){
    $('#underMaintenanceSite').show(); 
}
hideAlert(){
  $('#underMaintenanceSite').hide(); 
}
homeRouter(){
  window.location.reload();
}
}