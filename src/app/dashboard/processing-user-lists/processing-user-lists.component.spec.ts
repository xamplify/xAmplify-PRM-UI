import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingUserListsComponent } from './processing-user-lists.component';

describe('ProcessingUserListsComponent', () => {
  let component: ProcessingUserListsComponent;
  let fixture: ComponentFixture<ProcessingUserListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessingUserListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessingUserListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
