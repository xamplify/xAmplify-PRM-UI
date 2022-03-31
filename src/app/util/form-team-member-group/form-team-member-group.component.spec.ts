import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTeamMemberGroupComponent } from './form-team-member-group.component';

describe('FormTeamMemberGroupComponent', () => {
  let component: FormTeamMemberGroupComponent;
  let fixture: ComponentFixture<FormTeamMemberGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormTeamMemberGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormTeamMemberGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
