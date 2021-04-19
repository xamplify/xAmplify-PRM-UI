import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewUserListComponent } from './preview-user-list.component';

describe('PreviewUserListComponent', () => {
  let component: PreviewUserListComponent;
  let fixture: ComponentFixture<PreviewUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
