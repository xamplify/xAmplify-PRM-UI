import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMdfRequestFormComponent } from './manage-mdf-request-form.component';

describe('ManageMdfRequestFormComponent', () => {
  let component: ManageMdfRequestFormComponent;
  let fixture: ComponentFixture<ManageMdfRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMdfRequestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMdfRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
