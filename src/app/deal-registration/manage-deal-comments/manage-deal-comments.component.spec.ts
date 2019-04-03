import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDealCommentsComponent } from './manage-deal-comments.component';

describe('ManageDealCommentsComponent', () => {
  let component: ManageDealCommentsComponent;
  let fixture: ComponentFixture<ManageDealCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDealCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDealCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
