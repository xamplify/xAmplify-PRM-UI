import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmailTemplatesComponent } from './manage-email-templates.component';

describe('ManageEmailTemplatesComponent', () => {
  let component: ManageEmailTemplatesComponent;
  let fixture: ComponentFixture<ManageEmailTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageEmailTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageEmailTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
