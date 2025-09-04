import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePublishComponent } from './manage-publish.component';

describe('ManagePublishComponent', () => {
  let component: ManagePublishComponent;
  let fixture: ComponentFixture<ManagePublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
