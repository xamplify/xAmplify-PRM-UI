import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMdfDetailsComponent } from './manage-mdf-details.component';

describe('ManageMdfDetailsComponent', () => {
  let component: ManageMdfDetailsComponent;
  let fixture: ComponentFixture<ManageMdfDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMdfDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMdfDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
