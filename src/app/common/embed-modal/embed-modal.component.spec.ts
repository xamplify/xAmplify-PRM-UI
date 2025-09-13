import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedModalComponent } from './embed-modal.component';

describe('EmbedModalComponent', () => {
  let component: EmbedModalComponent;
  let fixture: ComponentFixture<EmbedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
