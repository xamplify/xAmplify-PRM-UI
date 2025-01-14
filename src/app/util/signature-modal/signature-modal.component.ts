import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-signature-modal',
  templateUrl: './signature-modal.component.html',
  styleUrls: ['./signature-modal.component.css']
})
export class SignatureModalComponent implements AfterViewInit {
  @ViewChild('sigPad') sigPad: ElementRef;
  sigPadElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  isDrawing = false;
  img: string;

  ngAfterViewInit(): void {
    // Initialize canvas context once the modal is opened
    const canvas = this.sigPad.nativeElement as HTMLCanvasElement;
    this.sigPadElement = canvas;
    this.context = canvas.getContext('2d')!;
    this.context.strokeStyle = '#000';
    this.context.lineWidth = 2;
  }

  openModal(): void {
    // Trigger modal open logic and ensure canvas is properly set up
    setTimeout(() => {
      this.initializeCanvas();
    }, 0); // Small delay to allow DOM to render modal content
  }

  private initializeCanvas(): void {
    const canvas = this.sigPadElement;
    this.context = canvas.getContext('2d')!;
    this.context.strokeStyle = '#000';
    this.context.lineWidth = 2;

    // Optional: Resize canvas to fit the modal dynamically
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  onMouseDown(event: MouseEvent) {
    this.isDrawing = true;
    const coords = this.relativeCoords(event);
    this.context.moveTo(coords.x, coords.y);
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDrawing) return;

    const coords = this.relativeCoords(event);
    this.context.lineTo(coords.x, coords.y);
    this.context.stroke();
  }

  onMouseUp(): void {
    this.isDrawing = false;
    this.context.beginPath();
  }

  clear(): void {
    this.context.clearRect(0, 0, this.sigPadElement.width, this.sigPadElement.height);
  }

  save(): void {
    this.img = this.sigPadElement.toDataURL('image/png');
    console.log('Saved Image:', this.img);
  }

  private relativeCoords(event: MouseEvent): { x: number; y: number } {
    const rect = this.sigPadElement.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
}
