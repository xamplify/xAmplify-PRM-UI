import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAddLeadComponent } from './custom-add-lead.component';

describe('CustomAddLeadComponent', () => {
  let component: CustomAddLeadComponent;
  let fixture: ComponentFixture<CustomAddLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAddLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAddLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
