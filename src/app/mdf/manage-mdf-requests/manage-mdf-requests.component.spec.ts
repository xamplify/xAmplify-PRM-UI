import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMdfRequestsComponent } from './manage-mdf-requests.component';

describe('ManageMdfRequestsComponent', () => {
  let component: ManageMdfRequestsComponent;
  let fixture: ComponentFixture<ManageMdfRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMdfRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMdfRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
