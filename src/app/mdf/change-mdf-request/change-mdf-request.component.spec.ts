import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeMdfRequestComponent } from './change-mdf-request.component';

describe('ChangeMdfRequestComponent', () => {
  let component: ChangeMdfRequestComponent;
  let fixture: ComponentFixture<ChangeMdfRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeMdfRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeMdfRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
