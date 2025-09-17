import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareLeadDetailsComponent } from './share-lead-details.component';

describe('ShareLeadDetailsComponent', () => {
  let component: ShareLeadDetailsComponent;
  let fixture: ComponentFixture<ShareLeadDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareLeadDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareLeadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
